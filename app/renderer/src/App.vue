<script setup lang="ts">
  import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
  import { Toaster } from '@/components/ui/sonner';
  import { Minus, Moon, PanelLeft, Square, Sun, X } from 'lucide-vue-next';
  import LeftSidebar from './components/LeftSidebar.vue';
  import RightSidebar from './components/RightSidebar.vue';
  import Button from './components/ui/button/Button.vue';
  import { useUiStore } from './stores/uiStore';
  import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
  } from '@/components/ui/context-menu';
  import { useContextMenuStore } from './stores/contextMenuStore';
  import { onMounted, onUnmounted } from 'vue';
  import { useViewStore } from './stores/viewStore';
  import { defaultMenus } from './data/defaultContextMenus';
  import { Separator } from './components/ui/separator';
  import { useThemeStore } from './stores/themeStore';
  // import { mockPluginsList } from './test/testPluginMenu';

  const uiStore = useUiStore();
  const contextMenuStore = useContextMenuStore();
  const viewStore = useViewStore();
  const themeStore = useThemeStore();

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

  const registerDefaultContextMenu = () => {
    contextMenuStore.registerMenus(defaultMenus);
  };

  const setPluginMenus = async () => {
    // 이벤트로 플러그인 호출 동작 매핑
    window.addEventListener('plugin:register-view', handleRegisterView);

    // 일단 껍데기만 확인
    const pluginList = await croffle.base.pluginInfo.getEnabled();
    // test용
    // const pluginList = mockPluginsList;

    pluginList.forEach((p) => {
      const views = p.features.views;
      if (views) {
        viewStore.registerMenus(views);
      }

      const contextMenus = p.features.contextMenus;
      if (contextMenus) {
        contextMenuStore.registerMenus(contextMenus);
      }
    });
  };

  const handleContextMenuEvent = (e: MouseEvent) => {
    contextMenuStore.setActiveElement(e.target as HTMLElement);
  };

  onMounted(async () => {
    registerDefaultContextMenu();
    await setPluginMenus();
  });

  onUnmounted(() => {
    // 메모리 누수 방지용
    window.removeEventListener('plugin:register-view', handleRegisterView);
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
        <LeftSidebar />
        <SidebarInset class="bg-croffle-bg flex h-full flex-col">
          <ContextMenu>
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
                @click="item.action"
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
      </SidebarProvider>
    </div>
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
