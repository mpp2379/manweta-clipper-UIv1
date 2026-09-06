"""
All AI calls for the Clipper pipeline go through OpenAI ONLY:
  - gpt-4o-transcribe / whisper-1  -> transcription with word-level timestamps
  - gpt-4o-mini (or gpt-4o)        -> highlight / virality analysis (structured JSON)

No other model provider is used anywhere in this backend.
"""

import json
import os

from openai import OpenAI

_client = None


def client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        _client = OpenAI(api_key=api_key)
    return _client


TRANSCRIBE_MODEL = os.getenv("OPENAI_TRANSCRIBE_MODEL", "whisper-1")
ANALYSIS_MODEL = os.getenv("OPENAI_ANALYSIS_MODEL", "gpt-4o-mini")


def transcribe_audio(audio_path: str) -> dict:
    """
    Calls OpenAI's transcription endpoint with word-level timestamps.
    Returns {"text": str, "words": [{"word","start","end"}, ...]}
    """
    with open(audio_path, "rb") as f:
        result = client().audio.transcriptions.create(
            model=TRANSCRIBE_MODEL,
            file=f,
            response_format="verbose_json",
            timestamp_granularities=["word"],
        )

    data = result.model_dump() if hasattr(result, "model_dump") else dict(result)
    words = []
    for w in data.get("words", []) or []:
        words.append({
            "word": w.get("word", ""),
            "start": float(w.get("start", 0.0)),
            "end": float(w.get("end", 0.0)),
        })

    return {"text": data.get("text", ""), "words": words}


HIGHLIGHT_SYSTEM_PROMPT = """You are a viral short-form video editor (think Hormozi-style clippers).
Given a transcript with timestamps, identify the strongest standalone clips (30-90 seconds each)
that would perform well as vertical short-form reels (Reels/Shorts/TikTok).

Return STRICT JSON only, matching this shape:
{
  "highlights": [
    {
      "title": "short punchy title",
      "hook": "the exact opening line/hook, <= 15 words",
      "summary": "1-2 sentence summary of the clip",
      "score": 0-100,
      "startTime": number (seconds, must align to a real word boundary in transcript),
      "endTime": number (seconds),
      "viralityGrade": "A+" | "A" | "B+" | "B",
      "category": "Insight" | "Story" | "Hot Take" | "How-to" | "Punchline" | "Mindset",
      "pacingScore": 0-100,
      "hookStrength": 0-100,
      "tags": ["..."]
    }
  ]
}
Return 3 to 6 highlights, ranked by score descending. No prose outside the JSON.
"""


def analyze_highlights(transcript_text: str, words: list) -> list:
    """
    Sends the transcript to GPT and returns a list of highlight dicts
    matching the frontend's HighlightSegment shape (minus id/duration/audioEnergy,
    which are filled in by job_service).
    """
    # Keep the payload compact: send text + a light word/timestamp index.
    condensed_words = [
        {"w": w["word"], "s": round(w["start"], 2), "e": round(w["end"], 2)}
        for w in words
    ]

    user_payload = {
        "transcript": transcript_text,
        "word_timestamps": condensed_words[:4000],  # guard against extreme lengths
    }

    response = client().chat.completions.create(
        model=ANALYSIS_MODEL,
        messages=[
            {"role": "system", "content": HIGHLIGHT_SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(user_payload)},
        ],
        response_format={"type": "json_object"},
        temperature=0.4,
    )

    raw = response.choices[0].message.content
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return []

    return parsed.get("highlights", [])
