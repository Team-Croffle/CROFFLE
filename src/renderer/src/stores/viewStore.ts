import type { PLuginFeatureView } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('plugin', () => {
  const menuRegistry = ref<PLuginFeatureView[]>([]);
  const views = ref<Map<string, (container: HTMLElement) => void>>(new Map());

  const registerMenu = (menu: PLuginFeatureView) => {
    if (menuRegistry.value.find((m) => m.id === menu.id)) {
      return;
    }
    menuRegistry.value.push(menu);
  };

  const registerMenus = (menus: PLuginFeatureView[]) => {
    menus.forEach((m) => {
      registerMenu(m);
    });
  };

  const unregisterPluginMenus = (pluginId: string) => {
    // 삭제 대상 메뉴의 id(pluginId)를 수집하여 views 맵에서도 제거
    const viewsToRemove = menuRegistry.value.filter((m) => m.pluginId === pluginId);
    viewsToRemove.forEach((m) => views.value.delete(m.id));

    menuRegistry.value = menuRegistry.value.filter((m) => m.pluginId !== pluginId);
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
    unregisterPluginMenus,
  };
});
