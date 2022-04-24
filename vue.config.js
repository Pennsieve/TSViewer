const { defineConfig } = require('@vue/cli-service')
module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  css: {
    extract: false,
  }
}