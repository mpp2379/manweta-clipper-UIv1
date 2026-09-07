import React, { useState } from 'react';
import {
  Film,
  Plus,
  Play,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  CreditCard,
  HardDrive,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ClipperJob, UserAccount } from '../types';
import { formatTime, formatDuration } from '../lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.sourceFileName && job.sourceFileName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'done') return matchesSearch && job.status === 'done';
    if (filterStatus === 'processing')
      return matchesSearch && (job.status === 'transcribing' || job.status === 'analyzing' || job.status === 'rendering');
    return matchesSearch;
  });

  return (
    <div id="clipper-dashboard-container" className="space-y-8 animate-in fade-in">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#888888] font-medium">Credits Remaining</span>
            <div className="text-2xl font-light text-white font-mono mt-1">
              {user.creditsRemaining}{' '}
              <span className="text-xs text-[#888888] font-sans">/ {user.creditsTotal} mins</span>
            </div>
            <span className="text-[11px] text-[#00FF85] font-medium mt-1 block">
              Plan: {user.plan.toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenCheckout}
            className="p-2.5 rounded-2xl bg-[#161616] hover:bg-[#202020] text-[#00FF85] border border-[#2A2A2A] transition-colors"
          >
            <Zap className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#888888] font-medium">Active Ingests</span>
            <div className="text-2xl font-light text-white font-mono mt-1">
              {jobs.filter((j) => j.status !== 'done').length}
            </div>
            <span className="text-[11px] text-[#888888] mt-1 block">
              In queue / processing
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#161616] text-neutral-300 border border-[#2A2A2A]">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#888888] font-medium">Exported Reels</span>
            <div className="text-2xl font-light text-white font-mono mt-1">
              {jobs.filter((j) => j.status === 'done').length}
            </div>
            <span className="text-[11px] text-[#00FF85] mt-1 block">
              Ready for TikTok / Reels / Shorts
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#161616] text-[#00FF85] border border-[#2A2A2A]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#888888] font-medium">Render Node GPU</span>
            <div className="text-xl font-light text-white font-mono mt-1">
              A100-80GB
            </div>
            <span className="text-[11px] text-[#00FF85] mt-1 block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-ping" />
              Online (0.8s cold start)
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#161616] text-neutral-300 border border-[#2A2A2A]">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Projects List Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-light text-white tracking-tight">Recent Clipper Projects</h3>
          <p className="text-xs text-[#888888] mt-0.5">
            Select a project to resume editing, adjust styles, or download high-res exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-xs text-white placeholder-[#666666] focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onStartNewClip}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Ingest
          </button>
        </div>
      </div>

      {/* Job Grid / Cards */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#111111] border border-[#222222] space-y-3">
          <Film className="w-10 h-10 text-[#444444] mx-auto" />
          <h4 className="text-sm font-semibold text-white">No clipper projects found</h4>
          <p className="text-xs text-[#888888] max-w-sm mx-auto">
            Start a new video ingest by uploading an MP4 or choosing from our sample clipper outputs.
          </p>
          <button
            type="button"
            onClick={onStartNewClip}
            className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#2E2E2E] text-white font-medium text-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Start First Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onOpenJob(job)}
              className="p-4 rounded-3xl bg-[#111111] hover:bg-[#151515] border border-[#222222] hover:border-[#383838] transition-all cursor-pointer group relative flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#181818] mb-3">
                  <img
                    src={job.thumbnailUrl}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase text-[#00FF85] font-semibold">
                    {job.status.replace('_', ' ')}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(job.durationSeconds)}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white group-hover:text-neutral-200 transition-colors line-clamp-2">
                  {job.title}
                </h4>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-[#888888] font-mono">
                  <span>Step {job.currentStep} / 7</span>
                  <span>•</span>
                  <span>{job.styleConfig?.aspectRatio || '9:16'}</span>
                  <span>•</span>
                  <span>{job.fileSizeMb}MB</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between">
                <span className="text-xs text-[#888888]">
                  {job.highlights?.length || 0} viral moments
                </span>
                <span className="text-xs text-white font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open Project <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
