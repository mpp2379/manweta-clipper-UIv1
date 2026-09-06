import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  Video,
  ShoppingBag,
  Mic,
  ArrowRight,
  Zap,
  Play,
  Layers,
  Plus,
  Clock,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  ExternalLink,
  Sliders,
  Flame,
  Award,
  Globe
} from 'lucide-react';
import { UserAccount, ClipperJob } from '../types';
import { formatTime, formatDuration } from '../lib/utils';

interface StudioHubProps {
  user: UserAccount;
  savedJobs: ClipperJob[];
  onLaunchClipStudio: () => void;
  onSelectExistingJob: (job: ClipperJob) => void;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onGoHome: () => void;
  theme: 'dark' | 'light';
}

export const StudioHub: React.FC<StudioHubProps> = ({
  user,
  savedJobs,
  onLaunchClipStudio,
  onSelectExistingJob,
  onOpenCheckout,
  onOpenAuth,
  onGoHome,
  theme,
}) => {
  const [reelPrompt, setReelPrompt] = useState('Top 3 productivity hacks that billionaires use secretly');
  const [reelCategory, setReelCategory] = useState<'business' | 'tech' | 'motivation' | 'story'>('business');
  const [isGeneratingReelPreview, setIsGeneratingReelPreview] = useState(false);
  const [generatedScriptPreview, setGeneratedScriptPreview] = useState<string | null>(null);

  const [productUrl, setProductUrl] = useState('https://store.example.com/products/wireless-noise-cancelling-headphones');
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState(false);
  const [productAdHook, setProductAdHook] = useState<string | null>(null);

  const handleSimulateReelScript = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingReelPreview(true);
    setTimeout(() => {
      setIsGeneratingReelPreview(false);
      setGeneratedScriptPreview(
        `[HOOK 0:00-0:03]: "Stop waking up at 5 AM. Here is what billionaire CEOs actually do instead..."\n[SCENE 1 0:04-0:15]: B-roll of modern penthouse workspace with stock ticker.\n[SCENE 2 0:16-0:35]: Energy focus blocks over 90-minute ultradian rhythms.\n[CTA 0:36-0:45]: "Save this reel and try the 90/20 rule tomorrow morning."`
      );
    }, 900);
  };

  const handleSimulateProductAd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzingProduct(true);
    setTimeout(() => {
      setIsAnalyzingProduct(false);
      setProductAdHook(
        `[UGC Hook]: "I threw away my $300 AirPods after testing these ANC headphones for 48 hours. Here is why the battery life changed everything..."`
      );
    }, 800);
  };

  return (
    <div id="manweta-studio-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-[#EDEDED]">
      {/* 1. STUDIO HUB USER HERO BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141414] via-[#111111] to-[#141414] border border-[#222222] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#00FF85]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#333333] hover:border-[#00FF85] transition-all flex items-center justify-center bg-[#1A1A1A] flex-shrink-0"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-bold text-lg text-white">{user.name.charAt(0)}</span>
              )}
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Welcome, {user.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
                  {user.plan} plan
                </span>
                {user.isGuest && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Guest Session
                  </span>
                )}
              </div>
              <p className="text-xs text-[#888888] mt-1 flex items-center gap-2">
                <span>Manweta Creative Studio Hub</span>
                <span>•</span>
                <span className="text-[#00FF85] font-mono">{user.creditsRemaining} video minutes remaining</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onLaunchClipStudio}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4 text-black" />
              <span>Launch Clip Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onOpenCheckout}
              className="px-4 py-3 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Credits</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ALL MANWETA STUDIOS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Manweta AI Studios</h2>
            <p className="text-xs text-[#777777]">Choose an active or upcoming creative pipeline to start creating.</p>
          </div>
          <span className="text-xs font-mono text-[#00FF85] bg-[#141414] px-3 py-1 rounded-full border border-[#222222]">
            4 Studios Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STUDIO 1: AI Clip Studio (LIVE) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border-2 border-[#00FF85]/60 hover:border-[#00FF85] transition-all flex flex-col justify-between space-y-6 relative shadow-xl group">
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
                Live & Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <Film className="w-6 h-6 text-[#00FF85]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>AI Clip Studio</span>
                  <span className="text-xs font-mono text-[#777777]">v1.2</span>
                </h3>
                <p className="text-xs text-[#999999] mt-1 leading-relaxed">
                  Turn long podcasts, YouTube videos, and webinars into high-virality 9:16 vertical short reels with word-timed animated subtitles and smart speaker framing.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#AAAAAA]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>Whisper millisecond STT</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>AI hook virality ranking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>Hormozi & Neon captions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>60 FPS FFmpeg rendering</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs font-mono text-[#777777]">
                {savedJobs.length} active clip project(s)
              </span>
              <button
                type="button"
                id="hub-open-clipper-btn"
                onClick={onLaunchClipStudio}
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Open Clip Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STUDIO 2: AI Reel Creation Studio (BETA) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <Video className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Beta Studio
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white">AI Reel Creation Studio</h3>
                <p className="text-xs text-[#999999] mt-1 leading-relaxed">
                  Type a topic or hook, and generate complete generative reels with AI video b-roll, voiceover narrations, and dynamic beat-matched background music.
                </p>
              </div>

              {/* Interactive Prompt Mini Simulator */}
              <form onSubmit={handleSimulateReelScript} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="text"
                    value={reelPrompt}
                    onChange={(e) => setReelPrompt(e.target.value)}
                    placeholder="Enter topic or prompt..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingReelPreview}
                    className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] transition-colors"
                  >
                    {isGeneratingReelPreview ? 'Writing...' : 'Generate Script'}
                  </button>
                </div>

                {generatedScriptPreview && (
                  <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-amber-500/20 text-[11px] font-mono text-amber-200 whitespace-pre-line max-h-28 overflow-y-auto">
                    {generatedScriptPreview}
                  </div>
                )}
              </form>
            </div>

            <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs text-[#777777]">Generative Video + Script Engine</span>
              <button
                type="button"
                onClick={() => setGeneratedScriptPreview("Script generation ready! Connects to GenAI video models.")}
                className="px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-[#EDEDED] font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Try Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STUDIO 3: Product Advertisement Studio (COMING SOON) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-sky-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Early Preview
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white">Product Advertisement Studio</h3>
                <p className="text-xs text-[#999999] mt-1 leading-relaxed">
                  Turn Shopify, Amazon, or website product links into high-converting UGC-style video ads with AI avatars, 3D product motion, and Meta/TikTok format optimizations.
                </p>
              </div>

              {/* Product URL Input Simulator */}
              <form onSubmit={handleSimulateProductAd} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://yourstore.com/product/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    disabled={isAnalyzingProduct}
                    className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-black font-bold text-[11px] transition-colors"
                  >
                    {isAnalyzingProduct ? 'Extracting...' : 'Extract UGC Hook'}
                  </button>
                </div>

                {productAdHook && (
                  <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-sky-500/20 text-[11px] text-sky-200">
                    {productAdHook}
                  </div>
                )}
              </form>
            </div>

            <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs text-[#777777]">E-Commerce UGC Pipeline</span>
              <button
                type="button"
                onClick={() => setProductAdHook("Product imagery analyzed: Ready to compose 3 UGC variations.")}
                className="px-4 py-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-[#EDEDED] font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Preview Ad Hooks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STUDIO 4: AI Voice & Avatar Studio (PREVIEW) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
                <Mic className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Preview Studio
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white">AI Voice & Avatar Studio</h3>
                <p className="text-xs text-[#999999] mt-1 leading-relaxed">
                  Create digital twin avatars with 4K photorealistic lip-syncing and instant voice cloning to dub video content in 50+ languages seamlessly.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888888]">Voice Clone Model:</span>
                  <span className="text-purple-300 font-mono">Manweta NeuralTTS-v3</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#161616] border border-[#2E2E2E] text-[10px] text-white">
                    🇺🇸 English (US)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#161616] border border-[#2E2E2E] text-[10px] text-white">
                    🇪🇸 Spanish
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#161616] border border-[#2E2E2E] text-[10px] text-white">
                    🇮🇳 Hindi
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#161616] border border-[#2E2E2E] text-[10px] text-white">
                    🇯🇵 Japanese
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs text-[#777777]">Multilingual Lip-Sync Dubbing</span>
              <span className="text-xs font-mono text-purple-400">Coming Q3 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT SAVED REELS ACROSS STUDIOS */}
      <div className="space-y-4 pt-4 border-t border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Clip Studio Projects</h2>
            <p className="text-xs text-[#777777]">Access and re-export your rendered 9:16 short reels.</p>
          </div>
          <button
            type="button"
            onClick={onLaunchClipStudio}
            className="text-xs font-semibold text-[#00FF85] hover:underline flex items-center gap-1"
          >
            <span>Create New Video</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.slice(0, 6).map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectExistingJob(job)}
                className="p-4 rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#444444] transition-all cursor-pointer space-y-3 group"
              >
                <div className="relative h-36 rounded-xl overflow-hidden bg-black">
                  <img
                    src={job.thumbnailUrl}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-[10px] font-mono text-white">
                    {formatDuration(job.durationSeconds)}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                    <span className="font-semibold truncate max-w-[160px]">{job.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 text-[10px] font-bold">
                      {job.highlights?.[0]?.score || 95}% Hook
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#888888] pt-1">
                  <span className="capitalize">{job.styleConfig?.captionStyle || 'Hormozi'} style</span>
                  <span className="text-[#EDEDED] font-semibold flex items-center gap-1 group-hover:text-[#00FF85]">
                    <span>Edit Clip</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-[#111111] border border-[#222222] text-center space-y-3">
            <Film className="w-8 h-8 text-[#555555] mx-auto" />
            <h4 className="text-sm font-semibold text-white">No reels created yet</h4>
            <p className="text-xs text-[#777777] max-w-sm mx-auto">
              Launch Clip Studio to upload a video or pick a sample podcast to generate your first viral clip.
            </p>
            <button
              type="button"
              onClick={onLaunchClipStudio}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-sm transition-all"
            >
              Start Clipping Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
