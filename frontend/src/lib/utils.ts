import { StyleConfig } from '../types';

export function formatTime(seconds?: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null || isNaN(seconds)) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const remSecs = Math.round(seconds % 60);
  return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`;
}

export function getViralityColor(score: number): { text: string; bg: string; border: string; glow: string } {
  if (score >= 90) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]'
    };
  }
  if (score >= 80) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
    };
  }
  return {
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.25)]'
  };
}

export function generateFFmpegCommand(
  sourceFile: string,
  startSec: number,
  endSec: number,
  style: StyleConfig
): string {
  const startTimeStr = formatTime(startSec);
  const endTimeStr = formatTime(endSec);
  
  let cropFilter = 'crop=ih*(9/16):ih:x=(iw-ow)/2';
  if (style.aspectRatio === '1:1') {
    cropFilter = 'crop=ih:ih:x=(iw-ow)/2';
  } else if (style.aspectRatio === '16:9') {
    cropFilter = 'scale=1920:1080';
  }

  const audioMix = style.musicTrack !== 'none'
    ? `-i music_${style.musicTrack}.mp3 -filter_complex "[0:a]volume=1.0[v1];[1:a]volume=${(style.musicVolume / 100).toFixed(2)}[m1];[v1][m1]amix=inputs=2:duration=first[aout]"`
    : '';

  return `ffmpeg -ss ${startTimeStr} -to ${endTimeStr} -i ${sourceFile || 'source.mp4'} ${audioMix} -vf "${cropFilter},subtitles=captions_reoffset_0sec.ass:force_style='FontSize=24,PrimaryColour=&H00FFFFFF&'" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k output_reel.mp4`;
}
