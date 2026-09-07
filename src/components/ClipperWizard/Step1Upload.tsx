import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Play,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  CloudUpload,
  Layers,
  ArrowRight,
  Clock,
  HardDrive
} from 'lucide-react';
import { SampleVideoTemplate } from '../../types';
import { SAMPLE_VIDEOS } from '../../services/mockData';

interface Step1UploadProps {
  onVideoSelected: (source: {
    type: 'upload' | 'youtube' | 'sample';
    url: string;
    fileName?: string;
    fileSizeMb: number;
    durationSec: number;
    title: string;
    thumbnail: string;
    file?: File;
  }) => void;
  theme: 'dark' | 'light';
  isOffline: boolean;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  onVideoSelected,
  theme,
  isOffline,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'samples'>('upload');
  const [linkUrl, setLinkUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [ffprobeValidating, setFfprobeValidating] = useState(false);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{
    name: string;
    sizeMb: number;
    durationSec: number;
    resolution: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToSamples = () => {
    setActiveTab('samples');
    setTimeout(() => {
      const el = document.getElementById('sample-clipper-outputs-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleFile = (file: File) => {
    const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(1));
    const url = URL.createObjectURL(file);
    
    // Simulate ffprobe validation
    setFfprobeValidating(true);
    setUploadProgress(15);

    const tempVideo = document.createElement('video');
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const durationSec = Math.round(tempVideo.duration) || 1800; // fallback 30m
      const meta = {
        name: file.name,
        sizeMb,
        durationSec,
        resolution: `${tempVideo.videoWidth || 1920}x${tempVideo.videoHeight || 1080}`
      };
      setSelectedFileMeta(meta);

      // Simulate S3 multipart chunk upload
      let prog = 20;
      const timer = setInterval(() => {
        prog += 25;
        setUploadProgress(prog);
        if (prog >= 100) {
          clearInterval(timer);
          setFfprobeValidating(false);
          onVideoSelected({
            type: 'upload',
            url,
            fileName: file.name,
            fileSizeMb: sizeMb,
            durationSec,
            title: file.name.replace(/\.[^/.]+$/, ''),
            thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
            file
          });
        }
      }, 300);
    };
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    setFfprobeValidating(true);
    setUploadProgress(30);

    setTimeout(() => {
      setUploadProgress(100);
      setFfprobeValidating(false);

      // Pick sample matched to URL or generic
      const matched = SAMPLE_VIDEOS[0];
      onVideoSelected({
        type: 'youtube',
        url: linkUrl,
        fileSizeMb: 850,
        durationSec: 3600,
        title: 'Imported Long Stream: ' + (linkUrl.slice(0, 30) + '...'),
        thumbnail: matched.thumbnail
      });
    }, 800);
  };

  const handleSelectSample = (sample: SampleVideoTemplate) => {
    setFfprobeValidating(true);
    setUploadProgress(40);

    setTimeout(() => {
      setUploadProgress(100);
      setFfprobeValidating(false);
      onVideoSelected({
        type: 'sample',
        url: sample.videoUrl,
        fileName: `${sample.id}.mp4`,
        fileSizeMb: 620,
        durationSec: sample.durationSec,
        title: sample.title,
        thumbnail: sample.thumbnail
      });
    }, 500);
  };

  return (
    <div id="step-1-upload-container" className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 1: Choose Your Video</span>
            <span className="text-[#444444]">•</span>
            <span className="text-[11px] text-[#888888]">Ready for Highlights</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Select Your Source Video
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            Upload your video file or paste a link in the center below. You can also test with sample clipper outputs at the bottom of the page.
          </p>
        </div>

        {/* Tab Switcher - Preserves exact button ID and order for selectors */}
        <div className="flex items-center bg-[#111111] p-1 rounded-full border border-[#222222] self-start sm:self-center shadow-inner">
          <button
            id="tab-samples-btn"
            type="button"
            onClick={scrollToSamples}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'samples'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#00FF85]" />
            <span>Sample Clipper Outputs</span>
            <span className="text-[10px] text-[#888888]">↓</span>
          </button>
          <button
            id="tab-upload-btn"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            id="tab-link-btn"
            type="button"
            onClick={() => setActiveTab('link')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste Link</span>
          </button>
        </div>
      </div>

      {/* Validation / Upload In-Flight Overlay */}
      {ffprobeValidating && (
        <div
          id="upload-ffprobe-modal"
          className="p-6 rounded-3xl bg-[#141414] border border-[#262626] backdrop-blur-md text-center space-y-4 animate-in fade-in"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-[#1C1C1C] border border-[#2A2A2A] flex items-center justify-center">
            <CloudUpload className="w-6 h-6 text-[#00FF85] animate-bounce" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">
              Preparing Your Video...
            </h4>
            <p className="text-xs text-[#888888] mt-1">
              Checking video quality and getting it ready for automatic highlight detection
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="w-full bg-[#222222] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${uploadProgress || 20}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#888888] mt-1.5">
              <span>Analyzing audio & video quality...</span>
              <span>{uploadProgress || 20}%</span>
            </div>
          </div>
        </div>
      )}

      {/* CENTER OF PAGE: In the center we have upload file and paste link */}
      <div id="center-ingest-container" className="max-w-3xl mx-auto space-y-4">
        {/* Center Toggle Switcher */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center bg-[#111111] p-1.5 rounded-2xl border border-[#222222] shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'link'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Paste Link</span>
            </button>
          </div>
        </div>

        {/* Center View 1: Drag & Drop File Upload */}
        {(activeTab === 'upload' || activeTab === 'samples') && (
          <div
            id="dropzone-upload-area"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-white bg-[#1A1A1A]'
                : 'border-[#262626] hover:border-[#3A3A3A] bg-[#111111]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,audio/mp3,audio/wav"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181818] border border-[#2A2A2A] flex items-center justify-center mb-4 text-[#00FF85] group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-medium text-white">
              Drag & drop your video or podcast file here
            </h3>
            <p className="text-xs text-[#888888] mt-1 max-w-md mx-auto">
              Supports MP4, MOV, MKV, WebM, MP3 (Up to 4GB / 4 hours duration).
              Fast cloud processing with automatic highlight detection.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#888888]">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                Studio Audio Clarity
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                Smart 9:16 Reframing
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
                Auto-Save Drafts
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-sm transition-all"
              >
                Browse Local Files
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('link');
                }}
                className="px-4 py-2.5 rounded-xl bg-[#181818] hover:bg-[#222222] text-[#888888] hover:text-white font-medium text-xs border border-[#2A2A2A] transition-all"
              >
                Or paste a link instead →
              </button>
            </div>
          </div>
        )}

        {/* Center View 2: Link Importer */}
        {activeTab === 'link' && (
          <form
            id="link-import-form"
            onSubmit={handleLinkSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-[#222222] space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#161616] text-[#00FF85] border border-[#262626]">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Import from URL
                </h3>
                <p className="text-xs text-[#888888]">
                  Paste a link from YouTube, Vimeo, Loom, Google Drive, or public MP4 stream.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-white font-mono"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Fetch & Transcribe
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#888888]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  High-definition audio extraction for crisp captions and clear voice clarity.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="text-xs text-[#00FF85] hover:underline self-start sm:self-auto"
              >
                Have a local file? Drag & drop here →
              </button>
            </div>
          </form>
        )}

        {/* Creator Highlight Badge - Tailored for short video reel & ad creators */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#00FF85] flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-medium">Built for Viral Shorts, Reels & Video Ads</span>
              <p className="text-[#888888] text-[11px] mt-0.5">
                Auto-detects high-retention hooks, smart 9:16 vertical crop, and animated captions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#181818] text-[#EDEDED] border border-[#2A2A2A]">
              9:16 Vertical
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#181818] text-[#EDEDED] border border-[#2A2A2A]">
              Hook Scoring
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#141F18] text-[#00FF85] border border-[#00FF85]/30">
              Ready to Post
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM OF PAGE AT LAST: Sample Clipper Outputs */}
      <section
        id="sample-clipper-outputs-section"
        className={`pt-8 border-t space-y-4 transition-all duration-300 ${
          activeTab === 'samples'
            ? 'border-[#00FF85]/50 ring-1 ring-[#00FF85]/20 rounded-3xl p-4 bg-[#111814]/30'
            : 'border-[#222222]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#161616] text-[#00FF85] border border-[#262626] mb-1">
              <Sparkles className="w-3 h-3" />
              Instant Pre-Processed Demos
            </div>
            <h3 className="text-lg font-semibold text-white">
              Sample Clipper Outputs
            </h3>
            <p className="text-xs text-[#888888] mt-0.5">
              Click any pre-processed video below to test automatic highlight detection, viral hook scoring, and 9:16 reel rendering without uploading.
            </p>
          </div>
          <span className="text-[11px] text-[#888888] font-mono bg-[#111111] border border-[#222222] px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-pulse" />
            4 Ready-to-Test Outputs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_VIDEOS.map((sample) => (
            <div
              key={sample.id}
              id={`sample-card-${sample.id}`}
              onClick={() => handleSelectSample(sample)}
              className="group p-4 rounded-3xl bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#3A3A3A] cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-4 items-start">
                  <div className="relative w-32 h-22 rounded-2xl overflow-hidden flex-shrink-0 bg-[#1A1A1A] border border-[#262626]">
                    <img
                      src={sample.thumbnail}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#888888]" />
                      {sample.duration}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#00FF85] border border-[#2A2A2A]">
                        {sample.category}
                      </span>
                      <span className="text-xs text-[#888888] truncate">
                        {sample.channel}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white group-hover:text-neutral-200 transition-colors line-clamp-2">
                      {sample.title}
                    </h4>

                    <p className="text-xs text-[#888888] mt-1 line-clamp-2 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between text-xs">
                <span className="text-[#00FF85] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {sample.sampleHighlightsCount} viral hook candidate clips
                </span>
                <span className="text-white font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Start Clipping <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
