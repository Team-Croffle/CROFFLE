import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const leftSidebarOpen = ref(true);
  const rightSidebarOpen = ref(false);
  const selectedDate = ref<string | null>(null);
  const isScheduleModalOpen = ref(false);
  const scheduleModalMode = ref<'add' | 'edit'>('add');
  const selectedScheduleId = ref<string | null>(null);

  // 사이드바 토글 액션
  const toggleLeftSidebar = () => {
    leftSidebarOpen.value = !leftSidebarOpen.value;
  };

  const toggleRightSidebar = () => {
    rightSidebarOpen.value = !rightSidebarOpen.value;
  };

  const openRightSidebarWithDate = (date: string) => {
    selectedDate.value = dayjs(date).format('YYYY-MM-DD');
    rightSidebarOpen.value = true;
  };

  const openScheduleModal = (mode: 'add' | 'edit' = 'add', scheduleId?: string) => {
    if (mode === 'edit' && !scheduleId) {
      return;
    }
    scheduleModalMode.value = mode;
    selectedScheduleId.value = scheduleId ?? null;
    isScheduleModalOpen.value = true;
  };

  const closeScheduleModal = () => {
    isScheduleModalOpen.value = false;
    scheduleModalMode.value = 'add';
    selectedScheduleId.value = null;
  };

  return {
    leftSidebarOpen,
    rightSidebarOpen,
    selectedDate,
    isScheduleModalOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    openRightSidebarWithDate,
    openScheduleModal,
    closeScheduleModal,
    scheduleModalMode,
    selectedScheduleId,
  };
});
