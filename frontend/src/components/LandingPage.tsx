import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  Play,
  ArrowRight,
  Zap,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Mic,
  Video,
  ChevronRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Star,
  Flame,
  Clock,
  Download,
  Share2,
  Sliders,
  Tv
} from 'lucide-react';
import { UserAccount } from '../types';

interface LandingPageProps {
  onLoginClick: () => void;
  onGoogleSignIn: () => void;
  onEnterStudioHub: () => void;
  onLaunchClipStudio: () => void;
  onNavigatePricing: () => void;
  isLoggedIn: boolean;
  user: UserAccount;
  theme: 'dark' | 'light';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginClick,
  onGoogleSignIn,
  onEnterStudioHub,
  onLaunchClipStudio,
  onNavigatePricing,
  isLoggedIn,
  user,
  theme,
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<'clipper' | 'reels' | 'ads' | 'avatars'>('clipper');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const studios = [
    {
      id: 'clipper',
      title: 'AI Clip Studio',
      badge: 'Live & Active',
      badgeColor: 'text-[#00FF85] border-[#00FF85]/30 bg-[#00FF85]/10',
      icon: Film,
      headline: 'Turn 1-hour videos into 10 viral reels in 60 seconds',
      description: 'Ingest long podcasts, keynotes, and YouTube videos. Our Whisper AI automatically transcribes speech with word-level timestamps, detects high-virality hooks, centers speakers into 9:16 frames, and burns animated dynamic captions.',
      highlights: [
        'Whisper millisecond word-level timestamps',
        'AI hook scoring (0-100 virality rating)',
        'Hormozi, Neon & Karaoke animated captions',
        'Dual-handle precision timeline scrubber'
      ],
      ctaText: 'Launch Clip Studio',
      action: onLaunchClipStudio
    },
    {
      id: 'reels',
      title: 'AI Reel Creation Studio',
      badge: 'Beta / Early Access',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      icon: Video,
      headline: 'Prompt-to-Reel generator with AI b-roll & audio',
      description: 'Type a prompt or topic, and Manweta AI will write a viral script, generate cinematic AI visuals, add dynamic voiceovers in 40+ languages, and assemble ready-to-post vertical reels.',
      highlights: [
        'Multi-scene generative video generation',
        'Auto-scripting optimized for TikTok algorithms',
        'Dynamic sound effects & beat-synced transitions',
        'Custom brand asset & logo overlays'
      ],
      ctaText: 'Explore in Studio Hub',
      action: onEnterStudioHub
    },
    {
      id: 'ads',
      title: 'Product Advertisement Studio',
      badge: 'Coming Soon',
      badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      icon: ShoppingBag,
      headline: 'Turn product URLs into high-converting video ads',
      description: 'Paste your Shopify, Amazon, or website link. Manweta AI analyzes your product imagery and value propositions to generate high-performing UGC-style video ads for Meta and TikTok.',
      highlights: [
        '1-click product image-to-3D animation',
        'AI UGC creator personas & testimonials',
        'Direct Shopify & TikTok shop integration',
        'A/B test variations with 1 click'
      ],
      ctaText: 'Explore in Studio Hub',
      action: onEnterStudioHub
    },
    {
      id: 'avatars',
      title: 'AI Voice & Avatar Studio',
      badge: 'Preview',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      icon: Mic,
      headline: 'Studio-grade digital avatars & voice cloning',
      description: 'Create lifelike AI digital twins with photorealistic lip-syncing and instant voice cloning. Dub your content across 50+ languages while preserving your vocal cadence and emotions.',
      highlights: [
        'Instant 30-second voice clone',
        '4K photorealistic digital twin avatars',
        'Automated lip-synced video dubbing',
        'Emotion & tone pitch controller'
      ],
      ctaText: 'Explore in Studio Hub',
      action: onEnterStudioHub
    }
  ];

  return (
    <div id="manweta-landing-page" className="min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00FF85]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs text-[#00FF85] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-ping" />
            <span className="font-semibold tracking-wide uppercase text-[11px]">Next-Gen AI Creative Suite</span>
            <span className="text-[#666666]">•</span>
            <span className="text-white font-medium">Manweta AI 2.0</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Create Viral Short Videos & Ads in Seconds with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-emerald-300 to-teal-200">
              Manweta AI
            </span>
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-base sm:text-lg text-[#999999] max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI video studio for creators, podcasters, and growth teams. Auto-extract viral hooks from podcasts, generate AI reels, and create high-converting product ads with word-level subtitles.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  id="hero-go-to-studios-btn"
                  onClick={onEnterStudioHub}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all group"
                >
                  <Layers className="w-4 h-4" />
                  <span>Go to Studios Hub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  type="button"
                  id="hero-launch-clipper-btn"
                  onClick={onLaunchClipStudio}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#161616] hover:bg-[#202020] border border-[#2E2E2E] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Film className="w-4 h-4 text-[#00FF85]" />
                  <span>Open Clip Studio</span>
                </button>
              </>
            ) : (
              <>
                {/* Google Sign-in Primary Button */}
                <button
                  type="button"
                  id="hero-google-auth-btn"
                  onClick={onGoogleSignIn}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                    />
                  </svg>
                  <span>Sign In with Google — Get 60 Free Mins</span>
                </button>

                {/* Instant Try / Email Option */}
                <button
                  type="button"
                  id="hero-quick-try-btn"
                  onClick={onLaunchClipStudio}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#161616] hover:bg-[#202020] border border-[#2E2E2E] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#00FF85]" />
                  <span>Try Clip Studio as Guest</span>
                </button>
              </>
            )}
          </div>

          {/* Social Proof / Metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#888888]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>10x Faster Video Rendering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>SOC2 Compliant Cloud Pipeline</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Studio Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-[#111111] border border-[#222222] p-4 sm:p-6 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <Film className="w-5 h-5 text-[#00FF85]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">AI Clip Studio Pipeline</h3>
                <p className="text-xs text-[#777777]">Lex Fridman Podcast #412 • 98% Viral Hook Score</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#141414] border border-[#222222] text-[11px] font-mono text-[#00FF85]">
                t=0.00s Re-Offset
              </span>
              <button
                type="button"
                onClick={onLaunchClipStudio}
                className="px-4 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <span>Try Demo Clip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            {/* Left: 9:16 Vertical Reel Simulation */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-56 h-96 rounded-3xl bg-black border-2 border-[#262626] overflow-hidden relative shadow-xl flex flex-col justify-between p-3">
                <img
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80"
                  alt="Podcast Speaker"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-white">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 font-bold text-[#00FF85]">
                    98% HOOK
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 font-mono">
                    00:45
                  </span>
                </div>

                {/* Center Animated Dynamic Subtitle */}
                <div className="relative z-10 text-center my-auto px-1">
                  <div className="inline-block p-2 rounded-xl bg-black/85 backdrop-blur-sm border border-white/20 shadow-2xl">
                    <span className="font-extrabold text-xs uppercase tracking-wide text-[#00FF85] drop-shadow-md">
                      IF YOUR PRODUCT DOES NOT DELIVER INSTANT VALUE
                    </span>
                  </div>
                </div>

                {/* Bottom Watermark */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-[#AAAAAA]">
                  <span className="font-semibold text-white">@manweta.ai</span>
                  <span className="text-[9px] font-mono">1080x1920 • 60fps</span>
                </div>
              </div>
            </div>

            {/* Right: Step breakdown */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Whisper Speech-to-Text</h4>
                      <p className="text-[11px] text-[#777777]">Millisecond word timestamps generated with speaker diarization</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#00FF85]">Done (0.8s)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Viral Highlight Detection</h4>
                      <p className="text-[11px] text-[#777777]">Ranked 5 viral hooks by pacing, tone energy & retention prediction</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#00FF85]">Top Pick: 98%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">FFmpeg 9:16 Crop & Animated Subtitles</h4>
                      <p className="text-[11px] text-[#777777]">Smart face tracking + Hormozi animated ASS captions burned in</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#00FF85]">60 FPS MP4</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Ready to test with your own podcast?</span>
                  <p className="text-[11px] text-[#777777]">No setup needed — paste a YouTube link or drop a video file.</p>
                </div>
                <button
                  type="button"
                  onClick={onLaunchClipStudio}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE MANWETA AI STUDIOS SUITE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1A1A1A]">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#222222] text-[11px] font-semibold text-[#00FF85] uppercase tracking-wider">
            All Products & Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The Complete Manweta AI Creative Suite
          </h2>
          <p className="text-sm text-[#888888] max-w-xl mx-auto">
            A unified ecosystem of specialized AI studios engineered to automate your entire video production workflow.
          </p>
        </div>

        {/* Studio Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {studios.map((studio) => {
            const Icon = studio.icon;
            const isActive = activeStudioTab === studio.id;
            return (
              <button
                key={studio.id}
                type="button"
                onClick={() => setActiveStudioTab(studio.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#111111] text-[#888888] border-[#222222] hover:text-[#EDEDED] hover:bg-[#161616]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#00FF85]'}`} />
                <span>{studio.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${studio.badgeColor}`}>
                  {studio.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Studio Detailed Card */}
        {(() => {
          const current = studios.find((s) => s.id === activeStudioTab) || studios[0];
          const Icon = current.icon;
          return (
            <div className="rounded-3xl bg-[#111111] border border-[#222222] p-6 sm:p-10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#00FF85]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{current.title}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
                          {current.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#777777]">Automated Workflow Engine</p>
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold text-white tracking-tight leading-snug">
                    {current.headline}
                  </h4>

                  <p className="text-sm text-[#999999] leading-relaxed">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {current.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF85] flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={current.action}
                      className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <span>{current.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={onEnterStudioHub}
                      className="px-5 py-3 rounded-2xl bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] text-[#EDEDED] font-semibold text-xs transition-colors"
                    >
                      View in Studio Hub
                    </button>
                  </div>
                </div>

                {/* Visual Preview Graphic */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-[#222222] space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#888888]">
                      <span className="font-mono">STUDIO MODULE PREVIEW</span>
                      <span className="text-[#00FF85] font-semibold">Active Engine</span>
                    </div>

                    <div className="h-56 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col justify-center items-center text-center p-6 space-y-3 relative overflow-hidden">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-[#00FF85]" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">{current.title}</h5>
                        <p className="text-xs text-[#777777] mt-1 max-w-xs">{current.headline}</p>
                      </div>
                      <div className="w-full pt-2">
                        <div className="h-1.5 w-full bg-[#222222] rounded-full overflow-hidden">
                          <div className="h-full bg-[#00FF85] w-4/5 rounded-full" />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#666666] mt-1">
                          <span>Real-time Processing</span>
                          <span>60 FPS</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between text-xs">
                      <span className="text-[#888888]">Integrated Cloud Queue:</span>
                      <span className="font-mono text-white font-semibold">AWS ECS + FFmpeg Engine</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 3. CORE ARCHITECTURE FEATURES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1A1A1A]">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#222222] text-[11px] font-semibold text-[#00FF85] uppercase tracking-wider">
            Built for Viral Performance
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered from Ingest to Delivery
          </h2>
          <p className="text-sm text-[#888888] max-w-lg mx-auto">
            Every feature was engineered to eliminate hours of manual video editing while maximizing viewer retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4 hover:border-[#333333] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#00FF85]" />
            </div>
            <h3 className="text-base font-semibold text-white">Whisper Word-Level Alignment</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Every single spoken syllable is indexed with start/end millisecond timestamps. When trimming clips, timestamps re-offset to t=0.00s automatically to prevent caption drift.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4 hover:border-[#333333] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Hook & Virality Scoring</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Our retention model scores your video from 0 to 100 based on hook power, emotional cadence, speaker pacing, and punchline timing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4 hover:border-[#333333] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Tv className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Dynamic Animated Captions</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Switch between Hormozi, Neon Glow, Karaoke, and Minimalist caption presets with customizable font scales, emoji injection, and background music ducking.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1A1A1A]">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#222222] text-[11px] font-semibold text-[#00FF85] uppercase tracking-wider">
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Choose Your Creation Velocity
          </h2>
          <p className="text-sm text-[#888888] max-w-md mx-auto">
            Upgrade anytime. Scale with your content production without watermark surprises.
          </p>

          {/* Monthly / Yearly Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-[#777777]'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-[#222222] p-0.5 relative transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-[#777777]'}`}>
              <span>Yearly</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Starter */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <p className="text-xs text-[#777777] mt-0.5">For hobbyists and testing</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-xs text-[#777777]">/ forever</span>
              </div>
              <p className="text-xs text-[#AAAAAA]">60 video minutes / month to create reels and test captions.</p>

              <div className="space-y-2.5 pt-2 border-t border-[#222222]">
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>60 minutes video processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>720p & 1080p MP4 exports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>Standard Whisper transcription</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLaunchClipStudio}
              className="w-full py-3 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-white font-semibold text-xs transition-colors"
            >
              Start Free
            </button>
          </div>

          {/* Pro Creator */}
          <div className="p-6 rounded-3xl bg-[#141414] border-2 border-[#00FF85] space-y-6 flex flex-col justify-between relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00FF85] text-black font-bold text-[10px] uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Pro Creator</h3>
                <p className="text-xs text-[#777777] mt-0.5">For active creators & podcasters</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  ${billingCycle === 'monthly' ? '29' : '23'}
                </span>
                <span className="text-xs text-[#777777]">/ month</span>
              </div>
              <p className="text-xs text-[#AAAAAA]">300 video minutes / month with fast cloud FFmpeg rendering.</p>

              <div className="space-y-2.5 pt-2 border-t border-[#222222]">
                <div className="flex items-center gap-2 text-xs text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>300 minutes video processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>1080p 60FPS High-Bitrate Exports</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>All Caption Styles (Hormozi, Neon)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>No Manweta Watermark</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigatePricing}
              className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Pro Access</span>
            </button>
          </div>

          {/* Agency / Scale */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Agency & Growth</h3>
                <p className="text-xs text-[#777777] mt-0.5">For agencies and media brands</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  ${billingCycle === 'monthly' ? '99' : '79'}
                </span>
                <span className="text-xs text-[#777777]">/ month</span>
              </div>
              <p className="text-xs text-[#AAAAAA]">1,200 video minutes / month with multi-studio priority API queue.</p>

              <div className="space-y-2.5 pt-2 border-t border-[#222222]">
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>1,200 minutes video processing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>Access to all upcoming studios</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#CCCCCC]">
                  <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
                  <span>Priority GPU render queue</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigatePricing}
              className="w-full py-3 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-white font-semibold text-xs transition-colors"
            >
              Upgrade to Agency
            </button>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-[#00FF85]" />
          </div>
          <span className="font-bold text-white">Manweta AI</span>
          <span>© 2026 Manweta AI Studios. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-[#888888]">
          <button type="button" onClick={onEnterStudioHub} className="hover:text-white transition-colors">
            Studios Hub
          </button>
          <button type="button" onClick={onLaunchClipStudio} className="hover:text-white transition-colors">
            Clip Studio
          </button>
          <button type="button" onClick={onNavigatePricing} className="hover:text-white transition-colors">
            Pricing
          </button>
          <button type="button" onClick={onLoginClick} className="hover:text-white transition-colors">
            Sign In
          </button>
        </div>
      </footer>
    </div>
  );
};
