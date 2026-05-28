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

  const unregisterPluginMenus = (pluginId: string) => {
    // TODO:
    // FeatureView 인터페이스에 pluginId가 없을 수 있으므로 pluginName 기반이거나 다른 방식 필요
    // 일단 현재 구조에서는 id가 pluginId로 시작하는 컨벤션을 쓰거나, 아니면 pluginName과 매칭
    // 임시로 그냥 유지하거나, 플러그인에서 제공한 ID 목록을 알 수 없으니 필터링이 까다로움.
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
