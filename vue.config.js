// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/assets/element-variables.scss" as *;`,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'YourLibraryName',
      fileName: (format) => `your-library-name.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
        exports: 'default',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});