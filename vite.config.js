import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
//import { pinia } from './src/stores/store'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://rubu2-test.rz.htw-dresden.de/api/v2/timetable/studygroups/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/course': {
        target: 'https://rubu2-test.rz.htw-dresden.de/api/v2/timetable/studycourses/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/course/, ''),
      },
      '/module': {
        target: 'https://rubu2-test.rz.htw-dresden.de/api/v2/timetable/activities/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/module/, ''),
      },  
    }
  }
})