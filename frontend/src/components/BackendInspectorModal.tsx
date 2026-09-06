import React, { useState } from 'react';
import {
  X,
  Terminal,
  Server,
  Layers,
  Cpu,
  Database,
  Radio,
  FileCode,
  Shield,
  Activity,
  CheckCircle2,
  Copy,
  Info
} from 'lucide-react';
import { ClipperJob } from '../types';
import { generateFFmpegCommand, formatTime } from '../lib/utils';

interface BackendInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentJob: ClipperJob;
  theme: 'dark' | 'light';
}

export const BackendInspectorModal: React.FC<BackendInspectorModalProps> = ({
  isOpen,
  onClose,
  currentJob,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'whisper' | 'ffmpeg' | 'logs'>('flow');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inPoint = currentJob.customClipRange[0];
  const outPoint = currentJob.customClipRange[1];
  const ffmpegCmd = generateFFmpegCommand(
    currentJob.sourceFileName || 'source.mp4',
    inPoint,
    outPoint,
    currentJob.styleConfig
  );

  const sampleWordsWithReOffset = (currentJob.words || [])
    .filter(w => w && typeof w.word === 'string')
    .slice(0, 8)
    .map(w => ({
      word: w?.word || '',
      sourceStart: w?.start ?? 0,
      sourceEnd: w?.end ?? 0,
      reOffsetStart: Math.max(0, parseFloat(((w?.start ?? 0) - inPoint).toFixed(2))),
      reOffsetEnd: Math.max(0, parseFloat(((w?.end ?? 0) - inPoint).toFixed(2)))
    }));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="backend-inspector-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
    >
      <div
        id="backend-inspector-dialog"
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          theme === 'dark'
            ? 'bg-slate-950 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  Manweta AI Backend Architecture & Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Job ID: {currentJob.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect the 7-step pipeline flow, ffprobe metadata, Whisper timestamps, and FFmpeg filtergraphs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-800 bg-slate-950/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Pipeline Flow & States
          </button>

          <button
            onClick={() => setActiveTab('whisper')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'whisper'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Whisper Word Timestamps & Re-offset Math
          </button>

          <button
            onClick={() => setActiveTab('ffmpeg')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ffmpeg'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            FFmpeg Command CLI
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live Event Logs ({currentJob.backendLogs?.length || 0})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: 7-Step Pipeline Flow Diagram */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
                <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">
                  Every step from Transcribe onward runs as an <span className="text-white font-bold">asynchronous queued job</span>. The frontend polls or listens to a WebSocket for state transitions: <code className="text-emerald-300 font-mono">queued → transcribing → analyzing → awaiting_selection → rendering → done / failed</code>.
                </p>
              </div>

              {/* 7 Step Breakdown Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                      <th className="p-3">Step</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">User Provides</th>
                      <th className="p-3">Backend Does</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">1</td>
                      <td className="p-3 text-white font-sans font-bold">Upload or link</td>
                      <td className="p-3 text-slate-300 font-sans">Uploads video file (podcast, webinar) or link</td>
                      <td className="p-3 text-emerald-300">ffprobe validate → S3 raw upload → create job → push to queue</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">2</td>
                      <td className="p-3 text-white font-sans font-bold">Transcribe audio</td>
                      <td className="p-3 text-slate-400 font-sans italic">Nothing further (automated worker)</td>
                      <td className="p-3 text-emerald-300">Worker extracts audio → sends to Whisper → stores word-level timestamps</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">3</td>
                      <td className="p-3 text-white font-sans font-bold">Detect highlights</td>
                      <td className="p-3 text-slate-300 font-sans">Optionally sets clip length / topic focus</td>
                      <td className="p-3 text-emerald-300">LLM reads transcript → scores hook strength & pacing → returns ranked timestamps</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">4</td>
                      <td className="p-3 text-white font-sans font-bold">User selects clip</td>
                      <td className="p-3 text-slate-300 font-sans">Picks suggested clip or adjusts in/out points on scrubber</td>
                      <td className="p-3 text-emerald-300">Store selected timestamps against job (fast, synchronous)</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">5</td>
                      <td className="p-3 text-white font-sans font-bold">Style choices</td>
                      <td className="p-3 text-slate-300 font-sans">Sets caption style, brand colors/logo, music track, aspect ratio</td>
                      <td className="p-3 text-emerald-300">Store as render parameters attached to job record</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">6</td>
                      <td className="p-3 text-white font-sans font-bold">Render the clip</td>
                      <td className="p-3 text-slate-400 font-sans italic">Waits (progress indicator shown)</td>
                      <td className="p-3 text-emerald-300">FFmpeg crops to 9:16 → burns word-timed captions → overlays music → encodes MP4</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-indigo-400">7</td>
                      <td className="p-3 text-white font-sans font-bold">Deliver the reel</td>
                      <td className="p-3 text-slate-300 font-sans">Receives notification & reviews result</td>
                      <td className="p-3 text-emerald-300">Upload to S3 CDN → mark job complete → notify via websocket → serve download link</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Whisper Timestamps & Re-offset Math */}
          {activeTab === 'whisper' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  Crucial Implementation Detail: Timestamp Re-Offsetting
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "When cropping a clip out of the source video, re-offset caption timestamps to the clip's own 0:00 start — a common bug spot."
                  Because FFmpeg cuts with <code className="text-amber-300 font-mono">-ss {formatTime(inPoint)}</code>, the resulting video starts at second 0. Captions generated from the full podcast transcript must subtract <code className="text-amber-300 font-mono">{inPoint.toFixed(2)}s</code> so they fire at the exact right moment.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] space-y-2">
                <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2 font-bold">
                  <span>Word</span>
                  <span>Source Podcast Time</span>
                  <span>Re-Offset Output Clip Time (Clip 0:00 start)</span>
                </div>
                {sampleWordsWithReOffset.map((w, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-900 hover:bg-slate-900/50">
                    <span className="text-white font-bold">"{w.word}"</span>
                    <span className="text-slate-400">{w.sourceStart.toFixed(2)}s – {w.sourceEnd.toFixed(2)}s</span>
                    <span className="text-emerald-400 font-bold">
                      {w.reOffsetStart.toFixed(2)}s – {w.reOffsetEnd.toFixed(2)}s (re-offset: -{inPoint.toFixed(1)}s)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FFmpeg Command CLI */}
          {activeTab === 'ffmpeg' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Generated FFmpeg Filtergraph Pipeline</span>
                <button
                  onClick={() => copyToClipboard(ffmpegCmd)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied CLI!' : 'Copy Command'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 leading-relaxed break-all">
                {ffmpegCmd}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-white block mb-1">Center-Crop Filter:</strong>
                  <code>crop=ih*(9/16):ih:x=(iw-ow)/2</code>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <strong className="text-white block mb-1">Audio Overlay Mix:</strong>
                  <code>amix=inputs=2:duration=first</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Live Event Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-2 font-mono text-[11px]">
              {currentJob.backendLogs && currentJob.backendLogs.length > 0 ? (
                currentJob.backendLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-850 flex items-start gap-3"
                  >
                    <span className="text-slate-500 select-none">{log.timestamp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold text-[10px]">
                      {log.service}
                    </span>
                    <span className={log.level === 'success' ? 'text-emerald-400' : 'text-slate-300'}>
                      {log.message}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic p-4">No backend logs recorded yet for this session.</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Manweta AI Worker Daemon • Node v22.14.0 • FFmpeg 6.1</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
