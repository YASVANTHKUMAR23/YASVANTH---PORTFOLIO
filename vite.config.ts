import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
        '/health': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    plugins: [react()],
    define: {
      // Only expose client-safe environment variables (prefixed with VITE_)
      // Never expose sensitive secrets like API_KEY, JWT_SECRET, etc.
    },
    build: {
      chunkSizeWarningLimit: 1000

    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});