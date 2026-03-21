import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const leftSidebarOpen = ref(true);
  const rightSidebarOpen = ref(false);
  const selectedDate = ref<string | null>(null);
  const isTodoSheetOpen = ref(false);
  const todoSheetMode = ref<'add' | 'edit'>('add');
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

  const openTodoSheet = (mode: 'add' | 'edit' = 'add', scheduleId?: string) => {
    todoSheetMode.value = mode;
    selectedScheduleId.value = scheduleId ?? null;
    isTodoSheetOpen.value = true;
  };

  const closeTodoSheet = () => {
    isTodoSheetOpen.value = false;
    todoSheetMode.value = 'add';
    selectedScheduleId.value = null;
  };

  return {
    leftSidebarOpen,
    rightSidebarOpen,
    selectedDate,
    isTodoSheetOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    openRightSidebarWithDate,
    openTodoSheet,
    closeTodoSheet,
    todoSheetMode,
    selectedScheduleId,
  };
});
