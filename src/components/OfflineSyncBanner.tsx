import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

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
      id="offline-sync-banner"
      className={`w-full px-4 py-2.5 border-b text-xs flex items-center justify-between transition-colors ${
        isOffline
          ? 'bg-[#1C1608] border-[#EAB308]/30 text-[#FACC15]'
          : 'bg-[#091E14] border-[#00FF85]/30 text-[#00FF85]'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-[#FACC15] animate-pulse" />
              <span className="font-semibold">Offline Simulation Active</span>
              <span className="text-[#888888]">•</span>
              <span className="text-neutral-300">
                All edits and reel drafts are safely saved on your device.
              </span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/20 text-[#FACC15] font-mono font-medium text-[11px]">
                  {pendingCount} pending sync
                </span>
              )}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#00FF85]" />
              <span className="font-semibold">Reconnected to Cloud Server</span>
              <span className="text-[#888888]">•</span>
              <span className="text-neutral-300">
                Syncing local queue to cloud infrastructure...
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOffline ? (
            <button
              type="button"
              onClick={onToggleOffline}
              className="px-3 py-1 rounded-lg bg-[#FACC15] hover:bg-[#FDE047] text-black font-semibold text-[11px] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Go Online & Sync
            </button>
          ) : (
            <button
              type="button"
              onClick={onForceSync}
              className="px-3 py-1 rounded-lg bg-[#00FF85] hover:bg-[#34D399] text-black font-semibold text-[11px] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Force Sync Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
