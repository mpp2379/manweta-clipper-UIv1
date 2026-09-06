/**
 * Manweta AI - Types & Data Models
 * Video to Viral Reels Clipper Pipeline
 */

export type JobStatus =
  | 'queued'
  | 'transcribing'
  | 'analyzing'
  | 'awaiting_selection'
  | 'rendering'
  | 'done'
  | 'failed';

export type PipelineStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WordTimestamp {
  word: string;
  start: number; // in seconds from source start
  end: number;   // in seconds from source start
  confidence?: number;
  speaker?: string;
}

export interface HighlightSegment {
  id: string;
  title: string;
  hook: string;
  summary: string;
  score: number; // 0 - 100
  startTime: number; // in seconds
  endTime: number;   // in seconds
  duration: number;  // in seconds
  viralityGrade: 'A+' | 'A' | 'B+' | 'B';
  category: 'Insight' | 'Story' | 'Hot Take' | 'How-to' | 'Punchline' | 'Mindset';
  pacingScore: number; // 0 - 100
  hookStrength: number; // 0 - 100
  audioEnergy: number[]; // waveform mini data
  tags: string[];
}

export type CaptionStylePreset =
  | 'hormozi'     // Bold yellow/green punch words on black stroke
  | 'karaoke'     // Active word glows bright violet/white bounce
  | 'neon'        // Vibrant cyan/pink glow with dark outline
  | 'minimal'     // Elegant white sans-serif with subtle backing box
  | 'beast'       // High-energy staggered animated text with emoji
  | 'classic';    // Standard clean broadcast subtitles

export type AspectRatio = '9:16' | '1:1' | '16:9';

export type CropFramingMode = 'center' | 'smart_speaker' | 'split_screen';

export interface StyleConfig {
  captionStyle: CaptionStylePreset;
  aspectRatio: AspectRatio;
  framing: CropFramingMode;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'display' | 'sans' | 'impact';
  textColor: string;
  highlightColor: string;
  showEmojis: boolean;
  position: 'bottom' | 'middle' | 'top';
  musicTrack: string;
  musicVolume: number; // 0 to 100
  showBrandLogo: boolean;
  brandName?: string;
  autoReOffsetTimestamps: boolean; // Keep captions in sync starting at 0:00 of clip
}

export interface BackendLog {
  id: string;
  timestamp: string;
  service: 'ffprobe' | 'S3' | 'Whisper' | 'LLM_Analyzer' | 'Queue' | 'FFmpeg' | 'WebSocket';
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export interface ClipperJob {
  id: string;
  title: string;
  sourceType: 'upload' | 'youtube' | 'vimeo' | 'loom' | 'sample';
  sourceUrl: string;
  sourceFileName?: string;
  fileSizeMb: number;
  durationSeconds: number;
  resolution: string;
  fps: number;
  thumbnailUrl: string;
  
  // Pipeline State
  status: JobStatus;
  currentStep: PipelineStepNumber;
  progressPercent: number;
  errorMessage?: string;
  
  // Transcript Data
  transcriptText: string;
  words: WordTimestamp[];
  
  // Highlights
  highlights: HighlightSegment[];
  selectedHighlightId?: string;
  customClipRange: [number, number]; // [startSec, endSec]
  
  // Styles & Output
  styleConfig: StyleConfig;
  renderedVideoUrl?: string;
  downloadUrl?: string;
  renderDurationSec?: number;
  
  // Metadata & Offline
  createdAt: string;
  completedAt?: string;
  syncState: 'synced' | 'pending_sync' | 'offline_draft';
  backendLogs: BackendLog[];
  ffmpegCommandPreview?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  creditsRemaining: number; // in minutes of video
  creditsTotal: number;
  isGuest: boolean;
  joinedDate: string;
}

export interface PricingPlan {
  id: 'starter' | 'pro' | 'agency';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  minutesPerMonth: number;
  resolution: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
}

export interface SampleVideoTemplate {
  id: string;
  title: string;
  channel: string;
  category: string;
  duration: string;
  durationSec: number;
  thumbnail: string;
  videoUrl: string;
  sourceType: 'youtube' | 'sample';
  description: string;
  sampleHighlightsCount: number;
}
