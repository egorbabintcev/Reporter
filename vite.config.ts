import path from 'path';

import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import ssl from '@vitejs/plugin-basic-ssl';
import stylelint from 'vite-plugin-stylelint';
import eslint from 'vite-plugin-eslint';

import stylelintFormatterPretty from 'stylelint-formatter-pretty';
import eslintFormatterPretty from 'eslint-formatter-pretty';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vue(),
      ssl(),
      stylelint({
        formatter: stylelintFormatterPretty,
        fix: true,
        cache: false,
      }),
      eslint({
        formatter: eslintFormatterPretty,
        fix: true,
        cache: false,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 9000,
      host: '::',
      proxy: {
        '/api': {
          target: process.env.VITE_PROXY_TARGET_API || '/',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
