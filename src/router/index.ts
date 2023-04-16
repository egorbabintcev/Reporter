import { createRouter, createWebHistory } from 'vue-router';
import useAuthStore from '@/core/store/auth';
import useProfileStore from '@/core/store/profile';
import useProfileApi from '@/core/api/profile';

const HomeScreen = () => import('@/screens/Home/index.vue');
const ReportsScreen = () => import('@/screens/Reports/index.vue');
const NonWorkingDaysScreen = () => import('@/screens/NonWorkingDays/index.vue');
const MenteesScreen = () => import('@/screens/Mentees/index.vue');
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
      name: 'mentees',
      path: '/mentees',
      component: MenteesScreen,
      meta: {
        authRequired: true,
      },
    },
    {
      name: 'non-working-days',
      path: '/non_working_days',
      component: NonWorkingDaysScreen,
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

    if (to.meta.authRequired) {
      const profileStore = useProfileStore();
      const profileApi = useProfileApi();

      if (profileStore.profile === null) {
        profileApi.readProfile()
          .then((profile) => {
            profileStore.setProfile(profile);
          });
      }
    }
  }
});

export default router;
