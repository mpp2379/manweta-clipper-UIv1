import { SampleVideoTemplate, ClipperJob, HighlightSegment, WordTimestamp } from '../types';

export const SAMPLE_VIDEOS: SampleVideoTemplate[] = [
  {
    id: 'sam-altman-podcast',
    title: 'Sam Altman on OpenAI, AGI Milestones & The Next Computing Shift',
    channel: 'Lex Fridman Podcast #412',
    category: 'AI & Technology',
    duration: '02:14:30',
    durationSec: 8070,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    sourceType: 'youtube',
    description: 'Deep dive into next-generation reasoning models, energy constraints for compute clusters, and what founders must know in 2026.',
    sampleHighlightsCount: 6,
  },
  {
    id: 'yc-startup-scale',
    title: 'How to Scale from Zero to $10M ARR Without Paid Marketing',
    channel: 'Y Combinator Founder School',
    category: 'Startup & SaaS',
    duration: '48:15',
    durationSec: 2895,
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    sourceType: 'youtube',
    description: 'The exact framework top tier seed founders use to validate distribution velocity and retain enterprise customers.',
    sampleHighlightsCount: 4,
  },
  {
    id: 'huberman-focus-dopamine',
    title: 'Neuroscience of Deep Work, Focus Cycles & Dopamine Reset',
    channel: 'Huberman Lab Essentials',
    category: 'Health & Mindset',
    duration: '01:32:10',
    durationSec: 5530,
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sourceType: 'youtube',
    description: 'Actionable biological protocols to optimize afternoon cognitive recovery and sustained creative output.',
    sampleHighlightsCount: 5,
  },
  {
    id: 'tech-developer-keynote',
    title: 'Building Autonomous AI Coding Workflows in Production',
    channel: 'Modern Dev Summit 2026',
    category: 'Software Engineering',
    duration: '35:40',
    durationSec: 2140,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    sourceType: 'youtube',
    description: 'Architecture breakdown of edge container sandboxing, sub-second latency proxies, and real-time AST transformations.',
    sampleHighlightsCount: 3,
  }
];

// Rich sample words with realistic Whisper timestamps
export function generateSampleWordsForRange(startSec: number, endSec: number): WordTimestamp[] {
  const sampleSentences = [
    "The biggest misconception about artificial intelligence is that speed equals understanding.",
    "When we launched the model we realized something extraordinary about how users interact.",
    "You have to ruthlessly protect your focus from micro distractions throughout the day.",
    "If your product does not deliver instant gratification within the first sixty seconds you lose fifty percent of conversions.",
    "Every single breakthrough in human history came from someone daring to challenge the established consensus.",
    "In twenty twenty six the cost of building software dropped by ninety percent but the value of taste skyrocketed.",
    "Look at how fast the paradigm shifted from manual coding to orchestrating intelligent agents.",
    "The secret to organic viral growth is creating high-signal short form content consistently."
  ];

  const wordsList: WordTimestamp[] = [];
  let currentTime = startSec;
  let sIndex = 0;

  while (currentTime < endSec) {
    const sentence = sampleSentences[sIndex % sampleSentences.length];
    const words = sentence.split(' ');
    for (const w of words) {
      if (currentTime >= endSec) break;
      const duration = 0.22 + Math.random() * 0.25;
      wordsList.push({
        word: w,
        start: parseFloat(currentTime.toFixed(2)),
        end: parseFloat((currentTime + duration).toFixed(2)),
        confidence: 0.94 + Math.random() * 0.05,
        speaker: 'Speaker 1'
      });
      currentTime += duration + 0.05; // tiny pause between words
    }
    currentTime += 0.3; // sentence break
    sIndex++;
  }

  return wordsList;
}

export function generateHighlightsForVideo(title: string, durationSec: number): HighlightSegment[] {
  return [
    {
      id: 'hl-1',
      title: 'The Brutal Truth About Scaling to $10M',
      hook: '"If you need ads to grow in year one, your product is already dead."',
      summary: 'Reveals why organic customer advocacy beats paid ad spend every time, backed by metric cohorts.',
      score: 96,
      startTime: 142,
      endTime: 187,
      duration: 45,
      viralityGrade: 'A+',
      category: 'Hot Take',
      hookStrength: 98,
      pacingScore: 94,
      tags: ['#GrowthHacking', '#SaaS', '#Founders'],
      audioEnergy: [20, 35, 80, 95, 90, 85, 70, 88, 92, 99, 85, 60, 75, 82, 65, 40]
    },
    {
      id: 'hl-2',
      title: 'The 3-Second Retention Secret for Reels',
      hook: '"Why 90% of viewers swipe away before you even finish your intro sentence."',
      summary: 'Breakdown of dynamic visual pattern interrupts and auditory hooks in the first 2.5 seconds.',
      score: 92,
      startTime: 320,
      endTime: 362,
      duration: 42,
      viralityGrade: 'A+',
      category: 'How-to',
      hookStrength: 95,
      pacingScore: 91,
      tags: ['#ContentCreator', '#ViralMarketing', '#TikTokTips'],
      audioEnergy: [40, 60, 92, 98, 88, 75, 90, 85, 94, 88, 70, 65, 80, 78, 60, 50]
    },
    {
      id: 'hl-3',
      title: 'The AI Shift Nobody is Talking About',
      hook: '"The biggest leverage in the next 3 years is not writing code, it is defining taste."',
      summary: 'Why execution commoditizes while curation and product intuition become the ultimate moat.',
      score: 88,
      startTime: 610,
      endTime: 658,
      duration: 48,
      viralityGrade: 'A',
      category: 'Insight',
      hookStrength: 89,
      pacingScore: 87,
      tags: ['#ArtificialIntelligence', '#FutureOfTech', '#CareerAdvice'],
      audioEnergy: [30, 45, 70, 85, 80, 78, 82, 86, 90, 82, 75, 68, 72, 65, 55, 40]
    },
    {
      id: 'hl-4',
      title: 'The Daily Dopamine Protocol for High Output',
      hook: '"Stop checking your phone within 60 minutes of waking up. Here is what happens to your brain."',
      summary: 'Biological explanation of adenosine clearance and cortisol peak optimization.',
      score: 85,
      startTime: 940,
      endTime: 978,
      duration: 38,
      viralityGrade: 'B+',
      category: 'Mindset',
      hookStrength: 87,
      pacingScore: 84,
      tags: ['#Biohacking', '#Productivity', '#Mindset'],
      audioEnergy: [25, 40, 65, 80, 85, 78, 82, 80, 88, 79, 70, 60, 65, 55, 45, 30]
    }
  ];
}

export const INITIAL_JOBS: ClipperJob[] = [
  {
    id: 'job-demo-01',
    title: 'Sam Altman on OpenAI, AGI Milestones & The Next Shift',
    sourceType: 'youtube',
    sourceUrl: 'https://youtube.com/watch?v=sample123',
    sourceFileName: 'lex_fridman_412_sam_altman.mp4',
    fileSizeMb: 1420.5,
    durationSeconds: 8070,
    resolution: '1920x1080 (1080p)',
    fps: 60,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    status: 'done',
    currentStep: 7,
    progressPercent: 100,
    transcriptText: "The biggest misconception about artificial intelligence is that speed equals understanding. When we launched the model we realized something extraordinary about how users interact. If you need ads to grow in year one, your product is already dead.",
    words: generateSampleWordsForRange(142, 187),
    highlights: generateHighlightsForVideo('Sam Altman', 8070),
    selectedHighlightId: 'hl-1',
    customClipRange: [142, 187],
    styleConfig: {
      captionStyle: 'hormozi',
      aspectRatio: '9:16',
      framing: 'smart_speaker',
      fontSize: 'lg',
      fontFamily: 'display',
      textColor: '#FFFFFF',
      highlightColor: '#FACC15', // Vibrant Yellow
      showEmojis: true,
      position: 'middle',
      musicTrack: 'lo-fi-beats',
      musicVolume: 18,
      showBrandLogo: true,
      brandName: '@manweta.ai',
      autoReOffsetTimestamps: true,
    },
    renderedVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    downloadUrl: '#',
    renderDurationSec: 45,
    createdAt: '2026-08-30T19:15:00.000Z',
    completedAt: '2026-08-30T19:18:22.000Z',
    syncState: 'synced',
    backendLogs: [
      { id: 'b1', timestamp: '19:15:02', service: 'ffprobe', level: 'success', message: 'Analyzed stream 1080p60 H.264 AAC audio' },
      { id: 'b2', timestamp: '19:15:05', service: 'S3', level: 'success', message: 'Multipart upload completed: s3://manweta-raw-videos/job-demo-01.mp4' },
      { id: 'b3', timestamp: '19:15:35', service: 'Whisper', level: 'success', message: 'Transcription complete (8,070s audio -> 14,280 words with timestamps)' },
      { id: 'b4', timestamp: '19:15:48', service: 'LLM_Analyzer', level: 'success', message: 'Hook strength analysis scored 4 viral candidate segments' },
      { id: 'b5', timestamp: '19:16:10', service: 'Queue', level: 'info', message: 'User picked highlight #hl-1 (142s - 187s). Render queued' },
      { id: 'b6', timestamp: '19:17:45', service: 'FFmpeg', level: 'success', message: 'Center-cropped 9:16, burned captions re-offset to 0:00, mixed lo-fi audio' },
      { id: 'b7', timestamp: '19:18:22', service: 'S3', level: 'success', message: 'Uploaded 45s reel MP4 to s3://manweta-renders/job-demo-01_reel.mp4' }
    ],
    ffmpegCommandPreview: `ffmpeg -ss 00:02:22 -to 00:03:07 -i source.mp4 -vf "crop=ih*(9/16):ih:x=(iw-ow)/2,subtitles=captions_reoffset.ass" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k output_reel_9x16.mp4`
  },
  {
    id: 'job-demo-02',
    title: 'How to Scale from Zero to $10M ARR Without Paid Ads',
    sourceType: 'upload',
    sourceFileName: 'yc_startup_school_recording.mp4',
    sourceUrl: 'https://sample-storage/yc.mp4',
    fileSizeMb: 680.2,
    durationSeconds: 2895,
    resolution: '1920x1080 (1080p)',
    fps: 30,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
    status: 'awaiting_selection',
    currentStep: 4,
    progressPercent: 60,
    transcriptText: "If your product does not deliver instant gratification within the first sixty seconds you lose fifty percent of conversions. Look at how fast the paradigm shifted.",
    words: generateSampleWordsForRange(320, 362),
    highlights: generateHighlightsForVideo('YC Scale', 2895),
    selectedHighlightId: 'hl-2',
    customClipRange: [320, 362],
    styleConfig: {
      captionStyle: 'neon',
      aspectRatio: '9:16',
      framing: 'center',
      fontSize: 'md',
      fontFamily: 'sans',
      textColor: '#FFFFFF',
      highlightColor: '#06B6D4', // Cyan
      showEmojis: true,
      position: 'bottom',
      musicTrack: 'cinematic-energy',
      musicVolume: 15,
      showBrandLogo: false,
      autoReOffsetTimestamps: true,
    },
    createdAt: '2026-08-30T20:10:00.000Z',
    syncState: 'synced',
    backendLogs: [
      { id: 'b10', timestamp: '20:10:01', service: 'ffprobe', level: 'success', message: 'Stream verified: 1080p30 H.264' },
      { id: 'b11', timestamp: '20:10:15', service: 'S3', level: 'success', message: 'Payload uploaded to s3://manweta-raw-videos/job-demo-02.mp4' },
      { id: 'b12', timestamp: '20:11:00', service: 'Whisper', level: 'success', message: 'Generated 4,250 word tokens with word confidence > 0.96' },
      { id: 'b13', timestamp: '20:11:20', service: 'LLM_Analyzer', level: 'success', message: 'Ranked 4 highlight hooks (Top hook: 92% viral probability)' }
    ]
  }
];

export const MUSIC_TRACKS = [
  { id: 'none', name: 'No Background Music', genre: 'Muted', vibe: 'Clean Voice' },
  { id: 'lo-fi-beats', name: 'Midnight Lo-Fi Chill', genre: 'Lo-Fi', vibe: 'Relaxed & Smooth' },
  { id: 'cinematic-energy', name: 'Apex Momentum Drive', genre: 'Cinematic', vibe: 'Inspiring & Building' },
  { id: 'viral-synth', name: 'Neo Cyberwave Beat', genre: 'Synthwave', vibe: 'High Tech & Punchy' },
  { id: 'deep-bass', name: 'Minimalist Trap 808', genre: 'Hip Hop', vibe: 'Trendy & Dynamic' }
];

export const PRICING_PLANS = [
  {
    id: 'starter' as const,
    name: 'Starter Creator',
    monthlyPrice: 19,
    yearlyPrice: 15, // $15/mo billed yearly ($180)
    minutesPerMonth: 120, // 2 hours
    resolution: '1080p Full HD',
    badge: 'Beginner Friendly',
    features: [
      '120 mins upload per month',
      'Auto-detect top 10 viral hooks',
      'Word-timed Alex Hormozi captions',
      'Offline sync & local draft mode',
      'Export 9:16 TikTok / Reels / Shorts',
      'Standard AI processing queue'
    ]
  },
  {
    id: 'pro' as const,
    name: 'Pro Viral Studio',
    monthlyPrice: 49,
    yearlyPrice: 39, // $39/mo billed yearly ($468)
    minutesPerMonth: 600, // 10 hours
    resolution: '4K Ultra HD 60fps',
    badge: 'Most Popular',
    isPopular: true,
    features: [
      '600 mins upload per month',
      'Unlimited viral highlight detection',
      'All 6 dynamic caption presets & fonts',
      'Smart Speaker Auto-Framing (Face-Track)',
      'Custom Brand Kits & Watermark removal',
      'Priority GPU FFmpeg Rendering Queue',
      'Background music sync & auto-ducking',
      'Full REST API & Webhook access'
    ]
  },
  {
    id: 'agency' as const,
    name: 'Agency & Scale',
    monthlyPrice: 149,
    yearlyPrice: 119,
    minutesPerMonth: 3000, // 50 hours
    resolution: '4K ProRes & Raw SRTs',
    badge: 'High Volume',
    features: [
      '3,000 mins upload per month',
      'Multi-seat team collaboration (10 seats)',
      'Dedicated GPU rendering instance',
      'Custom Whisper AI fine-tuned models',
      'Bulk batch video processing',
      'Direct social auto-schedule webhook',
      '24/7 Priority SLA & Account Manager'
    ]
  }
];
