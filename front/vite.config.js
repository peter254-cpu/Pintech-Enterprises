import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "index.html",
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pintech-enterprises-98i5.onrender.com'
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
