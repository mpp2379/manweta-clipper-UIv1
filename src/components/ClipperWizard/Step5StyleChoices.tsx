import React, { useState, useMemo } from 'react';
import {
  Type,
  Smartphone,
  Square,
  Tv,
  Music,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Palette,
  Sliders,
  ArrowUpToLine,
  AlignVerticalJustifyCenter,
  ArrowDownToLine,
  CaseSensitive,
  Check
} from 'lucide-react';
import { ClipperJob, StyleConfig } from '../../types';

interface Step5StyleChoicesProps {
  job: ClipperJob;
  onSaveStyles: (styleConfig: StyleConfig) => void;
  theme: 'dark' | 'light';
}

export interface FontOption {
  id: string;
  name: string;
  cssFamily: string;
  creatorTag: string;
  category: string;
  sampleText: string;
}

const BEST_CAPTION_FONTS: FontOption[] = [
  {
    id: 'montserrat',
    name: 'Montserrat Heavy',
    cssFamily: "'Montserrat', sans-serif",
    creatorTag: 'Hormozi Style',
    category: 'Viral Display',
    sampleText: 'VIRAL HOOK',
  },
  {
    id: 'anton',
    name: 'Anton Condensed',
    cssFamily: "'Anton', sans-serif",
    creatorTag: 'MrBeast Shorts',
    category: 'High Impact',
    sampleText: 'INSANE SCALE',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    cssFamily: "'Bebas Neue', sans-serif",
    creatorTag: 'Cinematic',
    category: 'Tall Condensed',
    sampleText: 'BREAKTHROUGH',
  },
  {
    id: 'outfit',
    name: 'Outfit Geometric',
    cssFamily: "'Outfit', sans-serif",
    creatorTag: 'Trendy Reels',
    category: 'Modern Sans',
    sampleText: 'FUTURE TECH',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    cssFamily: "'Plus Jakarta Sans', sans-serif",
    creatorTag: 'Podcasts & B2B',
    category: 'Clean Editorial',
    sampleText: 'DEEP INSIGHT',
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    cssFamily: "'Space Grotesk', sans-serif",
    creatorTag: 'AI & Web3',
    category: 'Neo-Brutalist',
    sampleText: 'NEURAL PULSE',
  },
  {
    id: 'mono',
    name: 'JetBrains Mono',
    cssFamily: "'JetBrains Mono', monospace",
    creatorTag: 'Dev / Code',
    category: 'Terminal',
    sampleText: 'CODE ENGINE',
  },
];

const CAPTION_POSITIONS = [
  {
    id: 'top',
    label: 'Top',
    sublabel: 'Upper screen',
    icon: ArrowUpToLine,
    desc: 'Leaves lower screen clear for UI & reaction overlays',
    previewAlign: 'justify-start pt-14 sm:pt-16',
  },
  {
    id: 'middle',
    label: 'Center',
    sublabel: 'Eye-level focus',
    icon: AlignVerticalJustifyCenter,
    desc: 'Highest watch-time retention for short-form clips',
    previewAlign: 'justify-center',
  },
  {
    id: 'bottom',
    label: 'Bottom',
    sublabel: 'Classic subtitles',
    icon: ArrowDownToLine,
    desc: 'Traditional placement, keeps speaker faces clear',
    previewAlign: 'justify-end pb-14 sm:pb-16',
  },
];

const FONT_SIZE_PRESETS = [
  { id: 'sm', label: 'Compact', px: 16, desc: 'Subtle & minimal' },
  { id: 'md', label: 'Medium', px: 20, desc: 'Standard subtitles' },
  { id: 'lg', label: 'Punchy', px: 24, desc: 'Alex Hormozi size' },
  { id: 'xl', label: 'Viral Mega', px: 30, desc: 'Max impact big words' },
];

const HIGHLIGHT_COLORS = [
  { hex: '#00FF85', name: 'Neon Lime' },
  { hex: '#FACC15', name: 'Cyber Yellow' },
  { hex: '#38BDF8', name: 'Electric Cyan' },
  { hex: '#E879F9', name: 'Hot Violet' },
  { hex: '#FB923C', name: 'Fiery Orange' },
  { hex: '#FFFFFF', name: 'Pure White' },
];

const CAPTION_PRESET_STYLES = [
  {
    id: 'hormozi',
    name: 'Hormozi Pop',
    description: 'Dynamic kinetic word pops with contrasting high-impact keyword highlights',
    accentColor: '#00FF85',
  },
  {
    id: 'beast',
    name: 'Beast Impact',
    description: 'High-contrast bold font with bright yellow highlight boxes and micro bounces',
    accentColor: '#FACC15',
  },
  {
    id: 'clean',
    name: 'Clean Minimal',
    description: 'Understated editorial layout with subtle fade transitions for business/tech',
    accentColor: '#38BDF8',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    description: 'Vibrant neon outlines with soft glowing shadows ideal for nightlife & crypto',
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
  // Styles State
  const [captionStyle, setCaptionStyle] = useState(job.styleConfig?.captionStyle || 'hormozi');
  const [fontFamilyId, setFontFamilyId] = useState<string>(() => {
    const existing = job.styleConfig?.fontFamily;
    if (existing && BEST_CAPTION_FONTS.some((f) => f.id === existing)) return existing;
    return 'montserrat';
  });
  const [captionPosition, setCaptionPosition] = useState<'top' | 'middle' | 'bottom'>(
    (job.styleConfig?.position as any) || 'middle'
  );
  const [fontSizePx, setFontSizePx] = useState<number>(
    job.styleConfig?.customFontSizePx || (job.styleConfig?.fontSize === 'xl' ? 30 : job.styleConfig?.fontSize === 'sm' ? 16 : 24)
  );
  const [isUppercase, setIsUppercase] = useState(true);
  const [highlightColor, setHighlightColor] = useState(job.styleConfig?.highlightColor || '#00FF85');
  const [showEmojis, setShowEmojis] = useState(job.styleConfig?.showEmojis ?? true);

  // Video / Canvas Settings
  const [aspectRatio, setAspectRatio] = useState(job.styleConfig?.aspectRatio || '9:16');
  const [framing, setFraming] = useState(job.styleConfig?.framing || 'smart_speaker');
  const [musicTrack, setMusicTrack] = useState(job.styleConfig?.musicTrack || 'lo-fi-beats');
  const [musicVolume, setMusicVolume] = useState(job.styleConfig?.musicVolume ?? 18);
  const [showBrandLogo, setShowBrandLogo] = useState(job.styleConfig?.showBrandLogo ?? true);
  const [brandName, setBrandName] = useState(job.styleConfig?.brandName || '@manweta.ai');

  // Selected Font
  const selectedFont = useMemo(
    () => BEST_CAPTION_FONTS.find((f) => f.id === fontFamilyId) || BEST_CAPTION_FONTS[0],
    [fontFamilyId]
  );

  const selectedPositionObj = useMemo(
    () => CAPTION_POSITIONS.find((p) => p.id === captionPosition) || CAPTION_POSITIONS[1],
    [captionPosition]
  );

  const currentSizePresetId = useMemo(() => {
    if (fontSizePx <= 17) return 'sm';
    if (fontSizePx <= 21) return 'md';
    if (fontSizePx <= 27) return 'lg';
    return 'xl';
  }, [fontSizePx]);

  const handleSubmit = () => {
    const config: StyleConfig = {
      captionStyle,
      aspectRatio,
      framing,
      fontSize: currentSizePresetId,
      fontFamily: fontFamilyId,
      textColor: '#FFFFFF',
      highlightColor,
      showEmojis,
      position: captionPosition,
      musicTrack,
      musicVolume,
      showBrandLogo,
      brandName,
      autoReOffsetTimestamps: true,
      customFontSizePx: fontSizePx,
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
            <span className="text-[11px] text-[#888888]">Fonts, Position & Size</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Customize Caption Typography & Positioning
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            Select high-impact viral fonts, adjust vertical screen position (top, center, bottom), and fine-tune font sizing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-md flex items-center gap-2 self-start sm:self-center shrink-0 hover:scale-[1.02]"
        >
          <span>Render Final Reel</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Detailed Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Font Selection (Best Fonts for Captions) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <Type className="w-4 h-4 text-[#00FF85]" />
                <span>Select Caption Font</span>
              </div>
              <span className="text-[11px] text-[#888888] font-mono">
                {selectedFont.name} ({selectedFont.creatorTag})
              </span>
            </div>

            <p className="text-xs text-[#888888]">
              Curated viral typefaces optimized for maximum readability on mobile video feeds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BEST_CAPTION_FONTS.map((font) => {
                const isSelected = fontFamilyId === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontFamilyId(font.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#171717] border-white ring-1 ring-white/30 shadow-md'
                        : 'bg-[#141414] border-[#222222] hover:border-[#333333] hover:bg-[#161616]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{font.name}</span>
                        </div>
                        <span className="text-[10px] text-[#888888]">{font.category}</span>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full border shrink-0 ${
                          isSelected
                            ? 'bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/30 font-semibold'
                            : 'bg-[#1F1F1F] text-[#AAAAAA] border-[#2A2A2A]'
                        }`}
                      >
                        {font.creatorTag}
                      </span>
                    </div>

                    {/* Live Font Typographic Preview */}
                    <div
                      className="text-base tracking-wide text-white py-1 truncate"
                      style={{ fontFamily: font.cssFamily, fontWeight: font.id === 'montserrat' ? 800 : 700 }}
                    >
                      {font.sampleText} <span style={{ color: highlightColor }}>POP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Position Adjustment (Top, Center, Bottom) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <AlignVerticalJustifyCenter className="w-4 h-4 text-[#00FF85]" />
                <span>Caption Position</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
                {selectedPositionObj.label} Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {CAPTION_POSITIONS.map((pos) => {
                const Icon = pos.icon;
                const isSelected = captionPosition === pos.id;
                return (
                  <button
                    key={pos.id}
                    id={`caption-pos-btn-${pos.id}`}
                    type="button"
                    onClick={() => setCaptionPosition(pos.id as any)}
                    className={`py-3.5 px-3 sm:px-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 text-center ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-lg font-bold scale-[1.02]'
                        : 'bg-[#141414] text-[#888888] border-[#222222] hover:text-white hover:border-[#333333] hover:bg-[#181818]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-black' : 'text-[#888888]'}`} />
                    <span className="text-xs sm:text-sm font-bold tracking-tight">{pos.label}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-neutral-600' : 'text-[#666666]'}`}>
                      {pos.sublabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Size Adjustment & Sliders */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <Sliders className="w-4 h-4 text-[#00FF85]" />
                <span>Caption Size Adjustment</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-[#1F1F1F] text-[#00FF85] border border-[#2F2F2F]">
                {fontSizePx}px
              </span>
            </div>

            {/* Size Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FONT_SIZE_PRESETS.map((preset) => {
                const isSelected = currentSizePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFontSizePx(preset.px)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-white text-black font-bold border-white shadow-sm'
                        : 'bg-[#141414] text-[#888888] border-[#222222] hover:text-white hover:border-[#333333]'
                    }`}
                  >
                    <div className="text-xs">{preset.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-neutral-700' : 'text-[#666666]'}`}>
                      {preset.px}px
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continuous Slider for Precise Size Fine-Tuning */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#888888]">
                <span>14px (Compact)</span>
                <span>Fine-tune Font Size</span>
                <span>36px (Super Size)</span>
              </div>
              <input
                type="range"
                min="14"
                max="36"
                step="1"
                value={fontSizePx}
                onChange={(e) => setFontSizePx(Number(e.target.value))}
                className="w-full h-2 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#00FF85]"
              />
            </div>

            {/* Formatting Toggles: Text Case & Emojis */}
            <div className="pt-3 border-t border-[#222222] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsUppercase(!isUppercase)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isUppercase
                      ? 'bg-white text-black border-white'
                      : 'bg-[#161616] text-[#888888] border-[#262626] hover:text-white'
                  }`}
                >
                  <CaseSensitive className="w-3.5 h-3.5" />
                  <span>{isUppercase ? 'ALL-CAPS (Active)' : 'Standard Case'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmojis(!showEmojis)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    showEmojis
                      ? 'bg-white text-black border-white'
                      : 'bg-[#161616] text-[#888888] border-[#262626] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span>{showEmojis ? 'Emojis ON' : 'Emojis OFF'}</span>
                </button>
              </div>

              {/* Highlight Accent Colors */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#888888] mr-1">Highlight:</span>
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setHighlightColor(color.hex)}
                    className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                      highlightColor === color.hex
                        ? 'border-white scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {highlightColor === color.hex && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Aspect Ratio & Speaker Framing */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <Smartphone className="w-4 h-4 text-[#00FF85]" />
              <span>Aspect Ratio & Camera Framing</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: '9:16', name: '9:16 Vertical', desc: 'TikTok, Reels, Shorts', icon: Smartphone },
                { id: '1:1', name: '1:1 Square', desc: 'Instagram & LinkedIn', icon: Square },
                { id: '16:9', name: '16:9 Landscape', desc: 'YouTube & Web Player', icon: Tv },
              ].map((ratio) => {
                const Icon = ratio.icon;
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#171717] border-white ring-1 ring-white/30'
                        : 'bg-[#141414] border-[#222222] hover:border-[#333333]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#00FF85]' : 'text-[#888888]'}`} />
                    <div className="text-xs font-semibold text-white">{ratio.name}</div>
                    <div className="text-[10px] text-[#888888] mt-0.5">{ratio.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs text-[#888888]">Speaker Tracking:</span>
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

          {/* Section 5: Audio & Watermark */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  className="w-full h-2 bg-[#202020] rounded-lg appearance-none cursor-pointer accent-[#00FF85]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Interactive Simulation Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#111111] border border-[#222222] sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF85]" />
                <span>Live Caption Simulation</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-black/60 border border-[#2F2F2F] text-[10px] font-mono text-[#00FF85]">
                {aspectRatio}
              </span>
            </div>

            {/* Video Canvas Container */}
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden border border-[#2A2A2A] transition-all duration-300 ${
                aspectRatio === '9:16'
                  ? 'w-full max-w-[280px] h-[460px]'
                  : aspectRatio === '1:1'
                  ? 'w-full max-w-[320px] h-[320px]'
                  : 'w-full h-[240px]'
              } bg-[#0A0A0A]`}
            >
              {/* Video Thumbnail Background */}
              <img
                src={job.thumbnailUrl}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover opacity-40 select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

              {/* Top Bar Indicator (Pinned to top) */}
              <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between text-[11px] font-mono text-white/80 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[10px]">
                  {selectedFont.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00FF85]/20 border border-[#00FF85]/40 text-[#00FF85] text-[10px] font-bold">
                  {selectedPositionObj.label.toUpperCase()}
                </span>
              </div>

              {/* Interactive Dynamic Subtitles: Full-height overlay with smooth position transition */}
              <div
                className={`absolute inset-0 px-3 z-10 flex flex-col items-center pointer-events-none transition-all duration-300 ease-out ${
                  captionPosition === 'top'
                    ? 'justify-start pt-14 sm:pt-16'
                    : captionPosition === 'middle'
                    ? 'justify-center'
                    : 'justify-end pb-14 sm:pb-16'
                }`}
              >
                <div
                  className="w-full text-center font-black tracking-tight leading-snug drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] transition-all duration-200"
                  style={{
                    fontFamily: selectedFont.cssFamily,
                    fontSize: `${Math.max(14, Math.round(fontSizePx * 0.85))}px`,
                    textTransform: isUppercase ? 'uppercase' : 'none',
                    letterSpacing: selectedFont.id === 'anton' || selectedFont.id === 'bebas' ? '0.04em' : 'normal',
                  }}
                >
                  <span className="text-white drop-shadow-md">
                    {isUppercase ? 'WE DISCOVERED' : 'We discovered'}{' '}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded mx-1 inline-block shadow-lg transition-transform"
                    style={{
                      backgroundColor: highlightColor,
                      color:
                        highlightColor === '#00FF85' ||
                        highlightColor === '#FACC15' ||
                        highlightColor === '#38BDF8'
                          ? '#000000'
                          : '#FFFFFF',
                      fontWeight: 900,
                    }}
                  >
                    {isUppercase ? 'SOMETHING' : 'Something'}
                  </span>
                  <span className="text-white drop-shadow-md">
                    {' '}{isUppercase ? 'EXTRAORDINARY' : 'extraordinary'}
                  </span>
                </div>

                {showEmojis && (
                  <div className="text-xl sm:text-2xl mt-2 animate-bounce text-center">
                    ⚡️🚀
                  </div>
                )}
              </div>

              {/* Watermark / Brand (Pinned to bottom) */}
              {showBrandLogo && (
                <div className="absolute bottom-3 inset-x-3 z-20 flex justify-center pointer-events-none">
                  <div className="text-center text-[10px] font-mono text-white/70 py-1 bg-black/60 rounded-full px-3 border border-white/10 backdrop-blur-sm shadow-md">
                    {brandName}
                  </div>
                </div>
              )}
            </div>

            {/* Spec Sheet Readout */}
            <div className="mt-4 space-y-2 pt-3 border-t border-[#222222] text-xs text-[#888888]">
              <div className="flex justify-between">
                <span>Selected Font:</span>
                <span className="text-white font-medium">{selectedFont.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Vertical Position:</span>
                <span className="text-white font-medium capitalize">{selectedPositionObj.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Font Size:</span>
                <span className="text-white font-mono">{fontSizePx}px ({currentSizePresetId.toUpperCase()})</span>
              </div>
              <div className="flex justify-between">
                <span>Output Resolution:</span>
                <span className="text-white font-mono">1080 × 1920 (60fps)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded-2xl bg-[#00FF85] hover:bg-[#34D399] text-black font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Render with Burned Captions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
