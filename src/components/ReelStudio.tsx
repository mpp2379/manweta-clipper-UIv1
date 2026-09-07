import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Zap,
  Play,
  Film,
  Music,
  Mic,
  Copy,
  Check,
  ArrowRight,
  Sliders,
  Layers,
  Clock,
  Flame,
  ChevronRight
} from 'lucide-react';
import { UserAccount } from '../types';

interface ReelStudioProps {
  user: UserAccount;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onLaunchClipper: () => void;
  theme: 'dark' | 'light';
}

const SAMPLE_HOOKS = [
  'Top 3 productivity hacks that billionaires use secretly',
  'Stop waking up at 5 AM. Here is what neuroscience says',
  'How to build an AI SaaS in 48 hours with zero code',
  'The psychological trick retail brands use to make you buy'
];

const VOICES = [
  { id: 'adam', name: 'Adam (Narrator)', tone: 'Deep & Authoritative', lang: 'English (US)' },
  { id: 'rachel', name: 'Rachel (Dynamic)', tone: 'Enthusiastic & Crisp', lang: 'English (US)' },
  { id: 'marcus', name: 'Marcus (Tech)', tone: 'Analytical & Smooth', lang: 'English (UK)' },
  { id: 'elena', name: 'Elena (Storyteller)', tone: 'Warm & Engaging', lang: 'Spanish/English' }
];

export const ReelStudio: React.FC<ReelStudioProps> = ({
  user,
  onOpenCheckout,
  onOpenAuth,
  onLaunchClipper,
  theme
}) => {
  const [topic, setTopic] = useState(SAMPLE_HOOKS[0]);
  const [category, setCategory] = useState<'business' | 'tech' | 'motivation' | 'story'>('business');
  const [pacing, setPacing] = useState<'viral' | 'cinematic' | 'educational'>('viral');
  const [selectedVoice, setSelectedVoice] = useState('adam');
  const [targetDuration, setTargetDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    hook: string;
    scenes: { time: string; visual: string; audio: string }[];
    cta: string;
  } | null>({
    hook: '"Stop waking up at 5 AM. Here is what top 0.1% performers actually do instead..."',
    scenes: [
      {
        time: '0:00 - 0:04',
        visual: 'Fast-paced cinematic cut of empty high-rise boardroom, glowing laptop, high contrast b-roll.',
        audio: 'Stop forcing yourself into artificial morning routines. Science proves chronotypes dictate peak brain focus.'
      },
      {
        time: '0:05 - 0:16',
        visual: 'Split screen comparing sleep cycle graphs with high dopamine focus spikes.',
        audio: 'Instead of the 5 AM club, implement 90-minute ultradian cycles. Work with your biological clock.'
      },
      {
        time: '0:17 - 0:26',
        visual: 'Macro slow-motion shot of espresso pulling, calendar blocking on iPad.',
        audio: 'Protect your first 2 hours from notifications, email, and slack. That single boundary triples deep output.'
      }
    ],
    cta: '"Save this reel to test ultradian blocking tomorrow, and drop your chronotype in the comments."'
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedScript({
        hook: `"${topic.toUpperCase()}: The hidden mechanism nobody talks about..."`,
        scenes: [
          {
            time: '0:00 - 0:05',
            visual: `Dynamic text kinetic animation zooming in on "${topic}". Quick sound riser effect.`,
            audio: `If you want to master this in 2026, forget the conventional advice. Here is the exact playbook.`
          },
          {
            time: '0:06 - 0:18',
            visual: 'High-energy 60 FPS b-roll cut with kinetic subtitles in Neon Hormozi styling.',
            audio: `Step one: Automate the friction. Top performers eliminate 80% of trivial decisions before noon.`
          },
          {
            time: '0:19 - 0:28',
            visual: 'Side-by-side metric comparison showing 4.2x efficiency jump with AI workflow.',
            audio: `Step two: Leverage AI workflows to do 10 hours of heavy lifting in under 60 seconds.`
          }
        ],
        cta: `"Comment 'GUIDE' below and I'll send you the complete step-by-step breakdown directly."`
      });
    }, 1200);
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    const fullText = `HOOK:\n${generatedScript.hook}\n\nSCENES:\n${generatedScript.scenes
      .map((s) => `[${s.time}] Visual: ${s.visual}\nAudio: ${s.audio}`)
      .join('\n\n')}\n\nCTA:\n${generatedScript.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="manweta-reel-studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#EDEDED]">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>AI Reel Creation Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Generative Short-Form Reels
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Turn topics and hooks into viral 9:16 vertical reels with AI b-roll, voice synthesis, and auto-captions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs font-mono text-[#00FF85] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{user.creditsRemaining} credits remaining</span>
          </div>
          <button
            type="button"
            onClick={onLaunchClipper}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5 text-black" />
            <span>Open Clip Studio</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Configuration, Right Generated Storyboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prompt & Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Prompt & Direction</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AAAAAA] mb-2">
                  Topic or Hook Concept
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={3}
                  placeholder="Enter a topic, myth, question, or story hook..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>

              {/* Sample Hook Pills */}
              <div>
                <span className="text-[11px] text-[#666666] block mb-1.5">Quick Inspiration:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_HOOKS.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTopic(h)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-[#202020] text-[#999999] hover:text-white border border-[#2A2A2A] transition-colors truncate max-w-full text-left"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Pacing */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="business">Business & Wealth</option>
                    <option value="tech">Tech & AI</option>
                    <option value="motivation">Mindset & Habits</option>
                    <option value="story">Documentary Story</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">Pacing</label>
                  <select
                    value={pacing}
                    onChange={(e) => setPacing(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="viral">Viral Fast (Sub 35s)</option>
                    <option value="cinematic">Cinematic Story</option>
                    <option value="educational">Step-by-Step Deep</option>
                  </select>
                </div>
              </div>

              {/* Voice Actor Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#AAAAAA] mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Voiceover Model</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#666666]">Manweta TTS Engine</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVoice(v.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedVoice === v.id
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm'
                          : 'bg-[#0A0A0A] border-[#222222] text-[#888888] hover:border-[#333333]'
                      }`}
                    >
                      <div className="font-semibold text-xs text-white">{v.name}</div>
                      <div className="text-[10px] text-[#777777] mt-0.5">{v.tone}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Reel Storyboard...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Complete Reel Storyboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Generated Storyboard & Scene Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {generatedScript ? (
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00FF85]" />
                    <span>Generated Storyboard & Timeline</span>
                  </h3>
                  <p className="text-xs text-[#777777] mt-0.5">
                    Estimated Duration: ~30s • 9:16 Aspect Ratio • 60 FPS
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00FF85]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hook Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Viral Hook (0-3s)
                  </span>
                  <span className="font-mono">98% Virality Index</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug">
                  {generatedScript.hook}
                </p>
              </div>

              {/* Scene Timeline Blocks */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#888888] block">Scene by Scene Breakdown:</span>
                {generatedScript.scenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-2 hover:border-[#333333] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#00FF85] font-semibold flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {scene.time}
                      </span>
                      <span className="text-[11px] text-[#666666]">Scene {idx + 1}</span>
                    </div>

                    <div className="text-xs text-[#999999] leading-relaxed">
                      <strong className="text-[#CCCCCC]">B-Roll Prompt: </strong>
                      {scene.visual}
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222222] text-xs text-white">
                      <span className="text-[#777777] font-semibold mr-1.5">Voiceover:</span>
                      "{scene.audio}"
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-1">
                <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Call To Action (CTA)</span>
                <p className="text-xs font-semibold text-white">{generatedScript.cta}</p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={onLaunchClipper}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Film className="w-3.5 h-3.5 text-black" />
                  <span>Send to Clip Studio & Add Captions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCheckout}
                  className="text-xs text-[#AAAAAA] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Need more generation credits?</span>
                  <ChevronRight className="w-3 h-3 text-[#00FF85]" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#111111] border border-[#222222] text-center space-y-4">
              <Video className="w-10 h-10 text-[#555555] mx-auto" />
              <h3 className="text-base font-bold text-white">No Storyboard Generated Yet</h3>
              <p className="text-xs text-[#777777] max-w-sm mx-auto leading-relaxed">
                Enter your topic on the left and click Generate to produce word-for-word voiceover scripts and b-roll timelines.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
