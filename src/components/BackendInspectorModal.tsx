import React, { useState } from 'react';
import {
  Server,
  X,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Database,
  Code,
  Copy,
  Check
} from 'lucide-react';
import { ClipperJob } from '../types';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'jobJson' | 'logs'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentJob, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="backend-inspector-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="backend-inspector-card"
        className="relative w-full max-w-3xl rounded-3xl bg-[#0F0F0F] border border-[#222222] text-[#EDEDED] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1C1C1C] text-[#00FF85] border border-[#2A2A2A]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Backend Services & Pipeline Inspector
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#00FF85] border border-[#2A2A2A]">
                  HEALTHY
                </span>
              </h3>
              <p className="text-xs text-[#888888]">
                Inspect Whisper speech recognition, GPT-4o highlight scoring, and FFmpeg GPU encoding nodes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#1E1E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#222222] flex gap-4 bg-[#111111]">
          {[
            { id: 'overview', label: 'Microservices & Health' },
            { id: 'jobJson', label: 'Active Job State (JSON)' },
            { id: 'logs', label: 'Pipeline Event Logs' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-[#00FF85] text-white'
                  : 'border-transparent text-[#888888] hover:text-neutral-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Audio Transcriber</span>
                    <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
                  </div>
                  <div className="text-[11px] text-[#888888]">OpenAI Whisper-Large-v3</div>
                  <div className="text-[10px] font-mono text-[#00FF85]">Latency: 1.2s / 5min</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Virality Classifier</span>
                    <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
                  </div>
                  <div className="text-[11px] text-[#888888]">GPT-4o-mini Hook Detector</div>
                  <div className="text-[10px] font-mono text-[#00FF85]">Confidence: 94.2%</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Video Compositor</span>
                    <span className="w-2 h-2 rounded-full bg-[#00FF85]" />
                  </div>
                  <div className="text-[11px] text-[#888888]">FFmpeg 7.0 + NVENC GPU</div>
                  <div className="text-[10px] font-mono text-[#00FF85]">Throughput: 180 FPS</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141414] border border-[#222222] space-y-2">
                <h5 className="font-semibold text-white">Current Environment Configuration</h5>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#A3A3A3]">
                  <div>RUNTIME_TARGET: Node.js (Cloud Run)</div>
                  <div>PORT: 3000</div>
                  <div>STORAGE_DRIVER: localStorage / IndexedDB</div>
                  <div>SYNC_FALLBACK: Enabled (Offline First)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobJson' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Job ID: {currentJob.id}</span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#00FF85]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#080808] border border-[#222222] font-mono text-[11px] text-[#86EFAC] overflow-x-auto max-h-96">
                {JSON.stringify(currentJob, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-4 rounded-2xl bg-[#080808] border border-[#222222] space-y-2 max-h-96 overflow-y-auto">
                {currentJob.backendLogs && currentJob.backendLogs.length > 0 ? (
                  currentJob.backendLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2">
                      <span className="text-[#666666]">{log.timestamp}</span>
                      <span className="text-[#38BDF8]">[{log.service}]</span>
                      <span className={log.level === 'success' ? 'text-[#00FF85]' : 'text-neutral-300'}>
                        {log.message}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[#666666]">No runtime errors recorded. Pipeline operating normally.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
