<script setup lang="ts">
  import Calendar from '@/components/Calendar.vue';
  import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
  import { Toaster } from '@/components/ui/sonner';
  import { Minus, PanelLeft, Square, X } from 'lucide-vue-next';
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
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useViewStore } from './stores/viewStore';
  import PluginViewContainer from './components/PluginViewContainer.vue';
  // import { mockPluginsList } from './test/testPluginMenu';

  const uiStore = useUiStore();
  const contextMenuStore = useContextMenuStore();
  const viewStore = useViewStore();

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

  const currentPluginRenderFn = computed(() => {
    return viewStore.views.get(viewStore.activeViewId);
  });

  const handleRegisterView = (event: Event) => {
    const customEvent = event as CustomEvent<{
      pluginId: string;
      viewId: string;
      renderFn: (container: HTMLElement) => void;
    }>;
    const { viewId, renderFn } = customEvent.detail;

    viewStore.registerView(viewId, renderFn);
  };

  onMounted(async () => {
    // 이벤트로 플러그인 호출 동작 매핑
    window.addEventListener('plugin:register-view', handleRegisterView);

    // 일단 껍데기만 확인
    const pluginList = await croffle.base.pluginInfo.getEnabled();

    // test용
    // const pluginList = mockPluginsList;

    pluginList.forEach((p) => {
      const views = p.features.views;
      if (views) {
        views.forEach((v) => {
          // 메뉴만 register. 실제 view는 PluginLoader에서 등록됨.
          // 이후, 사용자가 해당 메뉴를 클릭하면, 등록된 렌더링 함수가 호출됨.
          viewStore.registerMenu(v);
        });
      }
    });
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
            class="no-drag h-7 w-7 text-gray-500"
            @click="uiStore.toggleLeftSidebar()"
          >
            <PanelLeft class="h-4 w-4" />
          </Button>

          <div class="absolute right-0 h-4 w-px bg-gray-300"></div>
        </div>

        <span class="font-logo ml-4 text-xs font-bold text-neutral-600">Croffle</span>
      </div>

      <div class="no-drag flex h-full">
        <button
          class="flex h-full w-12 items-center justify-center text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
          aria-label="Minimize window"
          @click="minimizeWindow"
        >
          <Minus class="h-4 w-4" />
        </button>

        <button
          class="flex h-full w-12 items-center justify-center text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
          aria-label="Maximize window"
          @click="maximizeWindow"
        >
          <Square class="h-3 w-3" />
        </button>

        <button
          class="flex h-full w-12 items-center justify-center text-gray-500 transition-colors hover:bg-red-600 hover:text-red-100"
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
              <!-- 캘린더 영역 -->
              <div class="flex-1 overflow-hidden p-4">
                <!-- <Calendar /> -->
                <Calendar v-if="viewStore.activeViewId === 'calendar'" />
                <PluginViewContainer
                  v-else-if="currentPluginRenderFn"
                  :view-id="viewStore.activeViewId"
                  :render-fn="currentPluginRenderFn"
                />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                v-for="item in contextMenuStore.items"
                :key="item.id"
                :disabled="item.disabled"
                @click="item.action"
              >
                {{ item.label }}
              </ContextMenuItem>
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
