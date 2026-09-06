import React, { useState, useEffect, useMemo } from 'react';
import {
  Palette,
  Smartphone,
  Square,
  Monitor,
  Music,
  Type,
  Sparkles,
  Eye,
  Check,
  Volume2,
  Smile,
  Shield,
  Layers,
  ArrowRight,
  Sliders,
  Play,
  RotateCcw
} from 'lucide-react';
import { ClipperJob, StyleConfig, CaptionStylePreset, AspectRatio, CropFramingMode } from '../../types';
import { MUSIC_TRACKS } from '../../services/mockData';

interface Step5StyleChoicesProps {
  job: ClipperJob;
  onSaveStyles: (styles: StyleConfig) => void;
  theme: 'dark' | 'light';
}

export const Step5StyleChoices: React.FC<Step5StyleChoicesProps> = ({
  job,
  onSaveStyles,
  theme,
}) => {
  const [config, setConfig] = useState<StyleConfig>(
    job.styleConfig || {
      captionStyle: 'hormozi',
      aspectRatio: '9:16',
      framing: 'smart_speaker',
      fontSize: 'lg',
      fontFamily: 'display',
      textColor: '#FFFFFF',
      highlightColor: '#FACC15',
      showEmojis: true,
      position: 'middle',
      musicTrack: 'lo-fi-beats',
      musicVolume: 20,
      showBrandLogo: true,
      brandName: '@manweta.ai',
      autoReOffsetTimestamps: true
    }
  );

  const [activeWordIndex, setActiveWordIndex] = useState(0);

  // Fallback marketing sample, only used if this job has no real transcript yet
  const fallbackWords = [
    "IF", "YOUR", "PRODUCT", "DOES", "NOT", "DELIVER", "INSTANT", "VALUE", "YOU", "LOSE", "50%", "CONVERSIONS"
  ];

  // Pull the actual words spoken in the selected clip range, so the live
  // preview shows real captions from this video instead of generic sample text.
  const previewWords = useMemo(() => {
    const selectedHighlight = job.highlights?.find((h) => h.id === job.selectedHighlightId);
    const rangeStart = selectedHighlight?.startTime ?? job.customClipRange?.[0] ?? 0;
    const rangeEnd = selectedHighlight?.endTime ?? job.customClipRange?.[1] ?? Infinity;

    const clipped = (job.words || [])
      .filter((w) => w.start >= rangeStart && w.start <= rangeEnd)
      .map((w) => w.word.trim())
      .filter(Boolean);

    return clipped.length > 0 ? clipped : fallbackWords;
  }, [job.words, job.highlights, job.selectedHighlightId, job.customClipRange]);

  useEffect(() => {
    setActiveWordIndex(0);
    const timer = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % previewWords.length);
    }, 450);
    return () => clearInterval(timer);
  }, [previewWords]);

  const captionPresets: { id: CaptionStylePreset; name: string; desc: string; sample: string }[] = [
    {
      id: 'hormozi',
      name: 'Hormozi Punch',
      desc: 'Bold yellow & green accent words on dark stroke',
      sample: 'THE BIGGEST SECRET'
    },
    {
      id: 'neon',
      name: 'Cyber Neon',
      desc: 'Glowing cyan & magenta text with high-tech outline',
      sample: 'NEXT-GEN AI REEL'
    },
    {
      id: 'karaoke',
      name: 'Karaoke Glow',
      desc: 'Active spoken word pops with glowing background scale',
      sample: 'WORD BY WORD BOUNCE'
    },
    {
      id: 'minimal',
      name: 'Clean Minimal',
      desc: 'Sleek white sans-serif with subtle backing pill box',
      sample: 'Minimalist subtitles'
    },
    {
      id: 'beast',
      name: 'High-Energy Pop',
      desc: 'Staggered font scaling with animated emotion emoji',
      sample: 'UNBELIEVABLE 🚀'
    }
  ];

  const aspectRatios: { id: AspectRatio; name: string; icon: typeof Smartphone; desc: string }[] = [
    { id: '9:16', name: '9:16 Vertical', icon: Smartphone, desc: 'TikTok, Reels, Shorts' },
    { id: '1:1', name: '1:1 Square', icon: Square, desc: 'Instagram, LinkedIn' },
    { id: '16:9', name: '16:9 Landscape', icon: Monitor, desc: 'YouTube, Web' }
  ];

  return (
    <div id="step-5-styles-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 5: Style Choices</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: Render Parameter Storage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Caption Styles, Aspect Ratio & Audio Mix
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Caption typography, brand highlight color, aspect ratio framing, background music.
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> Stores parameters attached to job record for FFmpeg filtergraph encoding.
          </p>
        </div>

        <button
          id="proceed-to-render-top-btn"
          type="button"
          onClick={() => onSaveStyles(config)}
          className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <span>Submit & Render</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

      {/* Main 2-Column: Left Controls + Right Live Phone Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Style Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Caption Presets */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#00FF85]" />
              1. Caption Style Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {captionPresets.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  type="button"
                  onClick={() => setConfig({ ...config, captionStyle: preset.id })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    config.captionStyle === preset.id
                      ? 'bg-[#1C1C1C] border-white text-white ring-1 ring-white/20'
                      : 'bg-[#0A0A0A] border-[#222222] hover:border-[#3A3A3A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{preset.name}</span>
                    {config.captionStyle === preset.id && (
                      <Check className="w-3.5 h-3.5 text-[#00FF85]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#888888]">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Aspect Ratio & Framing */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#00FF85]" />
              2. Target Platform Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {aspectRatios.map((ar) => {
                const Icon = ar.icon;
                return (
                  <button
                    key={ar.id}
                    id={`ratio-${ar.id.replace(':', 'x')}`}
                    type="button"
                    onClick={() => setConfig({ ...config, aspectRatio: ar.id })}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      config.aspectRatio === ar.id
                        ? 'bg-white text-black border-white font-semibold shadow-sm'
                        : 'bg-[#0A0A0A] border-[#222222] text-[#888888] hover:text-[#EDEDED]'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold block">{ar.name}</span>
                    <span className="text-[10px] opacity-75">{ar.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Smart Speaker framing toggle */}
            <div className="pt-3 flex items-center justify-between border-t border-[#222222]">
              <div>
                <span className="text-xs font-medium text-white block">AI Smart Face-Centering</span>
                <span className="text-[11px] text-[#888888]">Keep active speaker centered when cropping 16:9 to 9:16</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    framing: config.framing === 'smart_speaker' ? 'center' : 'smart_speaker'
                  })
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  config.framing === 'smart_speaker'
                    ? 'bg-[#181818] text-[#00FF85] border border-[#2A2A2A]'
                    : 'bg-[#141414] text-[#888888] border border-[#222222]'
                }`}
              >
                {config.framing === 'smart_speaker' ? 'Enabled (Active)' : 'Center Static Crop'}
              </button>
            </div>
          </div>

          {/* 3. Colors, Position & Emojis */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#00FF85]" />
              3. Visual Accent Colors & Position
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Highlight Color Picker */}
              <div>
                <span className="text-xs text-[#888888] block mb-2 font-medium">Punch Word Color</span>
                <div className="flex items-center gap-2">
                  {['#00FF85', '#FACC15', '#06B6D4', '#22C55E', '#EC4899', '#FFFFFF'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setConfig({ ...config, highlightColor: color })}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        config.highlightColor === color ? 'scale-110 border-white ring-2 ring-white/20' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Caption Position */}
              <div>
                <span className="text-xs text-[#888888] block mb-2 font-medium">Screen Position</span>
                <div className="flex gap-1 bg-[#0A0A0A] p-1 rounded-full border border-[#222222]">
                  {(['top', 'middle', 'bottom'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setConfig({ ...config, position: pos })}
                      className={`flex-1 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                        config.position === pos ? 'bg-white text-black shadow-sm' : 'text-[#888888] hover:text-[#EDEDED]'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Emojis & Watermark toggles */}
            <div className="pt-3 grid grid-cols-2 gap-3 border-t border-[#222222]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EDEDED]">
                <input
                  type="checkbox"
                  checked={config.showEmojis}
                  onChange={(e) => setConfig({ ...config, showEmojis: e.target.checked })}
                  className="rounded border-[#333333] text-white focus:ring-0 bg-[#0A0A0A]"
                />
                <Smile className="w-3.5 h-3.5 text-[#00FF85]" />
                <span>Auto-Insert Viral Emojis 🔥</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EDEDED]">
                <input
                  type="checkbox"
                  checked={config.showBrandLogo}
                  onChange={(e) => setConfig({ ...config, showBrandLogo: e.target.checked })}
                  className="rounded border-[#333333] text-white focus:ring-0 bg-[#0A0A0A]"
                />
                <Shield className="w-3.5 h-3.5 text-[#EDEDED]" />
                <span>Watermark Brand Logo</span>
              </label>
            </div>
          </div>

          {/* 4. Background Music */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#00FF85]" />
                4. Background Music Overlay & Auto-Ducking
              </label>
              <span className="text-xs font-mono text-[#00FF85]">{config.musicVolume}% Vol</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MUSIC_TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setConfig({ ...config, musicTrack: track.id })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    config.musicTrack === track.id
                      ? 'bg-white text-black border-white font-medium shadow-sm'
                      : 'bg-[#0A0A0A] border-[#222222] text-[#888888] hover:text-[#EDEDED]'
                  }`}
                >
                  <span className={`text-xs font-semibold block ${config.musicTrack === track.id ? 'text-black' : 'text-white'}`}>{track.name}</span>
                  <span className={`text-[10px] ${config.musicTrack === track.id ? 'text-neutral-700' : 'text-[#888888]'}`}>{track.vibe}</span>
                </button>
              ))}
            </div>

            {config.musicTrack !== 'none' && (
              <div className="pt-2 flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-[#888888]" />
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={config.musicVolume}
                  onChange={(e) => setConfig({ ...config, musicVolume: parseInt(e.target.value) })}
                  className="flex-1 accent-white bg-[#0A0A0A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Mockup Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            className={`sticky top-20 w-full flex flex-col items-center ${
              config.aspectRatio === '16:9' ? 'max-w-[420px]' : 'max-w-[300px]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#888888] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00FF85]" />
                Live {config.aspectRatio} Canvas Simulator
              </span>
            </div>

            {/* Phone Frame */}
            <div
              className={`relative w-full rounded-[36px] bg-[#0A0A0A] border-[5px] border-[#262626] shadow-2xl overflow-hidden flex flex-col justify-between p-4 ${
                config.aspectRatio === '1:1'
                  ? 'aspect-square'
                  : config.aspectRatio === '16:9'
                  ? 'aspect-[16/9]'
                  : 'aspect-[9/16]'
              }`}
            >
              {/* Background Video Poster / Simulation */}
              <img
                src={job.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                alt="Reel preview"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

              {/* Top Phone Info (Camera notch & brand) */}
              <div className="relative z-10 flex items-center justify-between text-white text-[10px]">
                <div className="w-16 h-3 bg-black/60 rounded-full mx-auto" />
                {config.showBrandLogo && (
                  <span className="absolute top-1 left-2 font-mono text-[9px] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur border border-white/10 text-white font-bold">
                    {config.brandName || '@manweta.ai'}
                  </span>
                )}
              </div>

              {/* Configured Position: Animated Caption Box (absolutely positioned so
                  top/middle/bottom is clearly visible regardless of sibling layout) */}
              <div
                className={`absolute left-0 right-0 z-10 px-2 text-center transition-all ${
                  config.position === 'top'
                    ? 'top-8'
                    : config.position === 'bottom'
                    ? 'bottom-16'
                    : 'top-1/2 -translate-y-1/2'
                }`}
              >
                {config.captionStyle === 'hormozi' && (
                  <div className="inline-block p-2 rounded-2xl bg-black/80 backdrop-blur-sm border border-white/20 shadow-2xl">
                    <span className="font-extrabold uppercase text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                      {previewWords.map((word, idx) => (
                        <span
                          key={idx}
                          className={`mx-1 inline-block transition-all duration-150 ${
                            idx === activeWordIndex ? 'scale-125 font-black' : 'text-white opacity-80'
                          }`}
                          style={idx === activeWordIndex ? { color: config.highlightColor } : undefined}
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                {config.captionStyle === 'neon' && (
                  <div className="inline-block p-2 rounded-2xl bg-[#0A0A0A]/90 border border-white/30">
                    <span className="font-mono font-black uppercase text-base tracking-widest text-white">
                      {previewWords.slice(activeWordIndex, activeWordIndex + 3).map((word, idx) => (
                        <span key={idx} className="mx-1" style={{ color: config.highlightColor }}>
                          {word}
                        </span>
                      ))}
                    </span>
                  </div>
                )}

                {config.captionStyle === 'karaoke' && (
                  <div className="inline-flex flex-wrap justify-center items-center gap-1.5">
                    {previewWords.slice(activeWordIndex, activeWordIndex + 4).map((word, idx) => {
                      const isActive = idx === 0;
                      return (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-full font-semibold text-sm transition-all duration-150 ${
                            isActive ? 'scale-110 text-black' : 'text-white/80 bg-black/70 border border-white/10'
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: config.highlightColor, boxShadow: `0 0 18px ${config.highlightColor}` }
                              : undefined
                          }
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>
                )}

                {config.captionStyle === 'minimal' && (
                  <div className="inline-block px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
                    <span className="font-medium text-xs text-white tracking-wide">
                      {previewWords.slice(activeWordIndex, activeWordIndex + 4).join(' ')}
                    </span>
                  </div>
                )}

                {config.captionStyle === 'beast' && (
                  <div className="inline-block p-2 rounded-2xl bg-white text-black font-black text-sm uppercase shadow-xl">
                    {config.showEmojis && '🔥 '}
                    {previewWords[activeWordIndex]} {previewWords[(activeWordIndex + 1) % previewWords.length]}
                    {config.showEmojis && ' 🚀'}
                  </div>
                )}
              </div>

              {/* Bottom Social Overlay Mock (TikTok/Reels UI) */}
              <div className="relative z-10 flex items-end justify-between text-white text-xs pb-1">
                <div className="space-y-1 max-w-[180px]">
                  <p className="font-bold text-[11px] drop-shadow">@manweta_creator</p>
                  <p className="text-[10px] opacity-80 line-clamp-1 drop-shadow">
                    How to scale organic reach in 2026 #viral #shorts #ai
                  </p>
                  {config.musicTrack !== 'none' && (
                    <p className="text-[9px] text-[#00FF85] flex items-center gap-1 font-mono">
                      <Music className="w-2.5 h-2.5 animate-spin" /> {config.musicTrack}
                    </p>
                  )}
                </div>

                {/* Vertical Social Action Icons (Like, Comment, Share) */}
                <div className="flex flex-col items-center gap-2.5 text-[10px] font-bold">
                  <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                    ❤️
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                    💬
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                    ↗️
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              id="confirm-styles-render-btn"
              type="button"
              onClick={() => onSaveStyles(config)}
              className="mt-4 w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Render Parameters</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};