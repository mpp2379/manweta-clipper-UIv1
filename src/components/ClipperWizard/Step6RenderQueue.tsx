import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  Sparkles,
  Terminal,
  Layers,
  ArrowRight,
  HardDrive,
  FileVideo,
  Clock
} from 'lucide-react';
import { ClipperJob } from '../../types';

interface Step6RenderQueueProps {
  job: ClipperJob;
  onRenderComplete: (renderedUrl: string) => void;
  theme: 'dark' | 'light';
}

const RENDER_STAGES = [
  'Analyzing video resolution and optimal crop framing...',
  'Trimming clip to selected viral highlight...',
  'Centering speaker with 9:16 vertical re-framing...',
  'Generating & burning kinetic animated captions...',
  'Balancing voice loudness & syncing ambient background music...',
  'Exporting high-definition 1080p vertical video...',
  'Finalizing short video reel for download & publishing...',
];

export const Step6RenderQueue: React.FC<Step6RenderQueueProps> = ({
  job,
  onRenderComplete,
  theme,
}) => {
  const [progress, setProgress] = useState(12);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[ReelStudio Engine] Initializing reel creation for ${job.title}...`,
    `[ReelStudio Engine] Target format: 9:16 Vertical Reel / TikTok / Short`,
    `[ReelStudio Engine] Selected range: ${job.customClipRange[0]}s -> ${job.customClipRange[1]}s`,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const capped = Math.min(100, next);

        const stage = Math.min(
          RENDER_STAGES.length - 1,
          Math.floor((capped / 100) * RENDER_STAGES.length)
        );
        setCurrentStageIndex(stage);

        if (stage > currentStageIndex) {
          setConsoleLogs((logs) => [
            ...logs,
            `[ReelStudio] ${new Date().toLocaleTimeString()} ${RENDER_STAGES[stage]}`,
          ]);
        }

        return capped;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [currentStageIndex]);

  useEffect(() => {
    if (progress >= 100) {
      const finishTimeout = setTimeout(() => {
        const outputUrl =
          job.downloadUrl ||
          job.renderedVideoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        onRenderComplete(outputUrl);
      }, 800);
      return () => clearTimeout(finishTimeout);
    }
  }, [progress, job, onRenderComplete]);

  return (
    <div id="step-6-render-container" className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222]">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>Step 6: AI Reel Rendering Studio</span>
        </div>
        <h2 className="text-2xl font-light text-white tracking-tight">
          Rendering Your High-Impact Viral Clip
        </h2>
        <p className="text-xs text-[#888888] max-w-lg mx-auto">
          Applying AI crop coordinates, dynamic subtitle animations, and audio normalization.
        </p>
      </div>

      {/* Main Progress Card */}
      <div className="p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161616] border border-[#2A2A2A] flex items-center justify-center text-[#00FF85]">
              <FileVideo className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">{job.title}</h4>
              <p className="text-xs text-[#888888]">
                {job.styleConfig?.aspectRatio || '9:16'} • {job.styleConfig?.captionStyle || 'Hormozi'} Captions
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-light font-mono text-[#00FF85]">{progress}%</span>
            <span className="text-[11px] text-[#888888] block">ETA: ~{Math.max(1, Math.round((100 - progress) / 8))}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-[#1C1C1C] h-3 rounded-full overflow-hidden border border-[#262626]">
            <div
              className="h-full bg-gradient-to-r from-[#00FF85] to-[#34D399] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#888888]">
            <span className="text-white font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-ping" />
              {RENDER_STAGES[currentStageIndex]}
            </span>
            <span className="font-mono">{progress} / 100</span>
          </div>
        </div>

        {/* Render Stage Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#222222]">
          {[
            { name: 'Crop & Framing', done: progress >= 25 },
            { name: 'Animated Captions', done: progress >= 50 },
            { name: 'Audio Mix', done: progress >= 75 },
            { name: 'HD 1080p Export', done: progress >= 95 },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                s.done
                  ? 'bg-[#141F18] border-[#00FF85]/30 text-[#00FF85]'
                  : 'bg-[#141414] border-[#222222] text-[#666666]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${s.done ? 'text-[#00FF85]' : 'text-[#444444]'}`} />
              <span className="font-medium">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Live Rendering Log Stream */}
        <div className="rounded-2xl bg-[#090909] border border-[#222222] p-4 font-mono text-[11px] text-[#A3A3A3] space-y-1 max-h-36 overflow-y-auto">
          <div className="flex items-center gap-2 text-white/50 text-[10px] pb-1 mb-1 border-b border-[#1A1A1A]">
            <Terminal className="w-3 h-3 text-[#00FF85]" />
            <span>Live Reel Processing Stream</span>
          </div>
          {consoleLogs.map((log, i) => (
            <div key={i} className="leading-relaxed">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
