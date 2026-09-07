import React from 'react';
import { Eye, X, Check, Sliders, Volume2, Sparkles } from 'lucide-react';
import { AccessibilitySettings } from '../services/storage';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: AccessibilitySettings) => void;
  theme: 'dark' | 'light';
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme,
}) => {
  if (!isOpen) return null;

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div
      id="accessibility-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="accessibility-dialog-card"
        className="relative w-full max-w-lg rounded-3xl bg-[#0F0F0F] border border-[#222222] text-[#EDEDED] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1C1C1C] text-[#00FF85] border border-[#2A2A2A]">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Accessibility Preferences</h3>
              <p className="text-xs text-[#888888]">Customize visual hierarchy, contrast, and animations</p>
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

        <div className="p-6 space-y-4 text-xs">
          {[
            {
              key: 'highContrast' as const,
              title: 'High Contrast Mode',
              desc: 'Increases edge contrast on interactive buttons, cards, and subtitle previews',
            },
            {
              key: 'reducedMotion' as const,
              title: 'Reduced Motion',
              desc: 'Disables kinetic micro-animations, bouncy badges, and confetti bursts',
            },
            {
              key: 'largeText' as const,
              title: 'Larger Typography Scale',
              desc: 'Enlarges timestamps, transcript text, and wizard navigation labels',
            },
            {
              key: 'screenReaderOptimized' as const,
              title: 'Screen Reader Optimized',
              desc: 'Adds verbose ARIA tags and structured live region announcements',
            },
          ].map((item) => {
            const active = settings[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleSetting(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-[#15231B] border-[#00FF85]/40 text-white'
                    : 'bg-[#141414] border-[#222222] text-[#888888] hover:border-[#333333]'
                }`}
              >
                <div>
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-[#888888] mt-0.5">{item.desc}</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    active
                      ? 'bg-[#00FF85] border-[#00FF85] text-black font-bold'
                      : 'border-[#444444] bg-[#1F1F1F]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#222222] bg-[#141414] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs transition-colors hover:bg-neutral-200"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
