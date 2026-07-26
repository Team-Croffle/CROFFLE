import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

import Calendar from '@/components/Calendar.vue';
import PluginRoute from '@/components/PluginRoute.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/calendar',
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar,
  },
  {
    path: '/plugin/:viewId',
    name: 'plugin-view',
    component: PluginRoute,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
