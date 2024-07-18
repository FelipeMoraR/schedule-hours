import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Defines the output directory to run the frontend
  },
  server: {
    host: true, // lisent all interfaces

  },
})
