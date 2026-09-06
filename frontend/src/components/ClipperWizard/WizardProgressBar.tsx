import React from 'react';
import {
  Upload,
  Mic,
  Sparkles,
  Scissors,
  Palette,
  Cpu,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { PipelineStepNumber, JobStatus } from '../../types';

interface WizardProgressBarProps {
  currentStep: PipelineStepNumber;
  jobStatus: JobStatus;
  onStepClick?: (step: PipelineStepNumber) => void;
  maxAccessibleStep: PipelineStepNumber;
  theme: 'dark' | 'light';
}

const STEPS_META = [
  { step: 1, title: 'Upload & Ingest', icon: Upload, desc: 'ffprobe & S3 store' },
  { step: 2, title: 'Transcribe Audio', icon: Mic, desc: 'Whisper word-timestamps' },
  { step: 3, title: 'Detect Highlights', icon: Sparkles, desc: 'LLM hook scoring' },
  { step: 4, title: 'Select Clip', icon: Scissors, desc: 'Timeline scrubber & trim' },
  { step: 5, title: 'Style Choices', icon: Palette, desc: 'Captions & 9:16 crop' },
  { step: 6, title: 'Render Queue', icon: Cpu, desc: 'FFmpeg encode & burn' },
  { step: 7, title: 'Deliver Reel', icon: CheckCircle, desc: 'Instant preview & MP4' },
];

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({
  currentStep,
  jobStatus,
  onStepClick,
  maxAccessibleStep,
  theme,
}) => {
  return (
    <div
      id="wizard-progress-tracker"
      className={`w-full py-4 px-4 sm:px-6 rounded-3xl border mb-6 transition-all ${
        theme === 'dark'
          ? 'bg-[#111111] border-[#222222] text-[#EDEDED]'
          : 'bg-white border-neutral-200 shadow-sm text-neutral-900'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#888888]">
            Pipeline
          </span>
          <span className="text-xs text-[#EDEDED] font-medium">
            Step {currentStep} of 7 — {STEPS_META[currentStep - 1].title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-ping" />
            {jobStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="relative">
        {/* Track Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-[#222222] rounded-full z-0 hidden sm:block">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
          />
        </div>

        {/* Step Circles */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 relative z-10">
          {STEPS_META.map((s) => {
            const isCurrent = s.step === currentStep;
            const isCompleted = s.step < currentStep;
            const isAccessible = s.step <= maxAccessibleStep;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                id={`wizard-step-node-${s.step}`}
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick && onStepClick(s.step as PipelineStepNumber)}
                className={`flex flex-col items-center text-center group focus:outline-none transition-all ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'
                }`}
                title={`${s.step}. ${s.title} (${s.desc})`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-white text-black ring-2 ring-white/30 scale-105 shadow-sm'
                      : isCompleted
                      ? 'bg-[#141414] text-[#00FF85] border border-[#00FF85]/40 hover:border-[#00FF85]'
                      : theme === 'dark'
                      ? 'bg-[#161616] text-[#888888] border border-[#262626] group-hover:border-[#3A3A3A]'
                      : 'bg-neutral-100 text-neutral-500 border border-neutral-300 group-hover:border-neutral-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-[#00FF85]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="mt-2 hidden sm:block">
                  <p
                    className={`text-[11px] truncate max-w-[85px] ${
                      isCurrent
                        ? 'text-white font-semibold'
                        : isCompleted
                        ? 'text-[#CCCCCC]'
                        : 'text-[#666666]'
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[9px] text-[#666666] truncate max-w-[85px]">
                    {s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
