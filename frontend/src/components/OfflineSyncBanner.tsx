import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2, UploadCloud, ArrowUpRight } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOffline: boolean;
  pendingCount: number;
  onForceSync: () => void;
  onToggleOffline: () => void;
  theme: 'dark' | 'light';
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOffline,
  pendingCount,
  onForceSync,
  onToggleOffline,
  theme,
}) => {
  if (!isOffline && pendingCount === 0) return null;

  return (
    <div
      id="offline-sync-status-banner"
      role="status"
      aria-live="polite"
      className={`w-full py-2.5 px-4 text-xs border-b transition-all flex flex-wrap items-center justify-between gap-3 ${
        isOffline
          ? 'bg-[#141414] border-amber-500/30 text-amber-200'
          : 'bg-[#141414] border-[#222222] text-[#00FF85]'
      }`}
    >
      <div className="flex items-center gap-2 max-w-2xl">
        {isOffline ? (
          <div className="p-1 rounded-md bg-amber-500/10 text-amber-300">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
        ) : (
          <div className="p-1 rounded-md bg-[#1C1C1C] text-[#00FF85]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
        <div>
          <span className="font-semibold text-white">
            {isOffline ? 'Offline Mode Active' : 'Cloud Sync Connected'}
          </span>
          <span className="text-[#888888] ml-1.5 hidden sm:inline">
            {isOffline
              ? 'Your video cuts, caption styles, and trim markers are safely persisted in local IndexedDB.'
              : `${pendingCount} offline action(s) synced with backend worker queue.`}
          </span>
          {pendingCount > 0 && (
            <span className="ml-2 font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] text-amber-200 border border-amber-500/30 font-medium text-[11px]">
              {pendingCount} queued
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isOffline ? (
          <button
            id="reconnect-network-btn"
            onClick={onToggleOffline}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Go Online & Sync
          </button>
        ) : (
          <button
            id="force-sync-btn"
            onClick={onForceSync}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#1C1C1C] hover:bg-[#252525] text-[#EDEDED] border border-[#2A2A2A] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};
