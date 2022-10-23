import { createRouter, createWebHistory } from 'vue-router';
import useAuthenticationStore from '@/core/store/authentication';

const ReportsScreen = () => import('@/screens/Reports/index.vue');
const AuthenticationScreen = () => import('@/screens/Authentication/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'reports',
      path: '/reports',
      component: ReportsScreen,
      meta: {
        authenticationRequired: true,
      },
    },
    {
      name: 'authentication',
      path: '/sign_in',
      component: AuthenticationScreen,
    },
    {
      path: '/:redirectAll(.*)',
      redirect: {
        name: 'reports',
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authenticationStore = useAuthenticationStore();

  if (to.meta.authenticationRequired && !authenticationStore.token) {
    next({
      name: 'authentication',
      query: { redirect: to.fullPath },
    });
  } else if (!to.meta.authenticationRequired && authenticationStore.token) {
    next({
      path: '/',
    });
  } else {
    next();
  }
});

export default router;
