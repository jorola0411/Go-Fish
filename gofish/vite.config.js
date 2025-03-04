import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.deckofcardsapi.com',
        changeOrigin: true,
        secure: false, // Try adding this if HTTPS is causing issues
        rewrite: (path) => {
          console.log('Rewriting:', path);
          return path.replace(/^\/api/, '');
        }
      }
    }
  }
  
})
