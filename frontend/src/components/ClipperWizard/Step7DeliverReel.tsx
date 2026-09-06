import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  CheckCircle,
  Copy,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Film,
  ExternalLink,
  Flame,
  FileText,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';
import { ClipperJob } from '../../types';
import { formatTime, formatDuration } from '../../lib/utils';

interface Step7DeliverReelProps {
  job: ClipperJob;
  onClipAnother: () => void;
  onStartNewVideo: () => void;
  onOpenCheckout: () => void;
  theme: 'dark' | 'light';
}

export const Step7DeliverReel: React.FC<Step7DeliverReelProps> = ({
  job,
  onClipAnother,
  onStartNewVideo,
  onOpenCheckout,
  theme,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://manweta.ai/reels/${job.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulated download
      const a = document.createElement('a');
      a.href = job.renderedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      a.download = `${job.title.replace(/\s+/g, '_')}_viral_reel.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 800);
  };

  const clipDuration = Math.max(1, (job.customClipRange?.[1] ?? 187) - (job.customClipRange?.[0] ?? 142));

  return (
    <div id="step-7-deliver-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 7: Deliver the Reel</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: S3 CDN Complete</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight flex items-center gap-2">
            Your Viral Reel is Ready! <Sparkles className="w-5 h-5 text-[#00FF85]" />
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Reviews result & downloads rendered MP4.
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> Stored to S3 CDN, job marked done, presigned download link served.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            id="download-reel-btn"
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-black" />
            {downloading ? 'Preparing MP4...' : 'Download Reel (1080p MP4)'}
          </button>
        </div>
      </div>

      {/* Main Grid: Player + Metrics & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 9:16 Vertical Finished Reel Player */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[36px] overflow-hidden bg-black border-[5px] border-[#262626] shadow-2xl group flex flex-col justify-between p-4">
            <video
              src={job.renderedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              poster={job.thumbnailUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Top Brand Watermark */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white">
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/10 font-medium">
                {job.styleConfig?.brandName || '@manweta.ai'}
              </span>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Simulated Animated Captions Overlay */}
            <div className="relative z-10 w-full text-center my-auto px-2">
              <div className="inline-block p-2 rounded-2xl bg-black/80 backdrop-blur-sm border border-white/20 shadow-2xl">
                <span className="font-bold uppercase text-base tracking-wider text-[#00FF85]">
                  {(job.highlights || [])[0]?.hook || "IF YOUR PRODUCT DOES NOT DELIVER INSTANT VALUE"}
                </span>
              </div>
            </div>

            {/* Bottom Meta Bar */}
            <div className="relative z-10 text-white space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-semibold text-[10px]">
                  {job.styleConfig?.captionStyle?.toUpperCase() || 'HORMOZI'} STYLE
                </span>
                <span className="text-[10px] text-[#888888] font-mono">
                  {formatDuration(clipDuration)} • 60 FPS
                </span>
              </div>
              <p className="text-xs font-medium text-white line-clamp-1 drop-shadow">
                {job.title}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Subtitle Export & Predicted Viral Analytics */}
        <div className="lg:col-span-7 space-y-5">
          {/* Quick Actions Card */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#888888]">
              Export & Share Options
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#3A3A3A] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">Copy Shareable Link</span>
                  <span className="text-[10px] text-[#888888] font-mono truncate max-w-[170px] block">
                    manweta.ai/reels/{job.id}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#181818] text-white group-hover:bg-[#252525]">
                  {copiedLink ? <CheckCircle className="w-4 h-4 text-[#00FF85]" /> : <Copy className="w-4 h-4" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const srtData = `1\n00:00:00,000 --> 00:00:04,500\n${job.transcriptText.slice(0, 80)}\n\n2\n00:00:04,500 --> 00:00:08,000\n${job.transcriptText.slice(80, 160)}`;
                  const blob = new Blob([srtData], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `captions_reoffset_${job.id}.srt`;
                  a.click();
                }}
                className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#3A3A3A] transition-all flex items-center justify-between text-left group"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">Export Re-Offset SRT</span>
                  <span className="text-[10px] text-[#888888]">Word-timed 0:00 normalized</span>
                </div>
                <div className="p-2 rounded-xl bg-[#181818] text-white group-hover:bg-[#252525]">
                  <FileText className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Projected Virality & Hook Score breakdown */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#00FF85] fill-[#00FF85]" />
                Viral Engagement Prediction
              </span>
              <span className="text-xs font-mono font-medium text-[#00FF85] bg-[#161616] px-2.5 py-0.5 rounded-full border border-[#262626]">
                Grade: A+ (Top 5%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <span className="text-lg font-light text-white font-mono">96%</span>
                <span className="text-[10px] text-[#888888] block mt-0.5">Hook Power</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <span className="text-lg font-light text-white font-mono">84%</span>
                <span className="text-[10px] text-[#888888] block mt-0.5">Est. Full Watch</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
                <span className="text-lg font-light text-[#00FF85] font-mono">250k+</span>
                <span className="text-[10px] text-[#888888] block mt-0.5">Avg Projected Views</span>
              </div>
            </div>
          </div>

          {/* Next Actions CTA */}
          <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h5 className="text-xs font-semibold text-white">Need more clips from this stream?</h5>
              <p className="text-[11px] text-[#888888]">We have 3 other high-scoring viral hooks ready to clip.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClipAnother}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                Clip Another Segment
              </button>

              <button
                type="button"
                onClick={onStartNewVideo}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-[#181818] hover:bg-[#252525] text-white font-semibold text-xs border border-[#2A2A2A] transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                New Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
