import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Static hosts serve the app from a sub-path (e.g. GitHub Pages mounts a
  // project site at /<repo>/). BASE_PATH is set by the Pages deploy workflow;
  // locally it stays '/' so dev URLs are clean.
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true
  }
})
