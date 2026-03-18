import type { FeatureView } from '@croffledev/croffle-types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('plugin', () => {
  const menuRegistry = ref<FeatureView[]>([]);
  const views = ref<Map<string, (container: HTMLElement) => void>>(new Map());

  const registerMenu = (menu: FeatureView) => {
    if (menuRegistry.value.find((m) => m.id === menu.id)) {
      return;
    }
    menuRegistry.value.push(menu);
  };

  const registerMenus = (menus: FeatureView[]) => {
    menus.forEach((m) => {
      registerMenu(m);
    });
  };

  const registerView = (viewId: string, renderFn: (container: HTMLElement) => void) => {
    if (views.value.has(viewId)) {
      return;
    }
    views.value.set(viewId, renderFn);
  };

  return {
    menus: menuRegistry,
    views,
    registerMenu,
    registerMenus,
    registerView,
  };
});
