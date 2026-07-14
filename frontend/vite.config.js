import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) return 'motion-vendor';
          if (id.includes('lucide-react')) return 'icons-vendor';
          return 'vendor';
        },
      },
    },
  },
});
