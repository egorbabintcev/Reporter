const { defineConfig } = require('@vue/cli-service');

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
});
