import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// actually the tailwind version is v4 so no tailwind.config.js file is not required but if customization is 
// required in tailwind or daisyui then tailwind.config.js is needed
export default defineConfig({
  plugins: [ react(),tailwindcss()],
})
