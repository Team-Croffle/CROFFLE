<script setup lang="ts">
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import { useCalendarStore } from '@/stores/calendarStore';
  import { storeToRefs } from 'pinia';
  import { reactive } from 'vue';
  import type { CalendarOptions } from '@fullcalendar/core';

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
  <div class="calendar-card">
    <FullCalendar :options="calendarOptions" />
  </div>
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
    font-size: 1.8rem;
    font-weight: 700;
    color: #4a4a4a;
  }

  :deep(.fc-button-group) {
    display: flex !important;
    gap: 8px !important;
  }

  :deep(.fc-button-group > .fc-button) {
    border-radius: 8px !important;

    margin: 0 !important;

    /* 테두리 및 배경 디자인 */
    border: 1px solid #e5e5e5 !important;
    background-color: white;
    color: #4a4a4a;
    box-shadow: none !important;

    height: 36px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.fc-button-group > .fc-button:hover) {
    background-color: #f9fafb;
    color: #111827;
  }

  /* [Today] 버튼 활성화 상태 (이번 달일 때) */
  :deep(.fc-button-group > .fc-button.fc-button-active),
  :deep(.fc-button-group > .fc-button:active) {
    background-color: #8b8b8b !important;
    border-color: #8b8b8b !important;
    color: white !important;
  }

  :deep(.fc-button:disabled) {
    opacity: 1 !important;
  }

  /* '오늘' 버튼 활성화 상태일 때 */
  :deep(.fc-button-primary:not(:disabled).fc-button-active),
  :deep(.fc-button-primary:not(:disabled):active) {
    background-color: #fff8f0 !important;
    color: #dca780 !important;
    border-color: #dca780 !important;
  }

  /* 요일 헤더 (일, 월, 화...) */
  :deep(.fc-col-header-cell) {
    background-color: #fafafa;
    padding: 15px 0;
    border: none !important;
  }

  /* 요일 글자 색상 */
  :deep(.fc-col-header-cell-cushion) {
    color: #999;
    font-weight: 500;
    text-decoration: none;
  }

  :deep(.fc-day-sun .fc-col-header-cell-cushion) {
    color: #ff6b6b;
  }
  :deep(.fc-day-sat .fc-col-header-cell-cushion) {
    color: #4d96ff;
  }

  /* 날짜 표(Grid)*/
  :deep(.fc-theme-standard td),
  :deep(.fc-theme-standard th),
  :deep(.fc-scrollgrid) {
    border: none !important;
  }

  /* 날짜 칸 하나하나의 스타일 */
  :deep(.fc-daygrid-day) {
    padding: 10px;
  }

  /* 날짜 숫자 (1, 2, 3...) */
  :deep(.fc-daygrid-day-top) {
    flex-direction: row;
    justify-content: center;
  }

  :deep(.fc-daygrid-day-number) {
    font-size: 1rem;
    color: #666;
    text-decoration: none;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
  }

  /* 오늘 날짜 표시 */
  :deep(.fc-day-today .fc-daygrid-day-number) {
    background-color: #dca780;
    color: white;
    font-weight: bold;
  }
  /* 오늘 날짜 칸 전체 배경색 */
  :deep(.fc-day-today) {
    background-color: transparent !important;
  }

  /* 이벤트 막대 (일정) 디자인 */
  :deep(.fc-event) {
    border: none;
    border-radius: 4px;
    box-shadow: none;
    padding: 3px 5px;
    margin-top: 5px;
  }
</style>
