import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/_core/store/auth';
import useProfileStore from '@/store/profile';

const HomeScreen = () => import('@/screens/Home/index.vue');
const ReportsScreen = () => import('@/screens/Reports/index.vue');
const AuthScreen = () => import('@/screens/Auth/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/home',
      component: HomeScreen,
      meta: {
        authRequired: true,
      },
    },
    {
      name: 'reports',
      path: '/reports',
      component: ReportsScreen,
      meta: {
        authRequired: true,
      },
    },
    {
      name: 'auth',
      path: '/auth',
      component: AuthScreen,
    },
    {
      path: '/:redirectAll(.*)',
      redirect: {
        name: 'reports',
      },
    },
  ],
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();

  if (to.meta.authRequired && !authStore.token) {
    next({
      name: 'auth',
      query: {
        action: 'sign_in',
        redirect: to.fullPath,
      },
    });
  } else {
    next();

    if (to.meta.authRequired) {
      const profileStore = useProfileStore();

      if (profileStore.profile === null) {
        profileStore.fetchProfile();
      }
    }
  }
});

export default router;
