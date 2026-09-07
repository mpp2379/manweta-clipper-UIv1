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
      description: 'Upload podcasts, interviews, or YouTube links. Our AI automatically transcribes speech into word-by-word subtitles, pinpoints the most engaging moments, and formats your video for mobile screens.',
      highlights: [
        'Automatic word-by-word animated subtitles',
        'Finds the best, most engaging highlights',
        'Trendy caption styles with custom colors',
        'Simple timeline controls to adjust start & end'
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
      headline: 'Prompt-to-Reel generator with AI visuals & voiceover',
      description: 'Type any topic or idea, and Manweta AI will write an engaging script, generate matching visuals, add natural voiceovers in 40+ languages, and create ready-to-post short reels.',
      highlights: [
        'Complete short videos from a single prompt',
        'Engaging scripts tailored for TikTok & Reels',
        'Natural-sounding voice narration & music',
        'Custom brand colors and logo overlays'
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
      headline: 'Turn product links into high-converting video ads',
      description: 'Paste your Shopify, Amazon, or store link. Manweta AI analyzes your product photos and highlights to produce eye-catching video ads ready for social media campaigns.',
      highlights: [
        'Turn product images into animated video ads',
        'Friendly AI presenters showcasing your product',
        'Direct links to Shopify and online stores',
        'Generate multiple ad variations with 1 click'
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
      headline: 'Lifelike digital avatars & natural voice cloning',
      description: 'Create lifelike AI digital avatars with natural lip-syncing and instant voice cloning. Translate and dub your videos across 50+ languages while keeping your natural voice tone.',
      highlights: [
        'Natural-sounding voice clone in seconds',
        'High-definition realistic digital avatars',
        'Automatic multilingual video dubbing',
        'Easy speech speed and tone adjustments'
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
            <span className="text-white font-medium">Manweta AI</span>
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
                  <span>Sign In with Google — Get 60 Free Credits</span>
                </button>

                {/* Instant Try / Email Option */}
                <button
                  type="button"
                  id="hero-quick-try-btn"
                  onClick={onLaunchClipStudio}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#161616] hover:bg-[#202020] border border-[#2E2E2E] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#00FF85]" />
                  <span>Start Creating Free</span>
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
              <span>Fast & Secure Cloud Processing</span>
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
            <div className="rounded-3xl bg-[#111111] border border-[#222222] p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
              <div className="space-y-6">
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
            <h3 className="text-base font-semibold text-white">Word-by-Word Subtitles</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Every spoken word is accurately captured and timed, so your animated captions match your speech seamlessly with zero delays.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4 hover:border-[#333333] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Smart Highlight Detection</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Our AI automatically identifies the most exciting, engaging segments in your video that capture viewer attention in the first 3 seconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4 hover:border-[#333333] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Tv className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Trendy Animated Captions</h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Choose from popular subtitle styles like bold highlights, glowing neon, and karaoke animations with customizable colors and background music.
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
