import React, { useState } from 'react';
import {
  Palette,
  Smartphone,
  Square,
  Tv,
  Type,
  Music,
  Smile,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { ClipperJob, StyleConfig } from '../../types';

interface Step5StyleChoicesProps {
  job: ClipperJob;
  onSaveStyles: (styleConfig: StyleConfig) => void;
  theme: 'dark' | 'light';
}

const CAPTION_STYLES = [
  {
    id: 'hormozi',
    name: 'Hormozi Pop',
    description: 'Punchy uppercase words with dynamic color pops on high-impact keywords',
    previewBg: 'bg-[#0A0A0A]',
    accentColor: '#00FF85',
  },
  {
    id: 'beast',
    name: 'Beast Impact',
    description: 'High-contrast bold font with bright yellow highlight boxes and micro bounces',
    previewBg: 'bg-[#120B0B]',
    accentColor: '#FACC15',
  },
  {
    id: 'clean',
    name: 'Clean Minimal',
    description: 'Understated editorial layout with subtle fade transitions for business/tech',
    previewBg: 'bg-[#0F172A]',
    accentColor: '#38BDF8',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    description: 'Vibrant neon outlines with soft glowing shadows ideal for nightlife & crypto',
    previewBg: 'bg-[#180828]',
    accentColor: '#E879F9',
  },
];

const MUSIC_TRACKS = [
  { id: 'lo-fi-beats', name: 'Chill Lo-Fi Study Beats', bpm: 85 },
  { id: 'ambient-focus', name: 'Deep Ambient Neural Pulse', bpm: 72 },
  { id: 'synthwave', name: 'Retro Futuristic Synthwave', bpm: 110 },
  { id: 'none', name: 'No Background Music (Voice Only)', bpm: 0 },
];

export const Step5StyleChoices: React.FC<Step5StyleChoicesProps> = ({
  job,
  onSaveStyles,
  theme,
}) => {
  const [captionStyle, setCaptionStyle] = useState(job.styleConfig?.captionStyle || 'hormozi');
  const [aspectRatio, setAspectRatio] = useState(job.styleConfig?.aspectRatio || '9:16');
  const [framing, setFraming] = useState(job.styleConfig?.framing || 'smart_speaker');
  const [highlightColor, setHighlightColor] = useState(job.styleConfig?.highlightColor || '#00FF85');
  const [showEmojis, setShowEmojis] = useState(job.styleConfig?.showEmojis ?? true);
  const [musicTrack, setMusicTrack] = useState(job.styleConfig?.musicTrack || 'lo-fi-beats');
  const [musicVolume, setMusicVolume] = useState(job.styleConfig?.musicVolume ?? 18);
  const [showBrandLogo, setShowBrandLogo] = useState(job.styleConfig?.showBrandLogo ?? true);
  const [brandName, setBrandName] = useState(job.styleConfig?.brandName || '@manweta.ai');

  const handleSubmit = () => {
    const config: StyleConfig = {
      captionStyle,
      aspectRatio,
      framing,
      fontSize: 'lg',
      fontFamily: 'display',
      textColor: '#FFFFFF',
      highlightColor,
      showEmojis,
      position: 'middle',
      musicTrack,
      musicVolume,
      showBrandLogo,
      brandName,
      autoReOffsetTimestamps: true,
    };
    onSaveStyles(config);
  };

  return (
    <div id="step-5-styles-container" className="space-y-8 animate-in fade-in">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 5: Visual Styling</span>
            <span className="text-[#444444]">•</span>
            <span className="text-[11px] text-[#888888]">Captions & Music</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Customize Reel Appearance & Subtitles
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            Choose viral animated caption presets, target aspect ratio, framing crop, and background audio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md flex items-center gap-2 self-start sm:self-center"
        >
          <span>Render Final Reel</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Caption Style Presets */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Type className="w-4 h-4 text-[#00FF85]" />
              <span>Animated Caption Preset</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAPTION_STYLES.map((style) => (
                <div
                  key={style.id}
                  onClick={() => {
                    setCaptionStyle(style.id);
                    setHighlightColor(style.accentColor);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    captionStyle === style.id
                      ? 'bg-[#171717] border-white ring-1 ring-white/30'
                      : 'bg-[#141414] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{style.name}</span>
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: style.accentColor }}
                      />
                    </div>
                    <p className="text-xs text-[#888888] mt-1">{style.description}</p>
                  </div>
                  <div className="mt-3 text-[11px] font-mono font-medium text-neutral-300">
                    "{style.name === 'Hormozi Pop' ? 'INSANE RESULTS' : 'High Performance'} <span style={{ color: style.accentColor }}>NOW</span>"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Aspect Ratio & Framing */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Smartphone className="w-4 h-4 text-[#00FF85]" />
              <span>Aspect Ratio & Camera Framing</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: '9:16', name: '9:16 Vertical', desc: 'TikTok, Reels, Shorts', icon: Smartphone },
                { id: '1:1', name: '1:1 Square', desc: 'Instagram Feed, LinkedIn', icon: Square },
                { id: '16:9', name: '16:9 Landscape', desc: 'YouTube, Web Player', icon: Tv },
              ].map((ratio) => {
                const Icon = ratio.icon;
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#171717] border-white ring-1 ring-white/30'
                        : 'bg-[#141414] border-[#222222] hover:border-[#333333]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#00FF85]' : 'text-[#888888]'}`} />
                    <div className="text-xs font-semibold text-white">{ratio.name}</div>
                    <div className="text-[10px] text-[#888888] mt-0.5">{ratio.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs text-[#888888]">Speaker Crop Mode:</span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'smart_speaker', label: 'AI Face Track' },
                  { id: 'fit', label: 'Letterbox Fit' },
                  { id: 'fill', label: 'Center Fill' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFraming(mode.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                      framing === mode.id
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#141414] border border-[#222222] text-[#888888] hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Music & Volume */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <Music className="w-4 h-4 text-[#00FF85]" />
                <span>Background Soundtrack</span>
              </div>
              {musicTrack !== 'none' && (
                <span className="text-xs font-mono text-[#888888]">
                  Volume: {musicVolume}%
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MUSIC_TRACKS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMusicTrack(t.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    musicTrack === t.id
                      ? 'bg-[#171717] border-white ring-1 ring-white/30'
                      : 'bg-[#141414] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-medium text-white">{t.name}</div>
                    {t.bpm > 0 && <div className="text-[10px] text-[#888888]">{t.bpm} BPM</div>}
                  </div>
                  {musicTrack === t.id && <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />}
                </button>
              ))}
            </div>

            {musicTrack !== 'none' && (
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full accent-[#00FF85]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Interactive Preview Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] sticky top-6">
            <h4 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3">
              Real-Time Caption Simulation
            </h4>

            <div
              className={`relative mx-auto rounded-2xl overflow-hidden border border-[#2A2A2A] flex flex-col justify-between p-4 ${
                aspectRatio === '9:16'
                  ? 'w-56 h-96'
                  : aspectRatio === '1:1'
                  ? 'w-64 h-64'
                  : 'w-full h-48'
              } bg-[#0A0A0A]`}
            >
              <img
                src={job.thumbnailUrl}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
                referrerPolicy="no-referrer"
              />

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/80">
                <span>{aspectRatio}</span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 text-[#00FF85]">LIVE PREVIEW</span>
              </div>

              {/* Centered Dynamic Subtitles */}
              <div className="relative z-10 text-center my-auto px-2">
                <div className="text-base sm:text-lg font-black tracking-tight leading-snug drop-shadow-lg text-white">
                  WE DISCOVERED{' '}
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: highlightColor,
                      color: highlightColor === '#00FF85' || highlightColor === '#FACC15' ? '#000000' : '#FFFFFF',
                    }}
                  >
                    SOMETHING
                  </span>{' '}
                  EXTRAORDINARY
                </div>
                {showEmojis && <div className="text-2xl mt-2 animate-bounce">⚡️🚀</div>}
              </div>

              {/* Watermark / Brand */}
              {showBrandLogo && (
                <div className="relative z-10 text-center text-[10px] font-mono text-white/70">
                  {brandName}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 pt-3 border-t border-[#222222] text-xs text-[#888888]">
              <div className="flex justify-between">
                <span>Output Resolution:</span>
                <span className="text-white font-mono">1080 × 1920 (60fps)</span>
              </div>
              <div className="flex justify-between">
                <span>Subtitle Engine:</span>
                <span className="text-white font-mono">ASS Burn-In</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Encode Time:</span>
                <span className="text-[#00FF85] font-mono">~12 seconds</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded-2xl bg-[#00FF85] hover:bg-[#34D399] text-black font-bold text-xs transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>Render with FFmpeg</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
