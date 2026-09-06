import { ClipperJob, UserAccount, BackendLog } from '../types';
import { INITIAL_JOBS } from './mockData';

const JOBS_KEY = 'manweta_clipper_jobs_v1';
const USER_KEY = 'manweta_user_profile_v1';
const SYNC_QUEUE_KEY = 'manweta_sync_queue_v1';
const THEME_KEY = 'manweta_theme_pref_v1';
const ACCESSIBILITY_KEY = 'manweta_a11y_pref_v1';

export const DEFAULT_USER: UserAccount = {
  id: 'user_default_01',
  name: 'Alex Rivera',
  email: 'alex.creator@manweta.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'pro',
  creditsRemaining: 480, // 480 minutes left
  creditsTotal: 600,
  isGuest: false,
  joinedDate: 'August 2026'
};

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  soundEffects: boolean;
}

export const DEFAULT_A11Y: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReaderOptimized: false,
  soundEffects: true
};

export class StorageService {
  // --- Jobs Management ---
  static getJobs(): ClipperJob[] {
    try {
      const data = localStorage.getItem(JOBS_KEY);
      if (!data) {
        this.saveJobs(INITIAL_JOBS);
        return INITIAL_JOBS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error, using defaults', e);
      return INITIAL_JOBS;
    }
  }

  static saveJobs(jobs: ClipperJob[]): void {
    try {
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }

  static getJobById(id: string): ClipperJob | undefined {
    const jobs = this.getJobs();
    return jobs.find(j => j.id === id);
  }

  static saveOrUpdateJob(job: ClipperJob): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    this.saveJobs(jobs);
  }

  static deleteJob(id: string): void {
    const jobs = this.getJobs().filter(j => j.id !== id);
    this.saveJobs(jobs);
  }

  static addBackendLog(jobId: string, log: Omit<BackendLog, 'id' | 'timestamp'>): void {
    const jobs = this.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newLog: BackendLog = {
        ...log,
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toLocaleTimeString()
      };
      job.backendLogs = [...(job.backendLogs || []), newLog];
      this.saveJobs(jobs);
    }
  }

  // --- Offline Sync Queue ---
  static getPendingSyncQueue(): string[] {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueueForSync(jobId: string): void {
    const queue = this.getPendingSyncQueue();
    if (!queue.includes(jobId)) {
      queue.push(jobId);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  }

  static dequeueFromSync(jobId: string): void {
    const queue = this.getPendingSyncQueue().filter(id => id !== jobId);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  // --- User Profile ---
  static getUser(): UserAccount {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  }

  static saveUser(user: UserAccount): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }

  static deductCredits(minutes: number): boolean {
    const user = this.getUser();
    if (user.creditsRemaining >= minutes) {
      user.creditsRemaining -= minutes;
      this.saveUser(user);
      return true;
    }
    return false;
  }

  static upgradePlan(planId: 'starter' | 'pro' | 'agency', addedMinutes: number): void {
    const user = this.getUser();
    user.plan = planId;
    user.creditsRemaining += addedMinutes;
    user.creditsTotal += addedMinutes;
    this.saveUser(user);
  }

  // --- Accessibility & Theme ---
  static getA11ySettings(): AccessibilitySettings {
    try {
      const data = localStorage.getItem(ACCESSIBILITY_KEY);
      return data ? JSON.parse(data) : DEFAULT_A11Y;
    } catch {
      return DEFAULT_A11Y;
    }
  }

  static saveA11ySettings(settings: AccessibilitySettings): void {
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings));
  }

  static getTheme(): 'dark' | 'light' {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
  }

  static setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(THEME_KEY, theme);
  }
}
