export type PipelineStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type JobStatus =
  | 'queued'
  | 'transcribing'
  | 'analyzing'
  | 'awaiting_selection'
  | 'rendering'
  | 'done'
  | 'failed';

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  confidence?: number;
  speaker?: string;
}

export interface HighlightSegment {
  id: string;
  title: string;
  category: string;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  hook: string;
  summary: string;
  hookStrength?: number;
  pacingScore?: number;
}

export interface StyleConfig {
  captionStyle: 'hormozi' | 'beast' | 'clean' | 'neon' | 'karaoke' | string;
  aspectRatio: '9:16' | '1:1' | '16:9' | string;
  framing: 'smart_speaker' | 'fit' | 'fill' | 'split' | string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | string;
  fontFamily: 'display' | 'sans' | 'mono' | 'headline' | string;
  textColor: string;
  highlightColor: string;
  showEmojis: boolean;
  position: 'top' | 'middle' | 'bottom' | string;
  musicTrack: string;
  musicVolume: number;
  showBrandLogo: boolean;
  brandName: string;
  autoReOffsetTimestamps: boolean;
}

export interface BackendLog {
  id: string;
  timestamp: string;
  service: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface ClipperJob {
  id: string;
  title: string;
  sourceType: 'upload' | 'youtube' | 'sample';
  sourceUrl?: string;
  sourceFileName?: string;
  fileSizeMb: number;
  durationSeconds: number;
  resolution?: string;
  fps?: number;
  thumbnailUrl: string;
  status: JobStatus;
  currentStep: PipelineStepNumber;
  progressPercent: number;
  transcriptText?: string;
  words?: WordTimestamp[];
  highlights?: HighlightSegment[];
  selectedHighlightId?: string;
  customClipRange: [number, number];
  styleConfig: StyleConfig;
  createdAt: string;
  completedAt?: string;
  syncState?: 'synced' | 'pending_sync';
  backendLogs?: BackendLog[];
  errorMessage?: string;
  renderedVideoUrl?: string;
  downloadUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile_image?: string | null;
  plan: 'starter' | 'pro' | 'agency';
  creditsRemaining: number;
  creditsTotal: number;
  isGuest: boolean;
  joinedDate: string;
}

export interface SampleVideoTemplate {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  durationSec: number;
  videoUrl: string;
  category: string;
  channel: string;
  description: string;
  sampleHighlightsCount: number;
}

export interface PricingPlan {
  id: 'starter' | 'pro' | 'agency';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  minutesPerMonth: number;
  resolution: string;
  isPopular?: boolean;
  features: string[];
}
