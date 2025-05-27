
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
  outputDir: 'dist',
  configureWebpack: {
    devtool: 'source-map',
    output: {
      libraryExport: 'default',
    },
    plugins: [
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
  },
  css: {
    extract: false,
    loaderOptions: {
      scss: {
        additionalData: `@use "./src/assets/element-variables.scss" as *;`,
      },
    },
  },

  runtimeCompiler: true,
};