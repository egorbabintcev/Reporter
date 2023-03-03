import '@/styles/index.scss';

import { createApp } from 'vue';

import { maska } from 'maska';
import Antd from 'ant-design-vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.locale('ru');
dayjs.updateLocale('ru', {
  weekStart: 1,
});

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
