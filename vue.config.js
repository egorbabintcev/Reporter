const { defineConfig } = require('@vue/cli-service');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const {
  proxy = 'http://localhost:8888',
} = process.env;

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      '^/api': {
        target: proxy,
        changeOrigin: true,
      },
    },
  },

  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['src/**/*.{vue,scss}'],
      }),
    ],
  },
});
