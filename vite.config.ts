import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // Auto-detect base path:
  // - If VITE_BASE_PATH is provided, use it.
  // - If running in GitHub Actions for username.github.io (root domain), use '/'.
  // - If running in GitHub Actions for a project repo (e.g., /teslamanagement-/), use '/<repo>/'.
  // - Otherwise default to '/' or './'
  let basePath = process.env.VITE_BASE_PATH || '/';
  if (process.env.GITHUB_REPOSITORY) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (repoName) {
      basePath = repoName.endsWith('.github.io') ? '/' : `/${repoName}/`;
    }
  }

  return {
    base: basePath,

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      target: 'esnext',
      minify: 'esbuild' as const,
      cssMinify: true,

      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },

      chunkSizeWarningLimit: 1000,
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify HMR settings to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true' ? true : false,

      // Disable file watching when DISABLE_HMR is true to save CPU.
      watch: process.env.DISABLE_HMR === 'true' ? {} : undefined,
    },
  };
});
