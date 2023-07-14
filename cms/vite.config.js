import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mix from 'vite-plugin-mix'

import "dotenv/config"

const {DEV_PORT} = process.env
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mix.default({
      handler: './src/api/index.js',
    }),
  ],
  server:{
    port:DEV_PORT
  },
  build:{
    sourcemap:true,
    outDir:'./dist',
  },
})
