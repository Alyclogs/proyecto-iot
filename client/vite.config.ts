import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://proyecto-iot-eta.vercel.app:3001',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
