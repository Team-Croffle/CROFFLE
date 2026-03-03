import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface PluginMenu {
  id: string;
  title: string;
  subtitle?: string;
  icon: unknown;
}

export const usePluginStore = defineStore('plugin', () => {
  const menus = ref<PluginMenu[]>([]);
  const views = ref<Map<string, (container: HTMLElement) => void>>(new Map());
  const activeViewId = ref<string>('calendar');

  const registerMenu = (menu: PluginMenu) => {
    menus.value.push(menu);
  };

  const registerView = (viewId: string, renderFn: (container: HTMLElement) => void) => {
    views.value.set(viewId, renderFn);
  };

  const setActiveView = (viewId: string) => {
    activeViewId.value = viewId;
  };

  return {
    menus,
    views,
    activeViewId,
    registerMenu,
    registerView,
    setActiveView,
  };
});
