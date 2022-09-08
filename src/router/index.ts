import { createRouter, createWebHistory } from 'vue-router';

const ReportsScreen = () => import('@/screens/Reports/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'reports',
      path: '/reports',
      component: ReportsScreen,
    },
    {
      path: '/(.*)',
      redirect: {
        name: 'reports',
      },
    },
  ],
});

export default router;
