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
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'samples'>('samples');
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
    <div id="step-1-upload-container" className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 1: Upload or Link</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: ffprobe + S3 + Queue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Ingest Source Video
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            Provide a long podcast, webinar, keynote, or interview. Our worker extracts the audio stream, verifies codec compatibility with ffprobe, and streams to S3.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#111111] p-1 rounded-full border border-[#222222] self-start sm:self-center">
          <button
            id="tab-samples-btn"
            onClick={() => setActiveTab('samples')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'samples'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            Sample Podcasts
          </button>
          <button
            id="tab-upload-btn"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            Upload File
          </button>
          <button
            id="tab-link-btn"
            onClick={() => setActiveTab('link')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'link'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#888888] hover:text-[#EDEDED]'
            }`}
          >
            Paste Link
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
              Validating Stream & Uploading to S3...
            </h4>
            <p className="text-xs text-[#888888] font-mono mt-1">
              Executing ffprobe -show_streams -print_format json & pushing multipart chunks
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
              <span>ffprobe: H.264 / AAC verified</span>
              <span>{uploadProgress || 20}%</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Sample Video Templates (Instant Start) */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00FF85]" />
              Recommended Long-Form Demos (Zero upload wait)
            </span>
            <span className="text-[11px] text-[#888888]">
              Click any demo to immediately test the 7-step pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_VIDEOS.map((sample) => (
              <div
                key={sample.id}
                id={`sample-card-${sample.id}`}
                onClick={() => handleSelectSample(sample)}
                className="group p-4 rounded-3xl bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#3A3A3A] cursor-pointer transition-all relative overflow-hidden"
              >
                <div className="flex gap-4 items-start">
                  <div className="relative w-28 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#1A1A1A] border border-[#262626]">
                    <img
                      src={sample.thumbnail}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
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

                    <p className="text-xs text-[#888888] mt-1 line-clamp-1">
                      {sample.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#222222] flex items-center justify-between text-xs">
                  <span className="text-[#00FF85] font-medium flex items-center gap-1">
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
        </div>
      )}

      {/* TAB 2: Drag & Drop File Upload */}
      {activeTab === 'upload' && (
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
            Drag & drop your podcast or video file here
          </h3>
          <p className="text-xs text-[#888888] mt-1 max-w-md mx-auto">
            Supports MP4, MOV, MKV, WebM, MP3 (Up to 4GB / 4 hours duration).
            Auto-chunked multipart S3 uploads with resumption.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#888888]">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
              Lossless Audio Extraction
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
              FFmpeg Codec Auto-Fix
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#161616] border border-[#262626]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
              IndexedDB Local Cache
            </span>
          </div>

          <button
            type="button"
            className="mt-6 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-sm transition-all"
          >
            Browse Local Files
          </button>
        </div>
      )}

      {/* TAB 3: Link Importer */}
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

          <div className="pt-2 flex items-center gap-2 text-xs text-[#888888]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Serverless worker automatically downloads audio at highest bitrate (320kbps AAC).
            </span>
          </div>
        </form>
      )}

      {/* Backend Architecture Note (as specified in OCR Page 2) */}
      <div className="p-4 rounded-2xl bg-[#111111] border border-[#222222] flex items-center justify-between text-xs text-[#888888]">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-[#00FF85]" />
          <span>
            <strong className="text-[#EDEDED]">Backend Action:</strong> Validates file with ffprobe, stores raw file in S3, creates job record in state <code className="text-white font-mono">queued</code>.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-[#00FF85]/80">
          POST /api/v1/jobs/ingest → 202 Accepted
        </span>
      </div>
    </div>
  );
};
