import type { FeatureContextMenu } from '@croffledev/croffle-types';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';

export const useContextMenuStore = defineStore('contextMenu', () => {
  // 현재 열려 있는 컨텍스트 메뉴의 아이템 목록
  const menuRegistry = ref<FeatureContextMenu[]>([]);

  const route = useRoute();
  const activeElement = shallowRef<HTMLElement | null>(null);

  const currentItems = computed(() => {
    let currentTarget = 'calendar'; // default;

    if (route.path.startsWith('/plugin/') && route.params.viewId) {
      currentTarget = route.params.viewId as string;
    } else if (route.name) {
      currentTarget = route.name as string;
    }

    return menuRegistry.value.filter((item) => {
      if (!item.targetView || item.targetView.length === 0) {
        return true;
      }

      const viewMatch = item.targetView.includes(currentTarget);
      // targetViews가 없거나 global이 있으면 전역 메뉴로 취급
      if (!viewMatch) {
        return false;
      }

      if (item.condition) {
        return item.condition(activeElement.value);
      }

      return true;
    });
  });

  const registerMenu = (menu: FeatureContextMenu) => {
    const existingIndex = menuRegistry.value.findIndex((m) => m.id === menu.id);
    if (existingIndex !== -1) {
      menuRegistry.value[existingIndex] = menu;
    } else {
      menuRegistry.value.push(menu);
    }
  };

  const registerMenus = (menus: FeatureContextMenu[]) => {
    menus.forEach((m) => registerMenu(m));
  };

  const unregisterMenu = (menuId: string) => {
    menuRegistry.value = menuRegistry.value.filter((m) => m.id !== menuId);
  };

  const unregisterMenus = (...menuId: string[]) => {
    menuRegistry.value = menuRegistry.value.filter((m) => !menuId.includes(m.id));
  };

  const setActiveElement = (el: HTMLElement | null) => {
    activeElement.value = el;
  };

  return {
    menuRegistry,
    currentItems,
    activeElement,
    registerMenu,
    registerMenus,
    unregisterMenu,
    unregisterMenus,
    setActiveElement,
  };
});
