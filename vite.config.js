import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        jobs: resolve(__dirname, 'jobs.html'),
        bills: resolve(__dirname, 'bills.html'),
        tools: resolve(__dirname, 'tools.html'),
        aiStudio: resolve(__dirname, 'ai-studio.html'),
        typingArcade: resolve(__dirname, 'typing-arcade.html')
      }
    }
  }
});
