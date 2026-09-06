/**
 * Manweta AI Clipper - API client
 *
 * Talks to the Flask backend (see /backend). Auth is cookie-based (httpOnly
 * JWT + refresh token set by the server), so every request uses
 * `credentials: 'include'`.
 *
 * In production the SPA is served from the same origin as the API, so
 * VITE_API_BASE_URL can be left empty (relative URLs). For local dev with
 * `npm run dev` (Vite on :3000) point it at the Flask server, e.g.
 * VITE_API_BASE_URL=http://127.0.0.1:5000
 */

import { ClipperJob, UserAccount, HighlightSegment, StyleConfig, BackendLog } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/** Prefixes relative `/media/...` paths with API_BASE for split dev servers. */
export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

function withResolvedMedia(job: ClipperJob): ClipperJob {
  return {
    ...job,
    thumbnailUrl: resolveMediaUrl(job.thumbnailUrl) || job.thumbnailUrl,
    renderedVideoUrl: resolveMediaUrl(job.renderedVideoUrl),
    downloadUrl: resolveMediaUrl(job.downloadUrl),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      /* ignore non-JSON error body */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---------------------------------------------------------------- Auth

export interface AuthMeResponse {
  authenticated: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    profile_image: string | null;
  };
}

export const AuthApi = {
  /** Full-page redirect into the Google OAuth flow. */
  loginWithGoogle(): void {
    window.location.href = `${API_BASE}/auth/google`;
  },

  async me(): Promise<AuthMeResponse> {
    try {
      return await request<AuthMeResponse>('/auth/me');
    } catch {
      return { authenticated: false };
    }
  },

  async logout(): Promise<void> {
    await request('/auth/logout', { method: 'POST' });
  },

  /** Maps the backend's user shape onto the frontend's UserAccount type. */
  toUserAccount(me: AuthMeResponse): UserAccount | null {
    if (!me.authenticated || !me.user) return null;
    return {
      id: me.user.id,
      name: me.user.name || 'Creator',
      email: me.user.email || '',
      avatar: me.user.profile_image ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'free',
      creditsRemaining: 60,
      creditsTotal: 60,
      isGuest: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  },
};

// ---------------------------------------------------------------- Jobs

export const JobsApi = {
  async list(): Promise<ClipperJob[]> {
    const jobs = await request<ClipperJob[]>('/api/jobs');
    return jobs.map(withResolvedMedia);
  },

  async get(jobId: string): Promise<ClipperJob> {
    const job = await request<ClipperJob>(`/api/jobs/${jobId}`);
    return withResolvedMedia(job);
  },

  /** Uploads a video file and kicks off OpenAI transcription + highlight analysis. */
  async create(file: File, title?: string): Promise<ClipperJob> {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    const job = await request<ClipperJob>('/api/jobs', { method: 'POST', body: form });
    return withResolvedMedia(job);
  },

  remove(jobId: string): Promise<void> {
    return request(`/api/jobs/${jobId}`, { method: 'DELETE' });
  },

  /** Starts async ffmpeg rendering for a chosen highlight or a custom time range. */
  render(
    jobId: string,
    selection: { highlightId?: string; customRange?: [number, number] },
    styleConfig: StyleConfig
  ): Promise<{ message: string; jobId: string }> {
    return request(`/api/jobs/${jobId}/render`, {
      method: 'POST',
      body: JSON.stringify({ ...selection, styleConfig }),
    });
  },

  logs(jobId: string): Promise<BackendLog[]> {
    return request(`/api/jobs/${jobId}/logs`);
  },

  /**
   * Polls a job until `predicate` returns true (or `status` reaches a terminal
   * state: awaiting_selection, done, failed). Used to drive the wizard's
   * "processing" screens off real backend state instead of a fake timer.
   */
  async pollUntil(
    jobId: string,
    predicate: (job: ClipperJob) => boolean,
    { intervalMs = 2000, timeoutMs = 10 * 60 * 1000 } = {}
  ): Promise<ClipperJob> {
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const job = await JobsApi.get(jobId);
      if (predicate(job) || job.status === 'failed') return job;
      if (Date.now() - start > timeoutMs) throw new Error('Timed out waiting for job');
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  },
};
