import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  test: {
    environment: 'jsdom',
    globals: true,
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
