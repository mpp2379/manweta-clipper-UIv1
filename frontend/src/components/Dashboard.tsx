import React, { useState } from 'react';
import {
  Film,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Play,
  Download,
  Share2,
  PlusCircle,
  RotateCcw,
  Sliders,
  Scissors,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  WifiOff
} from 'lucide-react';
import { ClipperJob, UserAccount } from '../types';
import { formatDuration, formatTime, getViralityColor } from '../lib/utils';

interface DashboardProps {
  jobs: ClipperJob[];
  user: UserAccount;
  onStartNewClip: () => void;
  onOpenJob: (job: ClipperJob) => void;
  onOpenCheckout: () => void;
  isOffline: boolean;
  theme: 'dark' | 'light';
}

export const Dashboard: React.FC<DashboardProps> = ({
  jobs,
  user,
  onStartNewClip,
  onOpenJob,
  onOpenCheckout,
  isOffline,
  theme,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'done' | 'processing'>('all');
  const [previewingJob, setPreviewingJob] = useState<ClipperJob | null>(null);

  const completedJobs = jobs.filter(j => j.status === 'done');
  const activeJobs = jobs.filter(j => j.status !== 'done');

  const filteredJobs = jobs.filter(j => {
    if (activeFilter === 'done') return j.status === 'done';
    if (activeFilter === 'processing') return j.status !== 'done';
    return true;
  });

  return (
    <div id="main-dashboard-view" className="space-y-8 pb-12">
      {/* Top Banner: Quick Ingest Hero */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#111111] border border-[#222222] overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Clipper Studio v1.2</span>
              <span className="text-[#444444]">•</span>
              <span className="text-[#888888] font-mono">Offline-First Caching</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight leading-tight">
              Turn Long Podcasts into <span className="font-semibold text-white">Viral Short Reels</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
              Automated 7-step pipeline: Whisper transcription, LLM hook detection, word-timed animated captions, and 9:16 FFmpeg rendering.
            </p>
          </div>

          {/* Prominent Start CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <button
              id="dashboard-start-clip-btn"
              onClick={onStartNewClip}
              className="px-6 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5"
            >
              <PlusCircle className="w-5 h-5 text-black" />
              <span>Create New Reel</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Strip */}
        <div className="mt-8 pt-6 border-t border-[#222222] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
            <div className="flex items-center justify-between text-[#888888] mb-1">
              <span className="text-xs font-medium">Total Reels</span>
              <Film className="w-3.5 h-3.5 text-[#EDEDED]" />
            </div>
            <div className="text-xl sm:text-2xl font-light text-white font-mono">28</div>
            <span className="text-[10px] text-[#00FF85] font-medium">+6 this week</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
            <div className="flex items-center justify-between text-[#888888] mb-1">
              <span className="text-xs font-medium">Hours Processed</span>
              <Clock className="w-3.5 h-3.5 text-[#EDEDED]" />
            </div>
            <div className="text-xl sm:text-2xl font-light text-white font-mono">14.2h</div>
            <span className="text-[10px] text-[#666666]">Audio transcribed</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
            <div className="flex items-center justify-between text-[#888888] mb-1">
              <span className="text-xs font-medium">Avg Hook Score</span>
              <Flame className="w-3.5 h-3.5 text-[#00FF85]" />
            </div>
            <div className="text-xl sm:text-2xl font-light text-[#00FF85] font-mono">94%</div>
            <span className="text-[10px] text-[#00FF85] font-medium">Top 5% virality</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
            <div className="flex items-center justify-between text-[#888888] mb-1">
              <span className="text-xs font-medium">Est. Views Gained</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#EDEDED]" />
            </div>
            <div className="text-xl sm:text-2xl font-light text-white font-mono">1.8M+</div>
            <span className="text-[10px] text-[#888888]">Across TikTok & Reels</span>
          </div>
        </div>
      </div>

      {/* Active Processing Jobs (if any) */}
      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00FF85] animate-ping" />
              Active Pipeline Jobs ({activeJobs.length})
            </h3>
            <span className="text-xs text-[#666666]">Real-time cloud sync</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                id={`active-job-${job.id}`}
                onClick={() => onOpenJob(job)}
                className="p-4 sm:p-5 rounded-2xl bg-[#111111] border border-[#262626] hover:border-[#3A3A3A] transition-all cursor-pointer shadow-sm group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1A1A1A] flex-shrink-0 relative border border-[#262626]">
                    <img
                      src={job.thumbnailUrl}
                      alt={job.title}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white animate-spin" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#00FF85] border border-[#2A2A2A] font-medium uppercase">
                        Step {job.currentStep} of 7: {job.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#666666]">
                        {formatDuration(job.durationSeconds)} long video
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-neutral-300 transition-colors">
                      {job.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="w-32 bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden border border-[#262626]">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center gap-1"
                  >
                    <span>Resume</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library of Generated Viral Reels */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-[#00FF85]" />
              Completed Viral Short Reels Library
            </h3>
            <p className="text-xs text-[#888888]">
              Ready-to-post 9:16 vertical reels with word-timed captions burned in.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-full border border-[#222222]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'all' ? 'bg-white text-black shadow-sm' : 'text-[#888888] hover:text-[#EDEDED]'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setActiveFilter('done')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                activeFilter === 'done' ? 'bg-white text-black shadow-sm' : 'text-[#888888] hover:text-[#EDEDED]'
              }`}
            >
              Ready ({completedJobs.length})
            </button>
          </div>
        </div>

        {/* 9:16 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredJobs.map((job) => {
            const topHighlight = job.highlights[0];
            const virality = getViralityColor(topHighlight?.score || 90);
            const clipSecs = job.customClipRange[1] - job.customClipRange[0];

            return (
              <div
                key={job.id}
                id={`reel-card-${job.id}`}
                className="group rounded-3xl bg-[#111111] border border-[#222222] hover:border-[#3A3A3A] overflow-hidden transition-all flex flex-col justify-between"
              >
                {/* Visual Preview Container */}
                <div
                  onClick={() => onOpenJob(job)}
                  className="relative aspect-[9/12] bg-[#0A0A0A] overflow-hidden cursor-pointer"
                >
                  <img
                    src={job.thumbnailUrl}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#141414]/90 text-[#00FF85] border border-[#262626] backdrop-blur-sm"
                    >
                      {topHighlight?.score || 92}% Hook
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/80 backdrop-blur-sm text-white border border-[#333333]">
                      {formatDuration(clipSecs || 45)}
                    </span>
                  </div>

                  {/* Center Play Button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-black" />
                    </div>
                  </div>

                  {/* Caption Overlay Snippet */}
                  <div className="absolute bottom-3 inset-x-3 text-center">
                    <div className="inline-block p-1.5 rounded-lg bg-black/80 backdrop-blur text-[11px] font-black uppercase text-yellow-300 border border-yellow-500/30">
                      {topHighlight?.hook || 'HIGH SIGNAL VIRAL MOMENT'}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">
                      {job.styleConfig?.captionStyle?.toUpperCase() || 'HORMOZI'} STYLE • 9:16
                    </span>
                    <h4
                      onClick={() => onOpenJob(job)}
                      className="text-xs font-semibold text-[#EDEDED] hover:text-white transition-colors line-clamp-2 cursor-pointer"
                    >
                      {job.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-[#222222] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenJob(job)}
                      className="text-xs font-medium text-[#888888] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Edit & Re-trim
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = job.renderedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                        a.download = `${job.title}_reel.mp4`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#262626] text-[#EDEDED] transition-colors"
                      title="Download MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
