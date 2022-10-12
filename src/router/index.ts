import { createRouter, createWebHistory } from 'vue-router';

const ReportsScreen = () => import('@/screens/Reports/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'reports',
      path: '/reports/:id?/:action?',
      component: ReportsScreen,
    },
    {
      path: '/:redirectAll(.*)',
      redirect: {
        name: 'reports',
      },
    },
  ],
});

export default router;
