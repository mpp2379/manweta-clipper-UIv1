import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiMockPlugin(): Plugin {
  const mockJobs = new Map<string, any>();

  return {
    name: 'api-mock-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const fullUrl = req.url || '';
        const [url] = fullUrl.split('?');
        const cookies = req.headers.cookie || '';
        const isAuthenticated = cookies.includes('manweta_session=1');

        if (url === '/healthz') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (url === '/auth/me') {
          res.setHeader('Content-Type', 'application/json');
          if (isAuthenticated) {
            res.end(
              JSON.stringify({
                authenticated: true,
                user: {
                  id: 'usr_manweta_pro',
                  name: 'Creator Studio',
                  email: 'creator@manweta.ai',
                  profile_image: null,
                },
              })
            );
          } else {
            res.end(JSON.stringify({ authenticated: false, user: null }));
          }
          return;
        }

        if (url === '/auth/google') {
          res.setHeader('Set-Cookie', 'manweta_session=1; Path=/; SameSite=Lax');
          res.statusCode = 302;
          res.setHeader('Location', '/');
          res.end();
          return;
        }

        if (url === '/auth/logout') {
          res.setHeader('Set-Cookie', 'manweta_session=; Path=/; Max-Age=0');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ authenticated: false }));
          return;
        }

        if (url === '/api/jobs' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(Array.from(mockJobs.values())));
          return;
        }

        if (url === '/api/jobs' && req.method === 'POST') {
          const jobId = 'job_' + Date.now().toString(36);
          const sampleWords = [
            { word: 'Welcome', start: 142.0, end: 142.4 },
            { word: 'to', start: 142.4, end: 142.6 },
            { word: 'Manweta', start: 142.6, end: 143.1 },
            { word: 'Creative', start: 143.1, end: 143.6 },
            { word: 'Studio', start: 143.6, end: 144.0 },
            { word: 'viral', start: 144.1, end: 144.5 },
            { word: 'clip', start: 144.5, end: 144.8 },
            { word: 'generation', start: 144.8, end: 145.4 }
          ];
          const sampleHighlights = [
            {
              id: 'hl_' + Date.now(),
              title: 'Viral Hook Moment',
              category: 'Engagement',
              startTime: 142,
              endTime: 187,
              duration: 45,
              score: 96,
              hook: 'How to scale your creative workflow with AI in seconds',
              summary: 'Key takeaway on automated content scaling and high-converting video formats.'
            }
          ];

          const newJob = {
            id: jobId,
            title: 'Uploaded Clip',
            sourceType: 'upload',
            sourceFileName: 'clip_stream.mp4',
            fileSizeMb: 45,
            durationSeconds: 240,
            resolution: '1920x1080',
            fps: 60,
            thumbnailUrl:
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            status: 'awaiting_selection',
            currentStep: 2,
            progressPercent: 40,
            transcriptText: sampleWords.map((w) => w.word).join(' '),
            words: sampleWords,
            highlights: sampleHighlights,
            selectedHighlightId: sampleHighlights[0].id,
            customClipRange: [142, 187],
            styleConfig: {
              captionStyle: 'hormozi',
              aspectRatio: '9:16',
              framing: 'smart_speaker',
              fontSize: 'lg',
              fontFamily: 'display',
              textColor: '#FFFFFF',
              highlightColor: '#00FF85',
              showEmojis: true,
              position: 'middle',
              musicTrack: 'lo-fi-beats',
              musicVolume: 18,
              showBrandLogo: true,
              brandName: '@manweta.ai',
              autoReOffsetTimestamps: true,
            },
            createdAt: new Date().toISOString(),
            syncState: 'synced',
            downloadUrl:
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            backendLogs: [
              {
                id: 'log-1',
                timestamp: new Date().toLocaleTimeString(),
                service: 'Whisper',
                level: 'success',
                message: 'Speech transcribed and word timestamps aligned.',
              },
              {
                id: 'log-2',
                timestamp: new Date().toLocaleTimeString(),
                service: 'GPT-Analyzer',
                level: 'info',
                message: 'Viral moments and engagement hooks detected.',
              },
            ],
          };

          mockJobs.set(jobId, newJob);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 201;
          res.end(JSON.stringify(newJob));
          return;
        }

        const jobMatch = url.match(/^\/api\/jobs\/([^/]+)$/);
        if (jobMatch && req.method === 'GET') {
          const jobId = jobMatch[1];
          const job = mockJobs.get(jobId);
          res.setHeader('Content-Type', 'application/json');
          if (job) {
            res.end(JSON.stringify(job));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Job not found' }));
          }
          return;
        }

        if (url.startsWith('/api/jobs') && url.endsWith('/logs')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify([
              {
                id: 'log-1',
                timestamp: new Date().toISOString(),
                service: 'ai-engine',
                level: 'info',
                message: 'AI Studio engine pipeline ready',
              },
              {
                id: 'log-2',
                timestamp: new Date().toISOString(),
                service: 'FFmpeg Pipeline',
                level: 'success',
                message: 'Processing render stages',
              },
            ])
          );
          return;
        }

        if (url.startsWith('/api/jobs') && url.endsWith('/render') && req.method === 'POST') {
          const parts = url.split('/');
          const jobId = parts[3] || 'job-render';
          const existingJob = mockJobs.get(jobId);
          if (existingJob) {
            existingJob.status = 'done';
            existingJob.currentStep = 7;
            existingJob.progressPercent = 100;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, jobId, message: 'Render started' }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnvVars(mode) };
  const backendUrl = env.VITE_API_URL || 'http://127.0.0.1:5000';
  const useMockFallback = env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

  return {
    plugins: [react(), tailwindcss(), ...(useMockFallback ? [apiMockPlugin()] : [])],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: useMockFallback
        ? undefined
        : {
            '/auth': { target: backendUrl, changeOrigin: true },
            '/api': { target: backendUrl, changeOrigin: true },
            '/media': { target: backendUrl, changeOrigin: true },
          },
    },
  };
});

function loadEnvVars(_mode: string): Record<string, string | undefined> {
  return {};
}
