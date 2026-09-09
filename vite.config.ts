import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiMockPlugin(): Plugin {
  return {
    name: 'api-mock-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        if (url === '/auth/me') {
          res.setHeader('Content-Type', 'application/json');
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
          return;
        }

        if (url === '/auth/google') {
          res.statusCode = 302;
          res.setHeader('Location', '/');
          res.end();
          return;
        }

        if (url === '/auth/logout') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ authenticated: false }));
          return;
        }

        if (url === '/api/jobs' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify([]));
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
            ])
          );
          return;
        }

        if (url.startsWith('/api/jobs') && url.endsWith('/render') && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Render started', jobId: 'job-render' }));
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
  const useMockFallback = env.VITE_ENABLE_MOCK_FALLBACK === 'true';

  return {
    // By default, dev-server requests to /auth, /api, and /media are proxied
    // to the real FastAPI backend (see backend/README or root README §4,
    // Option B) so real Google OAuth / Whisper / GPT / ffmpeg runs end-to-end.
    // Set VITE_ENABLE_MOCK_FALLBACK=true to use in-browser mock responses
    // instead (no backend required) for pure UI iteration.
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
  // Vite's own `loadEnv` covers .env files; process.env already picks up
  // shell-exported vars, which is sufficient here since we only read
  // VITE_API_URL / VITE_ENABLE_MOCK_FALLBACK.
  return {};
}
