import React from 'react';
import {
  X,
  Accessibility,
  Eye,
  Sliders,
  Volume2,
  Check,
  Type,
  Sun,
  Activity
} from 'lucide-react';
import { AccessibilitySettings } from '../services/storage';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
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

  const toggle = (key: keyof AccessibilitySettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div
      id="a11y-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div
        id="a11y-dialog"
        className={`relative w-full max-w-md rounded-3xl border p-6 shadow-2xl overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-950 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Accessibility Preferences
              </h3>
              <p className="text-xs text-slate-400">
                WCAG 2.1 AA Compliant Display & Nav
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* High Contrast */}
          <div
            onClick={() => toggle('highContrast')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-slate-200 block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-400">Enhances border visibility and text crispness</span>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${settings.highContrast ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
              {settings.highContrast && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Reduced Motion */}
          <div
            onClick={() => toggle('reducedMotion')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-slate-200 block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400">Minimizes animated video pulses and transitions</span>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${settings.reducedMotion ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
              {settings.reducedMotion && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Large Text */}
          <div
            onClick={() => toggle('largeText')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-bold text-slate-200 block">Enhanced Text Legibility</span>
                <span className="text-[11px] text-slate-400">Increases base font size and letter spacing</span>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${settings.largeText ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
              {settings.largeText && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Screen Reader Mode */}
          <div
            onClick={() => toggle('screenReaderOptimized')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-bold text-slate-200 block">Screen Reader Audio Prompts</span>
                <span className="text-[11px] text-slate-400">Adds descriptive ARIA announcements for scrubber</span>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${settings.screenReaderOptimized ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
              {settings.screenReaderOptimized && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-850 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
