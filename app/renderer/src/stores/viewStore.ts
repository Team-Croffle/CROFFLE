import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ViewMenu {
  id: string;
  title: string;
  subtitle?: string;
  icon: unknown;
}

export const useViewStore = defineStore('plugin', () => {
  const menus = ref<ViewMenu[]>([]);
  const views = ref<Map<string, (container: HTMLElement) => void>>(new Map());

  const registerMenu = (menu: ViewMenu) => {
    if (menus.value.find((m) => m.id === menu.id)) {
      return;
    }
    menus.value.push(menu);
  };

  const registerView = (viewId: string, renderFn: (container: HTMLElement) => void) => {
    if (views.value.has(viewId)) {
      return;
    }
    views.value.set(viewId, renderFn);
  };

  return {
    menus,
    views,
    registerMenu,
    registerView,
  };
});
