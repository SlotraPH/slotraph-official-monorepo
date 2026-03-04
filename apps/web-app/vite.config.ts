import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes(`${'node_modules'}/react/`) || id.includes(`${'node_modules'}/react-dom/`)) {
              return 'react-vendor';
            }

            if (id.includes('lucide-react')) {
              return 'icon-vendor';
            }

            if (id.includes('sileo')) {
              return 'toast-vendor';
            }
          }

          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    fileParallelism: false,
    environment: 'jsdom',
    maxWorkers: 1,
    pool: 'threads',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
