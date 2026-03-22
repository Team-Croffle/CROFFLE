<script setup lang="ts">
  import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import type { CalendarOptions } from '@fullcalendar/core';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import { useScheduleStore } from '@/stores/scheduleStore';
  import { storeToRefs } from 'pinia';
  import { useCalendarLogic } from '@/composables/useCalendarLogic';
  import dayjs from 'dayjs';

  // pinia store 연결
  const scheduleStore = useScheduleStore();
  const { events } = storeToRefs(scheduleStore);

  // 캘린더 ref
  const fullCalendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
  const calendarContainerRef = ref<HTMLElement | null>(null);

  const {
    startResizeObserver,
    stopResizeObserver,
    handleDateDoubleClick,
    handleEventDoubleClick,
    getClickedDate,
  } = useCalendarLogic();

  // 캘린더 리사이징
  onMounted(() => {
    startResizeObserver(calendarContainerRef, fullCalendarRef);
  });

  onBeforeUnmount(() => {
    stopResizeObserver();
  });

  // 우클릭 핸들러
  const handleContextMenu = (e: MouseEvent) => {
    // 클릭된 날짜 가져오기
    const dateStr = getClickedDate(e);
    if (dateStr && fullCalendarRef.value) {
      // 우클릭한 날짜를 선택 상태로 변경
      const calendarApi = fullCalendarRef.value.getApi();
      calendarApi.select(dateStr);
    }
  };

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

    height: '100%',
    expandRows: true,
    fixedWeekCount: true,

    dayMaxEvents: true, // 하루에 표시할 수 있는 최대 이벤트 수

    // 이벤트 시간 숨기기
    displayEventTime: false,

    events: [],

    editable: false, // 이벤트 드래그 가능
    selectable: true, // 날짜 선택 가능
    dateClick: (info) => handleDateDoubleClick(info.dateStr), // 날짜 클릭 핸들러
    eventClick: (info) => {
      const eventId = info.event.id;
      if (!eventId) return;
      handleEventDoubleClick(eventId);
    },
    eventDidMount: (info) => {
      const eventId = info.event.id;
      if (eventId) {
        info.el.setAttribute('data-event-id', eventId);
        return;
      }
      info.el.removeAttribute('data-event-id');
    },

    datesSet: (info) => {
      // 월이 변경될 때마다 호출됨
      const start = dayjs(info.start).subtract(1, 'month').startOf('month').toISOString();
      const end = dayjs(info.end).add(1, 'month').endOf('month').toISOString();
      scheduleStore.loadSchedules(start, end);
    },

    windowResizeDelay: 0,
    handleWindowResize: false, // 수동으로 크기 조정 처리
    locale: 'ko', // 한국어 설정
  });

  // 스토어의 일정 데이터가 변경될 때마다 캘린더에 반영
  watch(
    () => events.value,
    (newEvents) => {
      calendarOptions.events = newEvents;
    },
    { immediate: true, deep: true } // 초기 로드 시에도 반영, 배열 내부 변경 감지
  );
</script>

<template>
  <div
    ref="calendarContainerRef"
    class="calendar-card flex h-full flex-col"
    @contextmenu="handleContextMenu"
  >
    <FullCalendar ref="fullCalendarRef" :options="calendarOptions" class="h-full w-full flex-1" />
  </div>
</template>

<style scoped>
  /* 캘린더 전체 틀 */
  .calendar-card {
    background-color: var(--card);
    padding: calc(var(--spacing) * 4);
    border: 1px solid var(--croffle-border);
    border-radius: var(--radius-3xl);
    box-shadow: 0 var(--spacing) calc(var(--spacing) * 5) rgba(0, 0, 0, 0.05);
  }

  /* FullCalendar 본체 */
  :deep(.fc) {
    height: 100%;
    width: 100%;
  }

  /* 헤더(제목+버튼) */
  :deep(.fc .fc-toolbar.fc-header-toolbar) {
    margin-bottom: calc(var(--spacing) * 2.5);
    padding: 0 calc(var(--spacing) * 2.5);
  }

  /* 제목 스타일 */
  :deep(.fc-toolbar-title) {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--croffle-primary);
  }

  /* 버튼 그룹 */
  :deep(.fc-button-group) {
    display: flex;
    gap: calc(var(--spacing) * 2);
  }

  /* 개별 버튼 디자인 */
  :deep(.fc-button) {
    background-color: transparent;
    border: 1px solid var(--croffle-border);
    color: var(--croffle-text);
    font-weight: 500;
    border-radius: var(--radius-lg) !important;
    margin: 0;
    box-shadow: none;
    padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 3);
    transition: all 0.2s ease;
  }

  :deep(.fc-button:first-child),
  :deep(.fc-button:last-child) {
    padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 1.5);
  }

  :deep(.fc-button:hover) {
    background-color: var(--croffle-bg);
    color: var(--croffle-primary);
    border-color: var(--croffle-primary);
  }

  :deep(.fc-button:disabled) {
    background-color: var(--croffle-disabled);
    border-color: var(--croffle-border);
    color: var(--croffle-muted);
    opacity: 1;
    cursor: not-allowed;
  }

  /* '오늘' 버튼 등 활성 상태 */
  :deep(.fc-button-primary:not(:disabled).fc-button-active),
  :deep(.fc-button-primary:not(:disabled):active) {
    background-color: var(--croffle-hover);
    color: var(--croffle-primary);
    border-color: var(--croffle-primary);
    box-shadow: inset 0 0 0 1px var(--croffle-primary) !important;
  }

  :deep(.fc-button-primary:focus) {
    box-shadow: none;
  }

  /* 요일 헤더*/
  :deep(.fc-col-header-cell) {
    background-color: var(--croffle-bg);
    padding: calc(var(--spacing) * 2) 0;
    border: none;
    /* 요일 아래쪽 구분선 */
    border-bottom: 1px solid var(--croffle-border);
  }

  /* 요일 텍스트 스타일 */
  :deep(.fc-col-header-cell-cushion) {
    color: var(--croffle-text);
    font-weight: 600;
    text-decoration: none;
  }
  /* 공휴일 컬러 */
  :deep(.fc-day-sun .fc-col-header-cell-cushion),
  :deep(.fc-day-sun .fc-daygrid-day-number) {
    color: var(--croffle-red);
  }
  :deep(.fc-day-sat .fc-col-header-cell-cushion),
  :deep(.fc-day-sat .fc-daygrid-day-number) {
    color: var(--croffle-blue);
  }

  /* 날짜 칸 테두리 (가로선만 표시) */
  :deep(.fc-theme-standard td),
  :deep(.fc-theme-standard th),
  :deep(.fc-scrollgrid) {
    border: none;
    border-bottom: 1px solid var(--croffle-border);
  }

  /* 오늘 날짜 표시 (칸 전체 하이라이트) */
  :deep(.fc .fc-daygrid-day.fc-day-today) {
    background-color: var(--croffle-today-bg);
    border-radius: var(--radius-2xl);
  }

  :deep(.fc-highlight) {
    background-color: var(--croffle-day-select-bg);
    border-radius: var(--radius-2xl);
  }

  /* 오늘 날짜 숫자 스타일 */
  :deep(.fc-day-today .fc-daygrid-day-number) {
    background-color: transparent !important;
    color: var(--croffle-primary);
    font-weight: bold;
    border-radius: 0;
  }

  /* 일반 날짜 숫자 스타일 */
  :deep(.fc-daygrid-day-number) {
    font-size: 0.8rem;
    font-weight: normal;
    color: var(--muted-foreground);
    text-decoration: none;
    padding: 8px;
    width: 100%;
    text-align: left;
  }

  /* 이벤트 스타일 */
  :deep(.fc-event) {
    border: none;
    border-radius: 10px;
    box-shadow: none;
    padding: 1px 4px;
    margin-top: 1px !important;
    margin-bottom: 1px !important;
    color: var(--foreground);
    display: flex;
    align-items: center;
    cursor: default;
    user-select: none;
  }

  :deep(.fc-event::after) {
    border-radius: 10px;
  }

  :deep(.fc-event-main) {
    overflow: hidden;
  }

  /* 이벤트 제목 (긴 제목 처리) */
  :deep(.fc-event-title) {
    display: block;
    white-space: nowrap;
    overflow: hidden; /* 넘치면 숨김 */
    text-overflow: ellipsis; /* ... 으로 표시 */
    font-weight: 500;
    line-height: 1.2;
  }

  /* 더보기 링크 (+2 more) 디자인 */
  :deep(.fc-more-link) {
    color: var(--croffle-muted);
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    display: block;
    margin-top: 2px;
    padding-left: 4px;
  }

  :deep(.fc-more-link:hover) {
    color: var(--croffle-primary);
  }
</style>
