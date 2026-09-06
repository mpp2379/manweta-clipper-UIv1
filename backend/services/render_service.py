"""
Video processing via system ffmpeg/ffprobe (subprocess). No cloud video API is used.

Requires the `ffmpeg` and `ffprobe` binaries to be present on PATH.
The Dockerfile installs these via apt (package: ffmpeg).
"""

import json
import os
import subprocess

ASPECT_DIMENSIONS = {
    "9:16": (1080, 1920),
    "1:1": (1080, 1080),
    "16:9": (1920, 1080),
}

CAPTION_STYLES = {
    # (fontname, primary color &HBBGGRR&, outline color, fontsize, bold)
    "hormozi": dict(font="Arial Black", primary="&H0000FFFF", outline="&H00000000", size=72, bold=1),
    "karaoke": dict(font="Arial", primary="&H00FF66FF", outline="&H00330033", size=64, bold=1),
    "neon": dict(font="Arial", primary="&H00FFFF00", outline="&H00990099", size=64, bold=1),
    "minimal": dict(font="Helvetica", primary="&H00FFFFFF", outline="&H00202020", size=52, bold=0),
    "beast": dict(font="Arial Black", primary="&H0000A5FF", outline="&H00000000", size=76, bold=1),
    "classic": dict(font="Arial", primary="&H00FFFFFF", outline="&H00000000", size=48, bold=0),
}


def _run(cmd: list):
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{proc.stderr.decode(errors='ignore')}")
    return proc.stdout.decode(errors="ignore")


def probe_video(path: str) -> dict:
    out = _run([
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", "-show_streams", path,
    ])
    data = json.loads(out)
    video_stream = next((s for s in data["streams"] if s["codec_type"] == "video"), {})
    duration = float(data.get("format", {}).get("duration", 0) or 0)
    fps = 30
    if video_stream.get("avg_frame_rate") and video_stream["avg_frame_rate"] != "0/0":
        num, den = video_stream["avg_frame_rate"].split("/")
        fps = round(float(num) / float(den)) if float(den) else 30
    return {
        "duration_seconds": duration,
        "width": video_stream.get("width"),
        "height": video_stream.get("height"),
        "fps": fps,
        "resolution": f'{video_stream.get("width")}x{video_stream.get("height")}',
    }


def extract_audio(video_path: str, audio_out_path: str):
    _run([
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-ar", "16000", "-ac", "1", "-b:a", "64k",
        audio_out_path,
    ])


def generate_thumbnail(video_path: str, thumb_out_path: str, at_seconds: float = 1.0):
    _run([
        "ffmpeg", "-y", "-ss", str(at_seconds), "-i", video_path,
        "-frames:v", "1", "-q:v", "3", thumb_out_path,
    ])


def _ass_timestamp(seconds: float) -> str:
    seconds = max(0.0, seconds)
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int(round((seconds - int(seconds)) * 100))
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def build_ass_subtitles(words: list, clip_start: float, clip_end: float,
                         style_config: dict, out_path: str, target_w: int, target_h: int):
    """
    Builds a .ass subtitle file, grouping words into ~4-word caption chunks
    timed to the original word timestamps, re-based to start at 0 for the clip.
    """
    preset = CAPTION_STYLES.get(style_config.get("captionStyle", "classic"), CAPTION_STYLES["classic"])
    position = style_config.get("position", "bottom")
    margin_v = 80 if position == "bottom" else (target_h // 2 - 40 if position == "middle" else 40)
    alignment = 2  # bottom-center; ASS \an tag also set per-line

    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {target_w}
PlayResY: {target_h}
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,{preset['font']},{preset['size']},{preset['primary']},{preset['outline']},&H00000000,{preset['bold']},0,1,4,0,{alignment},40,40,{margin_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    lines = []
    clip_words = [w for w in words if w["start"] >= clip_start and w["end"] <= clip_end]
    chunk = []
    for w in clip_words:
        chunk.append(w)
        if len(chunk) >= 4 or w is clip_words[-1]:
            start = chunk[0]["start"] - clip_start
            end = chunk[-1]["end"] - clip_start
            text = " ".join(c["word"].strip() for c in chunk).upper() \
                if style_config.get("captionStyle") == "hormozi" else \
                " ".join(c["word"].strip() for c in chunk)
            lines.append(
                f"Dialogue: 0,{_ass_timestamp(start)},{_ass_timestamp(end)},Default,,0,0,0,,{text}"
            )
            chunk = []

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("\n".join(lines))


def render_clip(input_path: str, output_path: str, start: float, end: float,
                 aspect_ratio: str, framing: str, ass_path: str = None):
    target_w, target_h = ASPECT_DIMENSIONS.get(aspect_ratio, ASPECT_DIMENSIONS["9:16"])

    # Crop-then-scale to the target aspect ratio. "smart_speaker" framing is a
    # TODO for a face-tracking crop; for now all modes center-crop.
    vf_filters = [
        f"crop='min(iw,ih*{target_w}/{target_h})':'min(ih,iw*{target_h}/{target_w})'",
        f"scale={target_w}:{target_h}",
    ]
    if ass_path and os.path.exists(ass_path):
        escaped = ass_path.replace("\\", "/").replace(":", "\\:")
        vf_filters.append(f"ass='{escaped}'")

    vf = ",".join(vf_filters)

    _run([
        "ffmpeg", "-y",
        "-ss", str(start), "-to", str(end),
        "-i", input_path,
        "-vf", vf,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
        "-c:a", "aac", "-b:a", "128k",
        output_path,
    ])
