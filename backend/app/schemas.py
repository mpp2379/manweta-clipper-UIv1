from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------


class AuthUser(BaseModel):
    id: str
    name: str
    email: str
    profile_image: Optional[str] = None


class AuthMeResponse(BaseModel):
    authenticated: bool
    user: Optional[AuthUser] = None


# ---------------------------------------------------------------------------
# Clipper jobs — field names/shape match src/types.ts::ClipperJob exactly so
# the frontend can consume responses with zero mapping.
# ---------------------------------------------------------------------------


class BackendLogOut(BaseModel):
    id: str
    timestamp: str
    service: str
    level: Literal["info", "success", "warn", "error"]
    message: str


class WordTimestampOut(BaseModel):
    word: str
    start: float
    end: float
    confidence: Optional[float] = None
    speaker: Optional[str] = None


class HighlightSegmentOut(BaseModel):
    id: str
    title: str
    category: str
    startTime: float
    endTime: float
    duration: float
    score: float
    hook: str
    summary: str
    hookStrength: Optional[float] = None
    pacingScore: Optional[float] = None


class StyleConfigIn(BaseModel):
    model_config = ConfigDict(extra="allow")

    captionStyle: str = "hormozi"
    aspectRatio: str = "9:16"
    framing: str = "smart_speaker"
    fontSize: str = "lg"
    fontFamily: str = "display"
    textColor: str = "#FFFFFF"
    highlightColor: str = "#00FF85"
    showEmojis: bool = True
    position: str = "middle"
    musicTrack: str = "none"
    musicVolume: int = 0
    showBrandLogo: bool = False
    brandName: str = ""
    autoReOffsetTimestamps: bool = True
    customFontSizePx: Optional[int] = None


class ClipperJobOut(BaseModel):
    id: str
    title: str
    sourceType: str
    sourceUrl: Optional[str] = None
    sourceFileName: Optional[str] = None
    fileSizeMb: float
    durationSeconds: float
    resolution: Optional[str] = None
    fps: Optional[float] = None
    thumbnailUrl: str
    status: str
    currentStep: int
    progressPercent: int
    transcriptText: Optional[str] = None
    words: Optional[list[WordTimestampOut]] = None
    highlights: Optional[list[HighlightSegmentOut]] = None
    selectedHighlightId: Optional[str] = None
    customClipRange: list[float]
    styleConfig: dict[str, Any]
    createdAt: str
    completedAt: Optional[str] = None
    syncState: Optional[str] = "synced"
    backendLogs: Optional[list[BackendLogOut]] = None
    errorMessage: Optional[str] = None
    renderedVideoUrl: Optional[str] = None
    downloadUrl: Optional[str] = None


class RenderSelection(BaseModel):
    highlightId: Optional[str] = None
    customRange: Optional[list[float]] = None


class RenderRequest(BaseModel):
    selection: RenderSelection
    styleConfig: StyleConfigIn


class RenderAck(BaseModel):
    ok: bool
    jobId: str
    message: str
