import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  server: {
    proxy: {
      // Forward all /api calls to your backend
      '/api': {
        target: 'http://localhost:8080', // Change to 8080 if using Spring Boot
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
