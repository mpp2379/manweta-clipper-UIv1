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

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMockPlugin()],
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
    },
  };
});
