import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    target: 'es2020',
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
