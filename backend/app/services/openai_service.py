"""
OpenAI-only AI layer: Whisper transcription (with word timestamps) and
GPT-4o-mini highlight/virality scoring. No other model provider is called
anywhere in this backend.
"""
import json
import uuid

from openai import OpenAI

from ..config import settings

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


def transcribe_audio(audio_path: str) -> dict:
    """
    Calls Whisper (whisper-1) with word-level timestamps.
    Returns {"text": str, "words": [{"word","start","end"}...]}.
    """
    client = _get_client()
    with open(audio_path, "rb") as f:
        result = client.audio.transcriptions.create(
            model=settings.WHISPER_MODEL,
            file=f,
            response_format="verbose_json",
            timestamp_granularities=["word"],
        )

    data = result.model_dump() if hasattr(result, "model_dump") else json.loads(result.json())
    words = [
        {
            "word": w.get("word", "").strip(),
            "start": float(w.get("start", 0.0)),
            "end": float(w.get("end", 0.0)),
        }
        for w in data.get("words", [])
        if w.get("word")
    ]
    return {"text": data.get("text", ""), "words": words}


HIGHLIGHT_SYSTEM_PROMPT = """You are an expert short-form video editor who finds the most \
"viral-worthy" moments in long-form podcast/webinar transcripts for vertical clips \
(TikTok/Reels/Shorts). Given a transcript with timestamps, identify the strongest \
self-contained highlight segments.

Respond with ONLY a JSON object of the shape:
{"highlights": [
  {
    "title": "short punchy title",
    "category": "one or two words, e.g. 'Hot Take', 'Story', 'Advice', 'Controversial'",
    "startTime": <seconds, number>,
    "endTime": <seconds, number>,
    "hook": "the exact opening line/hook that grabs attention",
    "summary": "1-2 sentence summary of the moment",
    "score": <0-100 overall virality score>,
    "hookStrength": <0-100>,
    "pacingScore": <0-100>
  }
]}

Rules:
- Each highlight should be 20-90 seconds long.
- Pick 3-6 non-overlapping highlights, ordered by score descending.
- Timestamps must fall within the transcript's actual time range.
- Do not include any text outside the JSON object.
"""


def analyze_highlights(transcript_text: str, words: list[dict], duration_seconds: float) -> list[dict]:
    """
    Calls GPT-4o-mini to score highlight-worthy moments. Falls back to a single
    naive highlight spanning the middle of the video if the model call fails
    or returns something we can't parse, so the pipeline never gets stuck.
    """
    client = _get_client()

    # Keep the prompt small: word list with timestamps, sampled if huge.
    compact_words = words[:4000]
    transcript_payload = {
        "duration_seconds": duration_seconds,
        "transcript_text": transcript_text[:12000],
        "words": compact_words,
    }

    try:
        resp = client.chat.completions.create(
            model=settings.HIGHLIGHT_MODEL,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": HIGHLIGHT_SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(transcript_payload)},
            ],
            temperature=0.4,
        )
        content = resp.choices[0].message.content
        parsed = json.loads(content)
        raw_highlights = parsed.get("highlights", [])
        if not raw_highlights:
            raise ValueError("empty highlights")
    except Exception:
        mid = max(0.0, duration_seconds / 2 - 30)
        raw_highlights = [
            {
                "title": "Key moment",
                "category": "Highlight",
                "startTime": mid,
                "endTime": min(duration_seconds, mid + 60),
                "hook": transcript_text[:80] or "Highlight",
                "summary": "Automatically selected midpoint segment (AI scoring unavailable).",
                "score": 50,
                "hookStrength": 50,
                "pacingScore": 50,
            }
        ]

    highlights = []
    for h in raw_highlights:
        start = max(0.0, float(h.get("startTime", 0)))
        end = max(start + 1.0, float(h.get("endTime", start + 30)))
        end = min(end, duration_seconds) if duration_seconds else end
        highlights.append(
            {
                "id": f"hl_{uuid.uuid4().hex[:12]}",
                "title": h.get("title", "Highlight"),
                "category": h.get("category", "Highlight"),
                "startTime": start,
                "endTime": end,
                "duration": round(end - start, 2),
                "score": float(h.get("score", 50)),
                "hook": h.get("hook", ""),
                "summary": h.get("summary", ""),
                "hookStrength": float(h.get("hookStrength", h.get("score", 50))),
                "pacingScore": float(h.get("pacingScore", h.get("score", 50))),
            }
        )

    highlights.sort(key=lambda h: h["score"], reverse=True)
    return highlights
