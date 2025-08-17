import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false, // Disable HMR completely
  },
  build: {
    rollupOptions: {
      external: ['wouter'], // Exclude wouter if it exists
    },
  },
});
