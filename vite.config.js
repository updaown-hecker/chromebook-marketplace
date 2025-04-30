import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: '0.0.0.0', // Listen on all available network interfaces
    open: true,
    allowedHosts: true // Allow any host to connect
  }
})