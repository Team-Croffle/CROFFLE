import type { FeatureView } from '@croffledev/common';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useViewStore = defineStore('extension', () => {
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

  const unregisterExtensionMenus = (extensionId: string) => {
    // 삭제 대상 메뉴의 id(extensionId)를 수집하여 views 맵에서도 제거
    const viewsToRemove = menuRegistry.value.filter((m) => m.extensionId === extensionId);
    viewsToRemove.forEach((m) => views.value.delete(m.id));

    menuRegistry.value = menuRegistry.value.filter((m) => m.extensionId !== extensionId);
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
    unregisterExtensionMenus,
  };
});
