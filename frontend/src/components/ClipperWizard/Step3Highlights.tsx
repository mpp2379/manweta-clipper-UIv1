import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Filter,
  Flame,
  ArrowRight,
  HelpCircle,
  Tag,
  Target
} from 'lucide-react';
import { ClipperJob, HighlightSegment } from '../../types';
import { formatDuration, formatTime, getViralityColor } from '../../lib/utils';
import { generateHighlightsForVideo } from '../../services/mockData';

interface Step3HighlightsProps {
  job: ClipperJob;
  onSelectHighlight: (highlight: HighlightSegment) => void;
  theme: 'dark' | 'light';
}

export const Step3Highlights: React.FC<Step3HighlightsProps> = ({
  job,
  onSelectHighlight,
  theme,
}) => {
  const highlightsList = (job.highlights && job.highlights.length > 0)
    ? job.highlights
    : generateHighlightsForVideo(job.title || 'Viral Podcast Highlight', job.durationSeconds || 180);

  const [targetLength, setTargetLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHighlightId, setSelectedHighlightId] = useState<string>(
    job.selectedHighlightId || highlightsList[0]?.id || 'hl-1'
  );

  const categories = ['all', 'Insight', 'Story', 'Hot Take', 'How-to', 'Mindset'];

  const filtered = highlightsList.filter((hl) => {
    if (selectedCategory !== 'all' && hl.category !== selectedCategory) return false;
    if (targetLength === 'short' && hl.duration > 35) return false;
    if (targetLength === 'long' && hl.duration < 40) return false;
    return true;
  });

  const displayedHighlights = filtered.length > 0 ? filtered : highlightsList;

  const currentSelected =
    displayedHighlights.find((h) => h.id === selectedHighlightId) ||
    highlightsList.find((h) => h.id === selectedHighlightId) ||
    displayedHighlights[0] ||
    highlightsList[0];

  return (
    <div id="step-3-highlights-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 3: Detect Highlights</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: LLM Hook & Pacing Ranker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            AI Viral Highlight Ranking
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Clip length & topic focus filters.
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> LLM scores segments for hook strength, auditory pacing, and emotional payoff.
          </p>
        </div>

        {/* Target Length Preference Pills */}
        <div className="flex items-center gap-1.5 bg-[#111111] p-1 rounded-full border border-[#222222] self-start sm:self-center">
          <button
            id="length-filter-short"
            onClick={() => setTargetLength('short')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              targetLength === 'short'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            15–30s
          </button>
          <button
            id="length-filter-medium"
            onClick={() => setTargetLength('medium')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              targetLength === 'medium'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            30–60s (Reel)
          </button>
          <button
            id="length-filter-long"
            onClick={() => setTargetLength('long')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              targetLength === 'long'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            60–90s
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-[#888888] flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#00FF85]" /> Focus:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-[#111111] border border-[#222222] text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            {cat === 'all' ? 'All Viral Categories' : cat}
          </button>
        ))}
      </div>

      {/* Highlights List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedHighlights.map((hl, index) => {
          const isSelected = hl.id === selectedHighlightId;

          return (
            <div
              key={hl.id}
              id={`highlight-card-${hl.id}`}
              onClick={() => setSelectedHighlightId(hl.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#161616] border-white ring-1 ring-white/20'
                  : 'bg-[#111111] hover:bg-[#141414] border-[#222222] hover:border-[#3A3A3A]'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] text-[#EDEDED] text-xs font-mono font-medium flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#181818] text-[#00FF85] border border-[#2A2A2A]">
                      {hl.category}
                    </span>
                    <span className="text-[11px] text-[#888888] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(hl.startTime)} – {formatTime(hl.endTime)} ({formatDuration(hl.duration)})
                    </span>
                  </div>

                  {/* Hook Score Badge */}
                  <div
                    className="px-2.5 py-1 rounded-full border text-xs font-mono font-medium flex items-center gap-1.5 bg-[#141414] text-[#00FF85] border-[#262626]"
                  >
                    <Flame className="w-3.5 h-3.5 fill-[#00FF85]" />
                    <span>{hl.score}% Hook</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-semibold text-white group-hover:text-neutral-200 transition-colors">
                  {hl.title}
                </h4>

                {/* Hook quote */}
                <div className="mt-2.5 p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-xs text-[#EDEDED] italic leading-relaxed">
                  "{hl.hook}"
                </div>

                {/* Summary */}
                <p className="text-xs text-[#888888] mt-2 line-clamp-2">
                  {hl.summary}
                </p>
              </div>

              {/* Bottom Metadata & Selection Indicator */}
              <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#888888]">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#EDEDED]" />
                    Hook: {hl.hookStrength}%
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#00FF85]" />
                    Pacing: {hl.pacingScore}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHighlightId(hl.id);
                    onSelectHighlight(hl);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#1C1C1C] text-[#EDEDED] hover:bg-[#252525] border border-[#2A2A2A]'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                      Selected
                    </>
                  ) : (
                    'Select Clip'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-3xl bg-[#111111] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[#888888]">
          <span className="text-white font-semibold">Selected Clip:</span>{' '}
          {currentSelected ? currentSelected.title : 'None'} (
          {currentSelected ? formatDuration(currentSelected.duration) : ''})
        </div>

        <button
          id="proceed-to-trimmer-btn"
          onClick={() => currentSelected && onSelectHighlight(currentSelected)}
          className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>Open Timeline Scrubber</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};
