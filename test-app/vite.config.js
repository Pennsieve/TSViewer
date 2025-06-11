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
    fs: {
      allow: [
        resolve(__dirname),
        resolve(__dirname, '../tsviewer') // absolute path is safer
      ]
    }
  }
})
