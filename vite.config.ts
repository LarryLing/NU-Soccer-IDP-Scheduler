import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.VITE_SUPABASE_URL": JSON.stringify(
      process.env.VITE_SUPABASE_URL,
    ),
    "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY,
    ),
  },
})
