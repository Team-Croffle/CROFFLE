import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';

import Calendar from '@/components/calendar.vue';
import ExtensionRoute from '@/components/extension-route.vue';

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
    path: '/extension/:viewId',
    name: 'extension-view',
    component: ExtensionRoute,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
