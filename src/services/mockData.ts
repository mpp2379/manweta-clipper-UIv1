import { ClipperJob, HighlightSegment, PricingPlan, SampleVideoTemplate, WordTimestamp } from '../types';

export const SAMPLE_VIDEOS: SampleVideoTemplate[] = [
  {
    id: 'sample-1',
    title: 'How AI Foundation Models are Shifting Developer Leverage',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: '42:15',
    durationSec: 2535,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Technology',
    channel: 'The Future of AI Podcast',
    description: 'Deep dive into next-gen inference speed, context windows, and product market fit.',
    sampleHighlightsCount: 4,
  },
  {
    id: 'sample-2',
    title: 'The Psychology of High Performance Under Intense Pressure',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    duration: '28:40',
    durationSec: 1720,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Mindset',
    channel: 'Founder Uncut Sessions',
    description: 'Neuroscience principles for maintaining cognitive clarity during fundraising and growth.',
    sampleHighlightsCount: 5,
  },
  {
    id: 'sample-3',
    title: 'Building a $10M ARR SaaS with Zero External Funding',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    duration: '35:10',
    durationSec: 2110,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Startup',
    channel: 'Bootstrapped Founders Guild',
    description: 'Unit economics breakdown, customer acquisition channels, and pricing optimization.',
    sampleHighlightsCount: 3,
  },
  {
    id: 'sample-4',
    title: 'Mastering Cinematic Lighting for Short-Form Viral Content',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    duration: '19:45',
    durationSec: 1185,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Creative',
    channel: 'Visual Arts Lab',
    description: 'Three-point lighting hacks, rim lights, and color temperature tricks for smartphone creators.',
    sampleHighlightsCount: 4,
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Creator',
    monthlyPrice: 29,
    yearlyPrice: 19,
    minutesPerMonth: 120,
    resolution: '1080p Full HD',
    isPopular: false,
    features: [
      '120 transcription minutes/mo',
      'AI Virality scoring & highlights',
      '9:16 & 1:1 dynamic smart crop',
      'Standard subtitle animations',
      'Fast cloud rendering',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    monthlyPrice: 59,
    yearlyPrice: 39,
    minutesPerMonth: 480,
    resolution: '4K Ultra HD',
    isPopular: true,
    features: [
      '480 transcription minutes/mo',
      'Hormozi & Beast style animated captions',
      'Smart speaker face tracking framing',
      'Multi-speaker auto spotlight',
      'Custom brand kit & watermark removal',
      'Priority GPU render queue',
    ],
  },
  {
    id: 'agency',
    name: 'Agency & Media Team',
    monthlyPrice: 149,
    yearlyPrice: 99,
    minutesPerMonth: 1500,
    resolution: '4K ProRes + HDR',
    isPopular: false,
    features: [
      '1,500 transcription minutes/mo',
      'Unlimited export downloads',
      'Dedicated high-throughput GPU nodes',
      'Full API & Webhook access',
      'Custom fonts & subtitle presets',
      'Multi-seat team workspace',
    ],
  },
];

export function generateHighlightsForVideo(title: string, durationSec: number): HighlightSegment[] {
  const baseStart = Math.min(120, Math.floor(durationSec * 0.1));
  return [
    {
      id: 'hl-1',
      title: 'The Uncomfortable Truth About Initial Traction',
      category: 'Hot Take',
      startTime: baseStart + 22,
      endTime: baseStart + 67,
      duration: 45,
      score: 96,
      hook: 'If your product does not deliver instant gratification in the first 60 seconds, you lose 50% of conversions.',
      summary: 'Speaker explains why friction at signup destroys retention and why speed to dopamine is everything.',
      hookStrength: 98,
      pacingScore: 94,
    },
    {
      id: 'hl-2',
      title: 'Why Most Founders Fail at Distribution',
      category: 'Insight',
      startTime: baseStart + 85,
      endTime: baseStart + 128,
      duration: 43,
      score: 92,
      hook: 'Building a great product without distribution is like winking in the dark: you know what you are doing, but nobody else does.',
      summary: 'Breakdown of organic loop mechanics and why content-led growth outlasts paid acquisition.',
      hookStrength: 95,
      pacingScore: 90,
    },
    {
      id: 'hl-3',
      title: 'The 3-Step Cold Outreach Framework That Closes',
      category: 'How-to',
      startTime: baseStart + 160,
      endTime: baseStart + 198,
      duration: 38,
      score: 88,
      hook: 'Never ask for 15 minutes of someone’s time until you’ve already given them $1,000 worth of free value.',
      summary: 'Concrete script templates and psychological triggers that get 40%+ reply rates on LinkedIn.',
      hookStrength: 91,
      pacingScore: 86,
    },
    {
      id: 'hl-4',
      title: 'How We Scaled From $0 to $100K MRR in 90 Days',
      category: 'Story',
      startTime: baseStart + 230,
      endTime: baseStart + 285,
      duration: 55,
      score: 85,
      hook: 'We spent $0 on ads and instead turned our happiest customer into our primary video creator.',
      summary: 'The creator-led flywheel strategy that turned customer testimonials into high-converting TikTok reels.',
      hookStrength: 89,
      pacingScore: 82,
    },
  ];
}

export function generateSampleWordsForRange(startTime: number, endTime: number): WordTimestamp[] {
  const wordsText =
    'The biggest misconception about artificial intelligence is that speed equals understanding. When we launched the model we realized something extraordinary. If your product does not deliver instant gratification within the first sixty seconds, you lose fifty percent of conversions. That is why modern growth requires ruthlessly simplifying the hook, trimming the fat, and delivering value immediately.';
  const tokens = wordsText.split(' ');
  const total = tokens.length;
  const duration = Math.max(10, endTime - startTime);
  const step = duration / total;

  return tokens.map((w, idx) => ({
    word: w,
    start: Number((startTime + idx * step).toFixed(2)),
    end: Number((startTime + (idx + 1) * step).toFixed(2)),
    confidence: 0.96 + Math.random() * 0.03,
    speaker: 'Speaker 1',
  }));
}

export const INITIAL_JOBS: ClipperJob[] = [
  {
    id: 'job-default-1',
    title: SAMPLE_VIDEOS[0].title,
    sourceType: 'sample',
    sourceUrl: SAMPLE_VIDEOS[0].videoUrl,
    sourceFileName: 'podcast_episode_42.mp4',
    fileSizeMb: 620,
    durationSeconds: 2535,
    resolution: '1920x1080',
    fps: 60,
    thumbnailUrl: SAMPLE_VIDEOS[0].thumbnail,
    status: 'done',
    currentStep: 7,
    progressPercent: 100,
    transcriptText:
      'The biggest misconception about artificial intelligence is that speed equals understanding. If your product does not deliver instant gratification within the first sixty seconds, you lose fifty percent of conversions.',
    words: generateSampleWordsForRange(142, 187),
    highlights: generateHighlightsForVideo(SAMPLE_VIDEOS[0].title, 2535),
    selectedHighlightId: 'hl-1',
    customClipRange: [142, 187],
    styleConfig: {
      captionStyle: 'hormozi',
      aspectRatio: '9:16',
      framing: 'smart_speaker',
      fontSize: 'lg',
      fontFamily: 'display',
      textColor: '#FFFFFF',
      highlightColor: '#00FF85',
      showEmojis: true,
      position: 'middle',
      musicTrack: 'lo-fi-beats',
      musicVolume: 18,
      showBrandLogo: true,
      brandName: '@manweta.ai',
      autoReOffsetTimestamps: true,
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    syncState: 'synced',
    downloadUrl: SAMPLE_VIDEOS[0].videoUrl,
    renderedVideoUrl: SAMPLE_VIDEOS[0].videoUrl,
    backendLogs: [
      {
        id: 'log-01',
        timestamp: '14:20:01',
        service: 'OpenAI Whisper',
        level: 'success',
        message: 'Acoustic model decoded 3,420 words with word timestamps',
      },
      {
        id: 'log-02',
        timestamp: '14:20:15',
        service: 'GPT-4o-mini',
        level: 'success',
        message: 'Identified 4 viral moments with average 91% engagement hook score',
      },
      {
        id: 'log-03',
        timestamp: '14:21:04',
        service: 'FFmpeg Pipeline',
        level: 'success',
        message: 'Exported vertical 1080x1920 reel with burned Hormozi subtitles',
      },
    ],
  },
];
