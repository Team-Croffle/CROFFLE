import type { Schedule } from '@croffledev/croffle-types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';

export const useScheduleStore = defineStore('schedule', () => {
  // 더미 데이터 사용
  const schedules = ref<Schedule[]>([]);

  // 데이터 변환(FullCalendar 이벤트 형식에 맞게)
  const events = computed(() => {
    return schedules.value.map((schedule) => {
      let displayEndDate = schedule.endDate;

      // 종일 일정의 경우, FullCalendar는 end 날짜를 포함하지 않으므로 하루 더해줌
      if (schedule.isAllDay && schedule.endDate) {
        displayEndDate = dayjs(schedule.endDate).add(1, 'day').format('YYYY-MM-DD');
      }

      return {
        id: schedule.id,
        title: schedule.title,
        start: schedule.startDate,
        end: displayEndDate,
        allDay: schedule.isAllDay,
        backgroundColor: schedule.colorLabel,
        borderColor: schedule.colorLabel,
        textColor: '#FFFFFF',
        display: schedule.isAllDay ? 'auto' : 'block',
        extendedProps: {
          description: schedule.description,
          location: schedule.location,
          tags: schedule.tags,
          recurrenceRule: schedule.recurrenceRule,
        },
      };
    });
  });

  // Actions
  // 일정 조회
  const getScheduleById = (id: string) => {
    return schedules.value.find((s) => s.id === id);
  };

  const upsertSchedule = (schedule: Schedule) => {
    const index = schedules.value.findIndex((s) => s.id === schedule.id);
    if (index === -1) {
      schedules.value.push(schedule);
      return;
    }
    schedules.value[index] = schedule;
  };

  // 일정 추가
  const createSchedule = async (payload: Partial<Schedule>) => {
    const created = await croffle.base.schedules.create(payload);
    upsertSchedule(created);
    return created;
  };

  // 일정 수정
  const updateScheduleById = async (id: string, payload: Partial<Schedule>) => {
    const updated = await croffle.base.schedules.update(id, payload);
    upsertSchedule(updated);
    return updated;
  };

  // 일정 제거
  const removeScheduleById = async (id: string) => {
    const ok = await croffle.base.schedules.remove(id);
    if (ok) {
      schedules.value = schedules.value.filter((s) => s.id !== id);
    }
    return ok;
  };

  // 일정 불러오기
  const loadSchedules = async (startDate?: string, endDate?: string) => {
    try {
      const now = dayjs();
      const start = startDate || now.subtract(1, 'month').startOf('month').toISOString();
      const end = endDate || now.add(1, 'month').endOf('month').toISOString();

      const result = await croffle.base.schedules.getAll({ start, end });
      schedules.value = result;
    } catch (error) {
      console.error('일정 불러오기 실패:', error);
    }
  };

  return {
    schedules,
    events,
    getScheduleById,
    createSchedule,
    updateScheduleById,
    removeScheduleById,
    loadSchedules,
  };
});
