import '@/styles/index.scss';

import { createApp } from 'vue';

import { maska } from 'maska';
import Antd from 'ant-design-vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import store from '@/core/store';
import router from '@/router';

import App from './App.vue';

import setupAxiosInterceptors from './interceptors';

createApp(App)
  .directive('mask', maska)
  .use(Antd)
  .use(store)
  .use(router)
  .mount('#app');

setupAxiosInterceptors();
