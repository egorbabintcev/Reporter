import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/core/store/auth';
import useProfileStore from '@/core/store/profile';
import useProfileApi from '@/core/api/profile';

const ReportsScreen = () => import('@/screens/Reports/index.vue');
const ReportsEditor = () => import('@/screens/ReportsEditor/index.vue');
const AuthScreen = () => import('@/screens/Auth/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'reports',
      path: '/reports',
      component: ReportsScreen,
      meta: {
        authRequired: true,
      },
    },
    {
      name: 'reports-editor',
      path: '/reports/:id/edit',
      component: ReportsEditor,
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

router.beforeEach((to, from, next) => {
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

    const profileStore = useProfileStore();
    const profileApi = useProfileApi();

    profileApi.readProfile()
      .then((profile) => {
        profileStore.setProfile(profile);
      });
  }
});

export default router;
