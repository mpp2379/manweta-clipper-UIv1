import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Terminal,
  Layers,
  Sparkles,
  CheckCircle2,
  HardDrive,
  Film,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ClipperJob } from '../../types';
import { generateFFmpegCommand } from '../../lib/utils';

interface Step6RenderQueueProps {
  job: ClipperJob;
  onRenderComplete: (renderedUrl: string) => void;
  theme: 'dark' | 'light';
}

export const Step6RenderQueue: React.FC<Step6RenderQueueProps> = ({
  job,
  onRenderComplete,
  theme,
}) => {
  const [progress, setProgress] = useState(10);
  const [currentStage, setCurrentStage] = useState('Initializing FFmpeg hardware acceleration...');
  const [logs, setLogs] = useState<string[]>([
    '[FFmpeg] Worker Node #08 initialized with CUDA / NVENC',
    '[FilterGraph] Calculating 9:16 crop box: x=(1920-607)/2, y=0, w=607, h=1080',
    '[Captions] Re-offsetting word-level timestamps to clip start (t=0.00s)'
  ]);

  const clipRange = job.customClipRange || [142, 187];
  const styleConfig = job.styleConfig || {
    captionStyle: 'hormozi',
    aspectRatio: '9:16',
    framing: 'smart_speaker',
    fontSize: 'lg',
    fontFamily: 'display',
    textColor: '#FFFFFF',
    highlightColor: '#00FF85',
    showEmojis: true,
    position: 'middle',
    musicTrack: 'lo-fi-beats',
    musicVolume: 20,
    showBrandLogo: true,
    brandName: '@manweta.ai',
    autoReOffsetTimestamps: true
  };

  const ffmpegCommand = generateFFmpegCommand(
    job.sourceFileName || 'source_podcast.mp4',
    clipRange[0],
    clipRange[1],
    styleConfig
  );

  useEffect(() => {
    const pipelineStages = [
      { p: 25, stage: 'Cropping center 9:16 viewport & applying smart face tracking...', log: '[FFmpeg] [video_filter] apply crop=ih*(9/16):ih, fps=60' },
      { p: 50, stage: 'Burning in synchronized word-level captions with ASS subtitle stream...', log: `[Subtitles] Burning style: ${styleConfig.captionStyle} with highlight ${styleConfig.highlightColor}` },
      { p: 75, stage: 'Mixing background music overlay with voice auto-ducking (-18dB)...', log: `[Audio] amix inputs=2 duration=first volume=${(styleConfig.musicVolume / 100).toFixed(2)}` },
      { p: 90, stage: 'Encoding final MP4 stream with H.264 CRF 22 High-Profile...', log: '[Encoder] libx264 -b:v 8500k -b:a 192k -movflags +faststart output.mp4' },
      { p: 100, stage: 'Uploading rendered reel to S3 bucket & generating presigned delivery CDN link...', log: '[S3] Upload complete: s3://manweta-renders/job_viral_reel.mp4' }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < pipelineStages.length) {
        const item = pipelineStages[stepIndex];
        setProgress(item.p);
        setCurrentStage(item.stage);
        setLogs(prev => [...prev, item.log]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onRenderComplete(
            job.renderedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          );
        }, 800);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="step-6-render-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 6: Render the Clip</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: FFmpeg 9:16 + Caption Burn + Encode</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Rendering Viral Short Reel
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Waits for async render job completion.
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> FFmpeg crops to 9:16, burns in word-timed captions, overlays music/branding, encodes MP4.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-[#00FF85]">
          <Activity className="w-3.5 h-3.5 animate-spin" />
          <span>GPU Node 08: 145 FPS</span>
        </div>
      </div>

      {/* Progress Box */}
      <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#00FF85] animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                FFmpeg FilterGraph Engine
              </h4>
              <p className="text-xs text-[#888888] font-mono mt-0.5">
                {currentStage}
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xl font-light text-white">{progress}%</span>
            <span className="text-xs text-[#888888] block">Render Progress</span>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-[#0A0A0A] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#222222]">
          <div
            className="h-full bg-[#00FF85] rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* FFmpeg CLI Command Inspector & Live Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Terminal Logs */}
        <div className="p-5 rounded-3xl bg-[#0A0A0A] border border-[#222222] font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[#888888] pb-2 border-b border-[#222222]">
            <span className="flex items-center gap-1.5 text-[#00FF85] font-semibold">
              <Terminal className="w-3.5 h-3.5" /> stdout / stderr Live Stream
            </span>
            <span className="text-[10px] text-[#666666]">WebSocket /ws/jobs/{job.id}</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px] text-[#EDEDED] pt-1">
            {logs.map((line, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-[#555555] select-none">[{idx + 1}]</span>
                <span className={line.includes('complete') ? 'text-[#00FF85] font-semibold' : 'text-[#CCCCCC]'}>
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FFmpeg Command Preview */}
        <div className="p-5 rounded-3xl bg-[#0A0A0A] border border-[#222222] font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[#888888] pb-2 border-b border-[#222222]">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Film className="w-3.5 h-3.5 text-[#00FF85]" /> Generated FFmpeg Filtergraph
            </span>
            <span className="text-[10px] text-[#666666]">Re-offset Word Timestamps</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#111111] border border-[#222222] text-[#EDEDED] break-all text-[11px] leading-relaxed max-h-48 overflow-y-auto font-mono">
            {ffmpegCommand}
          </div>
        </div>
      </div>

      {progress === 100 && (
        <div className="pt-2 flex justify-end animate-in fade-in">
          <button
            id="view-completed-reel-btn"
            onClick={() => onRenderComplete(job.renderedVideoUrl || '')}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Deliver & View Finished Reel</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </div>
  );
};
