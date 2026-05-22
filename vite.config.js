import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
