import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],  // Remove this if not using React
  server: {
    port: 3000  // Change this if needed
  }
});
