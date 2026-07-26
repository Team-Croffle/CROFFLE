import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

import Calendar from '@/components/calendar.vue';
import PluginRoute from '@/components/plugin-route.vue';

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
