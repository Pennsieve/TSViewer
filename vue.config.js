const AutoImport = require('unplugin-auto-import/webpack').default
const Components = require('unplugin-vue-components/webpack').default
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    output: {
      libraryExport: 'default'
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  css: {
    extract: false,
    loaderOptions: {
      scss: {
        additionalData: `@use "@/assets/element-variables.scss" as *;`,
      },
    },
  },
  runtimeCompiler: true,
}