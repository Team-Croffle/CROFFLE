<script setup lang="ts">
  import Calendar from '@/components/Calendar.vue';
  import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
  import { Toaster } from '@/components/ui/sonner';

  // Electron 윈도우 제어
  const minimizeWindow = async () => {
    await window.electronAPI?.minimize();
  };
  const maximizeWindow = async () => {
    await window.electronAPI?.maximize();
  };
  const closeWindow = async () => {
    await window.electronAPI?.close();
  };
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-[#FDFBF7] font-sans text-[#4A4A4A]">
    <!-- 커스텀 타이틀 바 -->
    <header
      class="drag-region z-50 flex h-12 shrink-0 items-center justify-between border-b border-[#F0EAD6] bg-[#FDFBF7] px-4"
    >
      <div class="flex items-center gap-2">
        <div class="h-3 w-3 rounded-full bg-[#DCA780]"></div>
        <span class="text-xs font-bold text-[#4A4A4A]">Croffle</span>
      </div>

      <div class="no-drag flex gap-1">
        <button @click="minimizeWindow" class="control-btn hover:bg-gray-100">−</button>
        <button @click="maximizeWindow" class="control-btn hover:bg-gray-100">□</button>
        <button @click="closeWindow" class="control-btn hover:bg-red-100 hover:text-red-500">
          x
        </button>
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <div class="relative min-h-0 flex-1">
      <!-- 사이드바 및 캘린더 -->
      <SidebarProvider class="h-full w-full" style="min-height: 100%">
        <SidebarInset class="flex h-full flex-col bg-[#FDFBF7]">
          <!-- 캘린더 영역 -->
          <div class="flex-1 overflow-y-auto p-4">
            <Calendar />
          </div>
        </SidebarInset>
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

  /* 윈도우 제어 버튼 스타일 */
  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    background: transparent;
    border: none;
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;
    transition: background-color 0.2s;
  }
</style>
