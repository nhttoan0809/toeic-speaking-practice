import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: '/toeic-speaking-practice',
  plugins: [react(), tsconfigPaths()],
  build: {
    chunkSizeWarningLimit: 800, // kB
    rollupOptions: {
      input: {
        main: 'index.html',
        admin: 'admin.html',
        sw: 'speaking-writing.html',
        'speaking-club': 'speaking-club.html',
      },
    },
  },
});
