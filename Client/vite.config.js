import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase the warning limit (KB) so Vite won't warn for ~600 KB chunks
    chunkSizeWarningLimit: 1000,

    // Optional: manual chunk splitting for big libraries
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'html2canvas', 'jspdf'], 
        },
      },
    },
  },
});
