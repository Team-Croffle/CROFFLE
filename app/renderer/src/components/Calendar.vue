<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import { useCalendarStore } from '@/stores/calendarStore';
  import { storeToRefs } from 'pinia';
  import { reactive } from 'vue';
  import type { CalendarOptions } from '@fullcalendar/core';
  import ContextMenu from './ui/context-menu/ContextMenu.vue';
  import ContextMenuTrigger from './ui/context-menu/ContextMenuTrigger.vue';
  import ContextMenuContent from './ui/context-menu/ContextMenuContent.vue';
  import ContextMenuSeparator from './ui/context-menu/ContextMenuSeparator.vue';
  import ContextMenuItem from './ui/context-menu/ContextMenuItem.vue';

  // pinia store 연결
  const store = useCalendarStore();
  const { events } = storeToRefs(store);

  // fullCalendar 옵션 설정
  const calendarOptions = reactive<CalendarOptions>({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    initialDate: new Date().toISOString().slice(0, 10),
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'prev,today,next',
    },

    // 제목 형식
    titleFormat: { year: 'numeric', month: 'long' },

    // 날짜 숫자 형식
    dayCellContent: (info) => {
      return info.date.getDate().toString();
    },

    events: events.value, // pinia store의 events 사용
    editable: true,
    selectable: true,
    height: 'auto',

    locale: 'ko', // 한국어 설정
  });
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="calendar-card">
        <FullCalendar :options="calendarOptions" />
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>일정 추가</ContextMenuItem>
      <ContextMenuItem>일정 삭제</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>

<style scoped>
  /* 캘린더 전체 틀 */
  .calendar-card {
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    min-height: 600px;
  }

  /* 헤더(제목+버튼) */
  :deep(.fc-header-toolbar) {
    margin-bottom: 30px !important;
    padding: 0 10px;
  }

  /* 제목 스타일 */
  :deep(.fc-toolbar-title) {
    font-size: 1.5rem;
    font-weight: 700;
    color: #dca780;
  }

  /* 버튼 그룹 */
  :deep(.fc-button-group) {
    display: flex !important;
    gap: 8px !important;
  }

  /* 개별 버튼 디자인 */
  :deep(.fc-button) {
    background-color: transparent;
    border: 1px solid #f0f0f0 !important;
    color: #666;
    font-weight: 500;
    border-radius: 8px !important;
    margin: 0 !important;
    box-shadow: none !important;
    padding: 6px 12px;
  }

  :deep(.fc-button:hover) {
    background-color: #fafafa;
    color: #333;
  }

  /* '오늘' 버튼 등 활성 상태 */
  :deep(.fc-button-primary:not(:disabled).fc-button-active),
  :deep(.fc-button-primary:not(:disabled):active) {
    background-color: #fff8f0 !important;
    color: #dca780 !important;
    border-color: #dca780 !important;
  }

  /* 요일 헤더*/
  :deep(.fc-col-header-cell) {
    background-color: #fffcf9;
    padding: 15px 0;
    border: none !important;
    /* 요일 아래쪽 구분선 */
    border-bottom: 1px solid #f5f5f5 !important;
  }

  /* 요일 텍스트 스타일 */
  :deep(.fc-col-header-cell-cushion) {
    color: #8d7b68; /* 따뜻한 갈색 텍스트 */
    font-weight: 600;
    text-decoration: none;
  }
  /* 공휴일 컬러 */
  :deep(.fc-day-sun .fc-col-header-cell-cushion) {
    color: #ff6b6b;
  }
  :deep(.fc-day-sat .fc-col-header-cell-cushion) {
    color: #4d96ff;
  }

  /* 날짜 칸 테두리 (가로선만 표시) */
  :deep(.fc-theme-standard td),
  :deep(.fc-theme-standard th),
  :deep(.fc-scrollgrid) {
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    border-bottom: 1px solid #f0ead6 !important;
  }

  /* 오늘 날짜 표시 (칸 전체 하이라이트) */
  :deep(.fc-day-today) {
    background-color: #fff5ea !important;
  }

  /* 오늘 날짜 숫자 스타일 */
  :deep(.fc-day-today .fc-daygrid-day-number) {
    background-color: transparent !important;
    color: #dca780; /* 진한 주황색 글씨 */
    font-weight: 800;
    border-radius: 0;
  }

  /* 일반 날짜 숫자 스타일 */
  :deep(.fc-daygrid-day-number) {
    font-size: 0.95rem;
    font-weight: 800;
    color: #777;
    text-decoration: none;
    padding: 8px;
    width: 100%;
    text-align: left;
  }

  /* 이벤트 스타일 */
  :deep(.fc-event) {
    border: none;
    border-radius: 4px;
    box-shadow: none;
    padding: 3px 5px;
    margin-top: 5px;
    background-color: #2dc12f;
    color: #374151;
  }
</style>
