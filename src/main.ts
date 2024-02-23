import '@/styles/index.scss';

import { createApp } from 'vue';

import store from '@/store';
import router from '@/router';

import App from './App.vue';

import ElementPlus from 'element-plus';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.locale('ru');
dayjs.updateLocale('ru', {
  weekStart: 1,
});

createApp(App)
  .mixin({
    created() {
      this.console = window.console;
    },
  })
  .use(ElementPlus)
  .use(store)
  .use(router)
  .mount('#app');
