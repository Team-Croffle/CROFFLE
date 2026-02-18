import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface PluginMenu {
  id: string;
  title: string;
  subtitle?: string;
  icon: unknown;
}

export interface PluginContextMenu {
  target: string;
  label: string;
  onClick: () => void;
}

export const usePluginStore = defineStore('plugin', () => {
  const menus = ref<PluginMenu[]>([]);
  const views = ref<Map<string, (container: HTMLElement) => void>>(new Map());
  const contextMenus = ref<PluginContextMenu[]>([]);
  const activeViewId = ref<string>('calendar');

  const registerMenu = (menu: PluginMenu) => {
    menus.value.push(menu);
  };

  const registerView = (viewId: string, renderFn: (container: HTMLElement) => void) => {
    views.value.set(viewId, renderFn);
  };

  const registerContextMenu = (contextMenu: PluginContextMenu) => {
    contextMenus.value.push(contextMenu);
  };

  const setActiveView = (viewId: string) => {
    activeViewId.value = viewId;
  };

  const getContextMenusForTarget = (target: string) => {
    return computed(() => contextMenus.value.filter((menu) => menu.target === target));
  };

  return {
    menus,
    views,
    contextMenus,
    activeViewId,
    registerMenu,
    registerView,
    registerContextMenu,
    setActiveView,
    getContextMenusForTarget,
  };
});
