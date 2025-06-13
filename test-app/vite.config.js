import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  optimizeDeps: {
    exclude: ['tsviewer'], // Skip pre-bundling
  },
  plugins: [
    vue(),
  ],
  resolve: {
    preserveSymlinks: true
  },
  server: {
    port: 3000,
    fs: {
      allow: [
        resolve(__dirname),
        resolve(__dirname, '../tsviewer') // absolute path is safer
      ]
    }
  },
  preview: {
    port: 3000,
  }
})
