import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Scissors,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Info,
  Sliders
} from 'lucide-react';
import { ClipperJob, WordTimestamp } from '../../types';
import { formatTime, formatDuration } from '../../lib/utils';
import { generateHighlightsForVideo, generateSampleWordsForRange } from '../../services/mockData';

interface Step4ClipSelectorProps {
  job: ClipperJob;
  onConfirmSelection: (range: [number, number], selectedHighlightId?: string) => void;
  theme: 'dark' | 'light';
}

export const Step4ClipSelector: React.FC<Step4ClipSelectorProps> = ({
  job,
  onConfirmSelection,
  theme,
}) => {
  const highlightsList = (job.highlights && job.highlights.length > 0)
    ? job.highlights
    : generateHighlightsForVideo(job.title || 'Viral Clip', job.durationSeconds || 180);

  const defaultRange: [number, number] = job.customClipRange || [
    highlightsList[0]?.startTime || 142,
    highlightsList[0]?.endTime || 187
  ];

  const wordsList = (job.words && job.words.length > 0)
    ? job.words
    : generateSampleWordsForRange(defaultRange[0], defaultRange[1]);

  const [inPoint, setInPoint] = useState<number>(defaultRange[0]);
  const [outPoint, setOutPoint] = useState<number>(defaultRange[1]);
  const [currentTime, setCurrentTime] = useState<number>(defaultRange[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = job.durationSeconds || 3600;
  const clipDuration = Math.max(1, outPoint - inPoint);

  // Sync video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const t = videoRef.current.currentTime;
      setCurrentTime(t);
      if (t >= outPoint) {
        videoRef.current.currentTime = inPoint;
        if (!isPlaying) videoRef.current.pause();
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (videoRef.current.currentTime < inPoint || videoRef.current.currentTime >= outPoint) {
          videoRef.current.currentTime = inPoint;
        }
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const seekTo = (sec: number) => {
    const clamped = Math.max(0, Math.min(sec, duration));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const adjustInPoint = (delta: number) => {
    const newIn = Math.max(0, Math.min(inPoint + delta, outPoint - 3));
    setInPoint(newIn);
    seekTo(newIn);
  };

  const adjustOutPoint = (delta: number) => {
    const newOut = Math.max(inPoint + 3, Math.min(outPoint + delta, duration));
    setOutPoint(newOut);
  };

  // Re-offset math preview: word start - inPoint
  const wordsInRange = wordsList.filter(w => w.start >= inPoint - 2 && w.end <= outPoint + 2);

  return (
    <div id="step-4-clip-selector-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 4: User Selects Clip</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: Fast Timestamp Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Timeline Scrubber & In/Out Fine-Tuning
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Adjust In/Out points on the scrubber or click any word in the transcript to jump.
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> Stores selected timestamps against the job (instant sync).
          </p>
        </div>

        {/* Quick highlight preset selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-[#888888] font-medium hidden sm:inline">AI Highlights:</span>
          <select
            value={job.selectedHighlightId || ''}
            onChange={(e) => {
              const hl = highlightsList.find(h => h.id === e.target.value);
              if (hl) {
                setInPoint(hl.startTime);
                setOutPoint(hl.endTime);
                seekTo(hl.startTime);
              }
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-xs font-medium text-[#EDEDED] focus:outline-none focus:border-white"
          >
            {highlightsList.map(hl => (
              <option key={hl.id} value={hl.id}>
                {hl.score}% Hook • {hl.title.slice(0, 30)}... ({formatDuration(hl.duration)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Video Player + Synchronized Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Player with Scrubber */}
        <div className="lg:col-span-7 space-y-4">
          {/* Player Container */}
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-[#222222] shadow-2xl group">
            <video
              ref={videoRef}
              src={job.renderedVideoUrl || job.sourceUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              poster={job.thumbnailUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Overlay Center Play Button */}
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-none"
              >
                <Play className="w-7 h-7 ml-1 fill-black" />
              </button>
            )}

            {/* Bottom Controls Bar inside video */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={() => seekTo(inPoint)}
                  className="p-1 rounded hover:bg-white/20 transition-colors text-[11px] font-mono flex items-center gap-1 text-[#888888] hover:text-white"
                  title="Jump to In-Point"
                >
                  <RotateCcw className="w-3 h-3" /> Jump to Start
                </button>

                <div className="font-mono text-[11px] text-[#888888]">
                  <span className="text-white font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1 rounded hover:bg-white/20 transition-colors text-[#888888] hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Timeline & Dual-Handle Scrubber */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#00FF85]" />
                <span className="text-xs font-semibold text-white">Clip Boundary Selection</span>
              </div>
              <div className="text-xs font-mono text-[#00FF85] font-medium bg-[#161616] px-2.5 py-0.5 rounded-full border border-[#262626]">
                Duration: {formatDuration(clipDuration)} ({inPoint.toFixed(1)}s → {outPoint.toFixed(1)}s)
              </div>
            </div>

            {/* Custom Multi-Handle Range Scrubber */}
            <div className="relative h-12 bg-[#0A0A0A] rounded-2xl border border-[#222222] p-1 flex items-center select-none overflow-hidden">
              {/* Waveform background tick pattern */}
              <div className="absolute inset-0 timeline-ticks opacity-30" />

              {/* Active Clip Region Highlight */}
              <div
                className="absolute top-1 bottom-1 bg-white/20 border-x-2 border-white rounded-lg transition-all pointer-events-none"
                style={{
                  left: `${(inPoint / duration) * 100}%`,
                  width: `${((outPoint - inPoint) / duration) * 100}%`
                }}
              />

              {/* Current Playhead Needle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#00FF85] shadow-md z-20 transition-all pointer-events-none"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />

              {/* Clickable range track */}
              <input
                type="range"
                min={0}
                max={duration}
                step={0.5}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
            </div>

            {/* Fine-Tuning Controls */}
            <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
              {/* In Point controls */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#888888] block">IN POINT (Start)</span>
                  <span className="font-mono text-sm font-medium text-white">{formatTime(inPoint)}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => adjustInPoint(-0.5)}
                    className="px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#EDEDED] font-mono text-xs"
                    title="-0.5s"
                  >
                    -0.5s
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustInPoint(0.5)}
                    className="px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#EDEDED] font-mono text-xs"
                    title="+0.5s"
                  >
                    +0.5s
                  </button>
                </div>
              </div>

              {/* Out Point controls */}
              <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#888888] block">OUT POINT (End)</span>
                  <span className="font-mono text-sm font-medium text-white">{formatTime(outPoint)}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => adjustOutPoint(-0.5)}
                    className="px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#EDEDED] font-mono text-xs"
                    title="-0.5s"
                  >
                    -0.5s
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustOutPoint(0.5)}
                    className="px-2.5 py-1 rounded-lg bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-[#EDEDED] font-mono text-xs"
                    title="+0.5s"
                  >
                    +0.5s
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Word-Synchronized Transcript with Re-Offset Math callout */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF85]" />
                Synchronized Transcript
              </span>
              <span className="text-[11px] text-[#666666]">
                Click any word to seek
              </span>
            </div>

            {/* Words Box */}
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] flex-1 overflow-y-auto max-h-[300px] leading-relaxed">
              <div className="flex flex-wrap gap-1.5">
                {wordsInRange.map((wordObj, i) => {
                  if (!wordObj || typeof wordObj.word !== 'string') return null;
                  const isCurrentWord = currentTime >= wordObj.start && currentTime <= wordObj.end;
                  const isInsideClip = wordObj.start >= inPoint && wordObj.end <= outPoint;
                  
                  // Crucial build note calculation: Re-offset timestamp to clip's 0:00 start
                  const reOffsetStart = Math.max(0, wordObj.start - inPoint);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => seekTo(wordObj.start)}
                      className={`px-2 py-0.5 rounded-lg text-xs transition-all text-left ${
                        isCurrentWord
                          ? 'bg-white text-black font-semibold scale-105 shadow-sm'
                          : isInsideClip
                          ? 'text-white hover:bg-[#222222] font-medium'
                          : 'text-[#555555] hover:text-[#999999]'
                      }`}
                      title={`Source: ${wordObj.start.toFixed(2)}s | Re-offset to clip start: ${reOffsetStart.toFixed(2)}s`}
                    >
                      {wordObj.word}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Build Notes Callout: Re-offset Timestamp Architecture */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#141414] border border-[#262626] text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#EDEDED] font-semibold">
                <Info className="w-3.5 h-3.5 text-[#00FF85]" />
                <span>Automatic Caption Timestamp Re-Offsetting</span>
              </div>
              <p className="text-[11px] text-[#888888] leading-normal">
                When extracting this clip ({formatTime(inPoint)} → {formatTime(outPoint)}), our backend normalizes all word timestamps relative to the new clip start (<span className="font-mono text-white">00:00.00</span>), preventing caption drift bugs.
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            id="confirm-clip-selection-btn"
            type="button"
            onClick={() => onConfirmSelection([inPoint, outPoint], job.selectedHighlightId)}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Style Choices</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
