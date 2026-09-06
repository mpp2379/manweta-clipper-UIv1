import React, { useState, useEffect } from 'react';
import {
  Mic,
  AudioWaveform,
  CheckCircle2,
  Cpu,
  Sparkles,
  ArrowRight,
  Globe,
  Radio,
  FileText,
  Volume2
} from 'lucide-react';
import { ClipperJob, WordTimestamp } from '../../types';

interface Step2TranscribeProps {
  job: ClipperJob;
  onTranscriptionComplete: (words: WordTimestamp[], fullText: string) => void;
  theme: 'dark' | 'light';
}

export const Step2Transcribe: React.FC<Step2TranscribeProps> = ({
  job,
  onTranscriptionComplete,
  theme,
}) => {
  const [progress, setProgress] = useState(15);
  const [currentStatusText, setCurrentStatusText] = useState('Extracting 16kHz WAV audio stream with FFmpeg...');
  const [streamedWords, setStreamedWords] = useState<WordTimestamp[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Generate realistic stream
    const words = job.words && job.words.length > 0 ? job.words : [
      { word: "The", start: 0.1, end: 0.3, confidence: 0.98, speaker: "Speaker 1" },
      { word: "biggest", start: 0.35, end: 0.65, confidence: 0.99, speaker: "Speaker 1" },
      { word: "misconception", start: 0.7, end: 1.3, confidence: 0.97, speaker: "Speaker 1" },
      { word: "about", start: 1.35, end: 1.55, confidence: 0.99, speaker: "Speaker 1" },
      { word: "artificial", start: 1.6, end: 2.1, confidence: 0.98, speaker: "Speaker 1" },
      { word: "intelligence", start: 2.15, end: 2.7, confidence: 0.99, speaker: "Speaker 1" },
      { word: "is", start: 2.75, end: 2.9, confidence: 0.96, speaker: "Speaker 1" },
      { word: "that", start: 2.95, end: 3.1, confidence: 0.99, speaker: "Speaker 1" },
      { word: "speed", start: 3.15, end: 3.5, confidence: 0.99, speaker: "Speaker 1" },
      { word: "equals", start: 3.55, end: 3.9, confidence: 0.95, speaker: "Speaker 1" },
      { word: "understanding.", start: 3.95, end: 4.6, confidence: 0.98, speaker: "Speaker 1" },
      { word: "When", start: 4.9, end: 5.1, confidence: 0.99, speaker: "Speaker 1" },
      { word: "we", start: 5.15, end: 5.3, confidence: 0.99, speaker: "Speaker 1" },
      { word: "launched", start: 5.35, end: 5.8, confidence: 0.98, speaker: "Speaker 1" },
      { word: "the", start: 5.85, end: 6.0, confidence: 0.99, speaker: "Speaker 1" },
      { word: "model", start: 6.05, end: 6.4, confidence: 0.99, speaker: "Speaker 1" },
      { word: "we", start: 6.45, end: 6.6, confidence: 0.99, speaker: "Speaker 1" },
      { word: "realized", start: 6.65, end: 7.1, confidence: 0.97, speaker: "Speaker 1" },
      { word: "something", start: 7.15, end: 7.5, confidence: 0.99, speaker: "Speaker 1" },
      { word: "extraordinary.", start: 7.55, end: 8.2, confidence: 0.96, speaker: "Speaker 1" },
      { word: "If", start: 8.5, end: 8.7, confidence: 0.99, speaker: "Speaker 1" },
      { word: "your", start: 8.75, end: 8.95, confidence: 0.99, speaker: "Speaker 1" },
      { word: "product", start: 9.0, end: 9.35, confidence: 0.98, speaker: "Speaker 1" },
      { word: "does", start: 9.4, end: 9.6, confidence: 0.99, speaker: "Speaker 1" },
      { word: "not", start: 9.65, end: 9.85, confidence: 0.99, speaker: "Speaker 1" },
      { word: "deliver", start: 9.9, end: 10.3, confidence: 0.98, speaker: "Speaker 1" },
      { word: "instant", start: 10.35, end: 10.7, confidence: 0.99, speaker: "Speaker 1" },
      { word: "gratification", start: 10.75, end: 11.4, confidence: 0.97, speaker: "Speaker 1" },
      { word: "within", start: 11.45, end: 11.75, confidence: 0.99, speaker: "Speaker 1" },
      { word: "the", start: 11.8, end: 11.95, confidence: 0.99, speaker: "Speaker 1" },
      { word: "first", start: 12.0, end: 12.3, confidence: 0.99, speaker: "Speaker 1" },
      { word: "sixty", start: 12.35, end: 12.7, confidence: 0.98, speaker: "Speaker 1" },
      { word: "seconds,", start: 12.75, end: 13.2, confidence: 0.99, speaker: "Speaker 1" },
      { word: "you", start: 13.3, end: 13.45, confidence: 0.99, speaker: "Speaker 1" },
      { word: "lose", start: 13.5, end: 13.8, confidence: 0.99, speaker: "Speaker 1" },
      { word: "fifty", start: 13.85, end: 14.15, confidence: 0.98, speaker: "Speaker 1" },
      { word: "percent", start: 14.2, end: 14.6, confidence: 0.99, speaker: "Speaker 1" },
      { word: "of", start: 14.65, end: 14.8, confidence: 0.99, speaker: "Speaker 1" },
      { word: "conversions.", start: 14.85, end: 15.5, confidence: 0.98, speaker: "Speaker 1" }
    ];

    let wordIndex = 0;
    let isSubscribed = true;
    let completionTimeout: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      if (!isSubscribed) return;

      if (wordIndex < words.length) {
        const nextWord = words[wordIndex];
        if (nextWord && typeof nextWord.word === 'string') {
          setStreamedWords(prev => [...prev, nextWord]);
        }
        const newProg = Math.min(95, Math.round(15 + ((wordIndex + 1) / words.length) * 80));
        setProgress(newProg);

        if (newProg < 40) {
          setCurrentStatusText('Whisper model parsing phonemes & word boundaries...');
        } else if (newProg < 75) {
          setCurrentStatusText('Calculating word-level timestamps & speaker diarization...');
        } else {
          setCurrentStatusText('Storing word-level transcript into database...');
        }
        wordIndex++;
      } else {
        clearInterval(interval);
        setProgress(100);
        setCurrentStatusText('Transcription complete! Ready for highlight detection.');
        setIsCompleted(true);
        const validWords = words.filter(w => w && typeof w.word === 'string');
        const fullText = validWords.map(w => w.word).join(' ');
        completionTimeout = setTimeout(() => {
          if (isSubscribed) {
            onTranscriptionComplete(validWords, fullText);
          }
        }, 500);
      }
    }, 80);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }
    };
  }, []);

  return (
    <div id="step-2-transcribe-container" className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#00FF85] border border-[#222222] mb-2">
            <span>Step 2: Transcribe Audio</span>
            <span className="text-[#444444]">•</span>
            <span className="font-mono text-[11px] text-[#888888]">Backend: Whisper Speech-to-Text</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Transcribing with Word-Level Timestamps
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-2xl">
            <span className="text-[#EDEDED] font-semibold">USER PROVIDES:</span> Nothing further (runs in async worker queue).
            <span className="text-[#EDEDED] font-semibold ml-2">BACKEND DOES:</span> Extracts audio, sends to Whisper, stores transcript with millisecond word timestamps.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Globe className="w-4 h-4 text-[#888888]" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-[#111111] border border-[#222222] text-xs font-medium text-[#EDEDED] focus:outline-none focus:border-white"
          >
            <option value="en">English (Auto-Detected 99.4%)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ja">Japanese (日本語)</option>
          </select>
        </div>
      </div>

      {/* Progress & Waveform Box */}
      <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#00FF85]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">
                  Whisper Large-v3 Processing Queue
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#181818] text-[#00FF85] border border-[#2A2A2A]">
                  GPU Worker #4
                </span>
              </div>
              <p className="text-xs text-[#888888] font-mono mt-0.5">
                {currentStatusText}
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-lg font-light text-white">{progress}%</span>
            <span className="text-xs text-[#666666] block">Completed</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden border border-[#262626]">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Simulated Audio Spectrum Waveform */}
        <div className="pt-2 flex items-center justify-between gap-1 h-12 px-3 bg-[#0A0A0A] rounded-2xl border border-[#222222] overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const height = Math.sin(i * 0.4 + progress * 0.1) * 35 + 45;
            const isProcessed = (i / 48) * 100 <= progress;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isProcessed
                    ? 'bg-white'
                    : 'bg-[#222222]'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Live Word-Level Timestamp Stream Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#888888] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#00FF85]" />
            Live Word-Level Timestamps Stream ({streamedWords.length} tokens parsed)
          </h4>
          <span className="text-[11px] text-[#666666] font-mono">
            Zero extra transcription cost (captions reused for render)
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-[#0A0A0A] border border-[#222222] max-h-56 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {streamedWords.map((token, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#141414] border border-[#222222] text-xs text-[#EDEDED] hover:border-[#444444] transition-colors group cursor-default"
              >
                <span className="font-medium">{token?.word || ''}</span>
                <span className="text-[9px] font-mono text-[#666666] group-hover:text-[#00FF85]">
                  {(token?.start ?? 0).toFixed(2)}s
                </span>
              </span>
            ))}
            {streamedWords.length === 0 && (
              <p className="text-xs text-[#666666] italic">
                Initializing Whisper audio decode...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {isCompleted && (
        <div className="pt-2 flex justify-end animate-in fade-in">
          <button
            id="proceed-to-highlights-btn"
            onClick={() => {
              const validStreamed = streamedWords.filter(w => w && typeof w.word === 'string');
              const fullText = validStreamed.map(w => w?.word || '').join(' ');
              onTranscriptionComplete(validStreamed, fullText);
            }}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Proceed to Highlight Detection</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </div>
  );
};
