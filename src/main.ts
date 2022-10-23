import '@/styles/index.scss';

import { createApp } from 'vue';

import { maska } from 'maska';

import store from '@/core/store';
import router from '@/router';

import App from './App.vue';

import setupAxiosInterceptors from './interceptors';

createApp(App)
  .directive('mask', maska)
  .use(store)
  .use(router)
  .mount('#app');

setupAxiosInterceptors();
