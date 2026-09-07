import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Check,
  Scissors,
  Plus,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
  Film,
  Zap
} from 'lucide-react';
import { ClipperJob } from '../../types';

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
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      /* ignore */
    }
  }, []);

  const videoSrc =
    job.downloadUrl ||
    job.renderedVideoUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const defaultCaption = `🔥 "${job.highlights?.[0]?.hook || 'Unfiltered insights on growth and tech'}"\n\nFull podcast breakdown. What do you think? 👇\n\n#viral #creator #podcast #growth #manwetaai`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(defaultCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoSrc;
    a.download = `${job.title.replace(/\s+/g, '_')}_reel.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div id="step-7-deliver-container" className="space-y-8 animate-in fade-in max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#092318] text-[#00FF85] border border-[#00FF85]/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Step 7: Reel Delivered Successfully</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Your Clip Is Ready for Virality
        </h2>
        <p className="text-xs sm:text-sm text-[#888888] max-w-lg mx-auto">
          Rendered in 1080×1920 60fps with burned dynamic captions and synchronized audio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Player / Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-64 rounded-3xl overflow-hidden border border-[#2A2A2A] bg-black shadow-2xl relative aspect-[9/16]">
            <video
              src={videoSrc}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Actions & Social Distribution */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Action Buttons */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#00FF85]" />
              <span>Export & Share Options</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-2xl bg-[#00FF85] hover:bg-[#34D399] text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4 Video</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCaption}
                className="w-full py-3 px-4 rounded-2xl bg-[#1A1A1A] hover:bg-[#242424] border border-[#333333] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {copiedCaption ? <Check className="w-4 h-4 text-[#00FF85]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? 'Copied to Clipboard!' : 'Copy Viral Caption'}</span>
              </button>
            </div>

            {/* Generated Caption Box */}
            <div className="mt-2 p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-xs text-[#A3A3A3] font-mono leading-relaxed whitespace-pre-wrap">
              {defaultCaption}
            </div>
          </div>

          {/* Workflow Continuation Cards */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00FF85]" />
              <span>Keep Creating</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClipAnother}
                className="p-4 rounded-2xl bg-[#161616] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                  <Scissors className="w-4 h-4 text-[#00FF85]" />
                  <span>Clip Another Moment</span>
                </div>
                <p className="text-[11px] text-[#888888]">
                  Select another high-scoring hook candidate from this same video.
                </p>
              </button>

              <button
                type="button"
                onClick={onStartNewVideo}
                className="p-4 rounded-2xl bg-[#161616] hover:bg-[#1E1E1E] border border-[#2A2A2A] text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                  <Plus className="w-4 h-4 text-[#00FF85]" />
                  <span>Ingest New Video</span>
                </div>
                <p className="text-[11px] text-[#888888]">
                  Upload a fresh webinar, interview, or YouTube episode.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
