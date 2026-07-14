import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        // Separa vendors pesados do código do app: cache melhor no browser
        // e bundle inicial menor (jspdf/html2canvas já saem via import dinâmico).
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mapa: ['leaflet', 'react-leaflet'],
          animacao: ['framer-motion']
        }
      }
    }
  }
})
