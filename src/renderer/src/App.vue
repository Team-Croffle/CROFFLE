<script setup lang="ts">
  import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
  import { Toaster } from '@/components/ui/sonner';
  import { Minus, Moon, PanelLeft, Square, Sun, X } from 'lucide-vue-next';
  import LeftSidebar from './components/LeftSidebar.vue';
  import RightSidebar from './components/RightSidebar.vue';
  import SettingsModal from './components/SettingsModal.vue';
  import Button from './components/ui/button/Button.vue';
  import { useUiStore } from './stores/uiStore';
  import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
  } from '@/components/ui/context-menu';
  import { useContextMenuStore } from './stores/contextMenuStore';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useViewStore } from './stores/viewStore';
  import { useSettingsStore } from './stores/settingsStore';
  import { defaultMenus } from './data/defaultContextMenus';
  import { Separator } from './components/ui/separator';
  import { useThemeStore } from './stores/themeStore';
  import { useAppSettingsStore } from './stores/appSettingsStore';
  import router from './router';
  import Todosheet from './components/Todosheet.vue';
  import { pluginLoader } from './services/PluginLoader';
  // import { mockPluginsList } from './test/testPluginMenu';

  const uiStore = useUiStore();
  const contextMenuStore = useContextMenuStore();
  const viewStore = useViewStore();
  const settingsStore = useSettingsStore();
  const themeStore = useThemeStore();
  const appSettingsStore = useAppSettingsStore();

  // 설정 모달 상태
  const isSettingsOpen = ref(false);

  // Electron 윈도우 제어 함수
  const minimizeWindow = async () => {
    croffle.base.windows.minimize();
  };
  const maximizeWindow = async () => {
    croffle.base.windows.maximize();
  };
  const closeWindow = async () => {
    croffle.base.windows.close();
  };

  const handleRegisterView = (event: Event) => {
    const customEvent = event as CustomEvent<{
      pluginId: string;
      viewId: string;
      renderFn: (container: HTMLElement) => void;
    }>;
    const { viewId, renderFn } = customEvent.detail;

    viewStore.registerView(viewId, renderFn);
  };

  const handleRegisterSettingsTab = (event: Event) => {
    const customEvent = event as CustomEvent<{
      pluginId: string;
      pluginName: string;
      tabId: string;
      label: string;
      icon?: unknown;
      order?: number;
      render?: (container: HTMLElement) => void;
      sections?: import('@croffledev/croffle-types').SettingsSectionContribution[];
    }>;
    const { pluginId, pluginName, tabId, label, icon, order, render, sections } =
      customEvent.detail;

    if (render && sections) {
      console.warn(
        `[Plugin ${pluginName}] registerSettingsTab: render와 sections는 동시에 사용할 수 없습니다. render가 우선됩니다.`
      );
    }

    settingsStore.registerTab({
      id: tabId,
      label,
      icon,
      order,
      pluginId,
      pluginName,
      render,
      sections: render ? undefined : sections,
    });
  };

  const handlePluginUnloaded = (event: Event) => {
    const customEvent = event as CustomEvent<{ pluginId: string }>;
    const { pluginId } = customEvent.detail;
    settingsStore.unregisterPluginTabs(pluginId);
    // TODO: viewStore 및 contextMenuStore에서도 pluginId 기반으로 제거하도록 추가 필요
  };

  const handlePluginLoaded = (event: Event) => {
    const customEvent = event as CustomEvent<{ plugin: import('@croffledev/croffle-types').PluginInfo }>;
    const { plugin } = customEvent.detail;
    
    // 플러그인 로드 시 매니페스트 정보(views, contextMenus, settingsTabs) 동적 등록
    if (plugin.features.views) {
      viewStore.registerMenus(plugin.features.views);
    }
    if (plugin.features.contextMenus) {
      contextMenuStore.registerMenus(plugin.features.contextMenus);
    }
    settingsStore.registerManifestTabs(plugin.id, plugin.name, plugin.features.settingsTabs);
  };

  const registerDefaultContextMenu = () => {
    contextMenuStore.registerMenus(defaultMenus);
  };

  const setPluginMenus = async () => {
    // 이벤트로 플러그인 호출 동작 매핑
    window.addEventListener('plugin:register-view', handleRegisterView);
    window.addEventListener('plugin:register-settings-tab', handleRegisterSettingsTab);
    window.addEventListener('plugin:loaded', handlePluginLoaded);
    window.addEventListener('plugin:unloaded', handlePluginUnloaded);

    // 최초 로드 시 활성화된 플러그인들의 매니페스트는 pluginLoader.init()에서 plugin:loaded 이벤트를 쏴주므로
    // 여기서 직접 registerManifestTabs를 순회해서 호출할 필요가 없어짐.
    // pluginLoader.init() 내부에서 플러그인을 로딩할 때 plugin:loaded를 쏘면 자동으로 handlePluginLoaded가 처리함.
  };

  const handleContextMenuEvent = (e: MouseEvent) => {
    contextMenuStore.setActiveElement(e.target as HTMLElement);
  };

  const handleMenuOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      contextMenuStore.setActiveElement(null); // 우클릭 메뉴가 닫힐 때 activeElement 초기화
    }
  };

  let unsubscribeStartupNav: (() => void) | null = null;

  onMounted(async () => {
    registerDefaultContextMenu();
    await appSettingsStore.initialize();
    await setPluginMenus();
    await pluginLoader.init();
    unsubscribeStartupNav = croffle.app.event.on('settings:startup-navigate', (path) => {
      void router.push(typeof path === 'string' ? path : '/calendar');
    });
  });

  onUnmounted(() => {
    window.removeEventListener('plugin:register-view', handleRegisterView);
    window.removeEventListener('plugin:register-settings-tab', handleRegisterSettingsTab);
    window.removeEventListener('plugin:loaded', handlePluginLoaded);
    window.removeEventListener('plugin:unloaded', handlePluginUnloaded);
    unsubscribeStartupNav?.();
    appSettingsStore.dispose();
  });
</script>

<template>
  <div class="bg-croffle-bg flex h-screen flex-col overflow-hidden font-sans text-neutral-800">
    <!-- 커스텀 타이틀 바 -->
    <div
      class="drag-region border-croffle-border bg-croffle-bg z-50 flex h-8 shrink-0 justify-between border-b"
    >
      <div class="flex h-full items-center">
        <div class="relative flex h-full w-12 items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            class="no-drag h-7 w-7 text-neutral-500"
            @click="uiStore.toggleLeftSidebar()"
          >
            <PanelLeft class="h-4 w-4" />
          </Button>

          <div class="absolute right-0 h-4 w-px bg-neutral-300"></div>
        </div>

        <span class="font-logo ml-4 text-xs font-bold text-neutral-600">Croffle</span>
      </div>

      <div class="no-drag flex h-full items-center">
        <button
          class="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-500"
          aria-label="Minimize window"
          @click="themeStore.changeTheme"
        >
          <Sun v-if="themeStore.isDark" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>
        <Separator orientation="vertical" class="mr-6 ml-4 bg-neutral-300 dark:bg-neutral-700" />
        <button
          class="flex h-full w-12 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-500"
          aria-label="Minimize window"
          @click="minimizeWindow"
        >
          <Minus class="h-4 w-4" />
        </button>

        <button
          class="flex h-full w-12 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-500"
          aria-label="Maximize window"
          @click="maximizeWindow"
        >
          <Square class="h-3 w-3" />
        </button>

        <button
          class="flex h-full w-12 items-center justify-center text-neutral-500 transition-colors hover:bg-red-600 hover:text-red-100 dark:hover:bg-red-700"
          aria-label="Close window"
          @click="closeWindow"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 메인 콘텐츠 영역 -->
    <div class="relative min-h-0 flex-1">
      <!-- 사이드바 및 캘린더 -->
      <SidebarProvider class="h-full min-h-full w-full">
        <LeftSidebar @open-settings="isSettingsOpen = true" />
        <SidebarInset class="bg-croffle-bg flex h-full flex-col">
          <ContextMenu @update:open="handleMenuOpenChange">
            <ContextMenuTrigger as-child>
              <!-- 메인 영역 -->
              <div class="flex-1 overflow-hidden p-4" @contextmenu="handleContextMenuEvent">
                <router-view />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent v-if="contextMenuStore.currentItems.length > 0">
              <ContextMenuItem
                v-for="item in contextMenuStore.currentItems"
                :key="item.id"
                :disabled="item.disabled"
                @click="item.action(contextMenuStore.activeElement)"
              >
                {{ item.label }}
              </ContextMenuItem>
            </ContextMenuContent>
            <ContextMenuContent v-else>
              <ContextMenuItem disabled>등록된 동작이 없습니다.</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </SidebarInset>
        <RightSidebar />
        <Todosheet />
      </SidebarProvider>
    </div>

    <!-- 설정 모달 -->
    <SettingsModal :open="isSettingsOpen" @update:open="isSettingsOpen = $event" />

    <Toaster />
  </div>
</template>

<style scoped>
  /* 드래그 영역 설정 */
  .drag-region {
    -webkit-app-region: drag;
  }
  /* 드래그 영역 제외 */
  .no-drag {
    -webkit-app-region: no-drag;
  }
</style>
