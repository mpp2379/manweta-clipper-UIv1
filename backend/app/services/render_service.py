"""
ffmpeg/ffprobe pipeline: probe uploaded media, extract a small audio track for
Whisper, generate burned-in ASS captions, and render the final vertical/square/
horizontal clip.

Framing note (see README §6, item 7): all framing modes currently resolve to
the same "cover + center-crop" behavior. Real speaker-tracking ("smart_speaker")
needs a face/motion-detection pass before the crop filter — that's future work,
not implemented here.
"""
import json
import shutil
import subprocess
from pathlib import Path

from ..config import TMP_DIR

ASPECT_DIMENSIONS = {
    "9:16": (1080, 1920),
    "1:1": (1080, 1080),
    "16:9": (1920, 1080),
}

FONT_FAMILY_MAP = {
    "display": "Arial Black",
    "sans": "Arial",
    "mono": "Consolas",
    "headline": "Impact",
}

FONT_SIZE_MAP = {
    "sm": 46,
    "md": 60,
    "lg": 78,
    "xl": 96,
}

# ASS numpad alignment: 8 = top-center, 5 = middle-center, 2 = bottom-center
POSITION_ALIGN_MAP = {"top": 8, "middle": 5, "bottom": 2}


class FFmpegError(RuntimeError):
    pass


def _run(cmd: list[str]) -> str:
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        raise FFmpegError(proc.stderr[-4000:] if proc.stderr else f"Command failed: {' '.join(cmd)}")
    return proc.stdout


def ensure_ffmpeg_available() -> None:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise FFmpegError("ffmpeg/ffprobe not found on PATH. Install ffmpeg on this host.")


def probe(path: str) -> dict:
    """Returns {duration_seconds, resolution, fps}."""
    ensure_ffmpeg_available()
    out = _run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,r_frame_rate",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            path,
        ]
    )
    data = json.loads(out)
    fmt = data.get("format", {})
    streams = data.get("streams", [])
    duration = float(fmt.get("duration", 0.0) or 0.0)

    resolution, fps = None, None
    if streams:
        s = streams[0]
        width, height = s.get("width"), s.get("height")
        if width and height:
            resolution = f"{width}x{height}"
        rate = s.get("r_frame_rate")  # e.g. "30000/1001"
        if rate and "/" in rate:
            num, den = rate.split("/")
            try:
                fps = round(float(num) / float(den), 2) if float(den) else None
            except ZeroDivisionError:
                fps = None

    return {"duration_seconds": duration, "resolution": resolution, "fps": fps}


def extract_audio(video_path: str, out_path: str) -> str:
    """Extracts a small mono 16kHz mp3 track so Whisper stays under its 25MB limit."""
    ensure_ffmpeg_available()
    _run(
        [
            "ffmpeg",
            "-y",
            "-i",
            video_path,
            "-vn",
            "-ac",
            "1",
            "-ar",
            "16000",
            "-b:a",
            "64k",
            out_path,
        ]
    )
    return out_path


def _hex_to_ass_color(hex_color: str) -> str:
    hex_color = (hex_color or "#FFFFFF").lstrip("#")
    if len(hex_color) != 6:
        hex_color = "FFFFFF"
    r, g, b = hex_color[0:2], hex_color[2:4], hex_color[4:6]
    return f"&H00{b}{g}{r}".upper()  # ASS wants &HAABBGGRR (alpha 00 = opaque)


def build_ass_captions(
    words: list[dict],
    clip_start: float,
    clip_end: float,
    style: dict,
    video_width: int,
    video_height: int,
    out_path: str,
) -> str:
    """
    Builds a burned-in caption track: one short caption burst per word (or small
    group), styled per the job's StyleConfig (font, size, color, position).
    """
    font_name = FONT_FAMILY_MAP.get(style.get("fontFamily"), "Arial Black")
    base_size = style.get("customFontSizePx") or FONT_SIZE_MAP.get(style.get("fontSize"), 72)
    # Scale font relative to a 1080-wide reference so it looks right at any output size.
    font_size = max(18, round(base_size * (video_width / 1080)))
    align = POSITION_ALIGN_MAP.get(style.get("position"), 2)
    primary = _hex_to_ass_color(style.get("textColor", "#FFFFFF"))
    highlight = _hex_to_ass_color(style.get("highlightColor", "#00FF85"))
    margin_v = round(video_height * 0.12)

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {video_width}
PlayResY: {video_height}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,{font_name},{font_size},{primary},{primary},&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,{align},60,60,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    def fmt_ts(t: float) -> str:
        t = max(0.0, t)
        h = int(t // 3600)
        m = int((t % 3600) // 60)
        s = t % 60
        return f"{h:d}:{m:02d}:{s:05.2f}"

    relevant = [w for w in words if w["end"] > clip_start and w["start"] < clip_end]

    lines = []
    for w in relevant:
        start = max(0.0, w["start"] - clip_start)
        end = max(start + 0.05, min(w["end"], clip_end) - clip_start)
        text = w["word"].strip().upper()
        if not text:
            continue
        styled_text = f"{{\\c{highlight}}}{text}{{\\c{primary}}}"
        lines.append(f"Dialogue: 0,{fmt_ts(start)},{fmt_ts(end)},Caption,,0,0,0,,{styled_text}")

    Path(out_path).write_text(header + "\n".join(lines) + "\n", encoding="utf-8")
    return out_path


def render_clip(
    input_path: str,
    output_path: str,
    clip_start: float,
    clip_end: float,
    aspect_ratio: str,
    ass_path: str | None,
) -> None:
    ensure_ffmpeg_available()
    width, height = ASPECT_DIMENSIONS.get(aspect_ratio, ASPECT_DIMENSIONS["9:16"])
    duration = max(0.5, clip_end - clip_start)

    vf_parts = [
        f"scale=w={width}:h={height}:force_original_aspect_ratio=increase",
        f"crop={width}:{height}",
    ]
    if ass_path:
        # ffmpeg filter paths need escaping on Windows-style separators/colons;
        # on POSIX this is just the raw path.
        escaped = ass_path.replace("\\", "\\\\").replace(":", "\\:")
        vf_parts.append(f"ass='{escaped}'")

    cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        f"{clip_start}",
        "-i",
        input_path,
        "-t",
        f"{duration}",
        "-vf",
        ",".join(vf_parts),
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "20",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        output_path,
    ]
    _run(cmd)
