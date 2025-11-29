import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCalendarStore = defineStore('calendar', () => {
  // 캘린더 일정 데이터
  const events = ref([
    { title: '프로젝트 시작', start: '2025-11-01', end: '2025-11-03' },
    { title: '중간 점검', date: '2025-11-15' },
    { title: '최종 발표', date: '2026-11-30' },
  ]);

  // 일정 추가 함수
  const addEvent = (title: string, date: string) => {
    events.value.push({ title, date });
  };

  return { events, addEvent };
});
