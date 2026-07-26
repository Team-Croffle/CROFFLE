import type { FeatureContextMenu } from '@croffledev/croffle-types';
import { toast } from 'vue-sonner';

import { useScheduleStore } from '@/stores/scheduleStore';

import { useUiStore } from '../stores/uiStore';

const isDateElement = (target: HTMLElement | null) => {
  return !!target?.closest('[data-date], .fc-daygrid-day') && !target?.closest('.fc-event');
};

const getClickedDateFromTarget = (target: HTMLElement): string | null => {
  const dayCell = target.closest('.fc-daygrid-day');
  return dayCell ? dayCell.getAttribute('data-date') : null;
};

export const defaultMenus: FeatureContextMenu[] = [
  {
    id: 'add-schedule',
    label: '일정 추가',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }

      const uiStore = useUiStore();
      const date = getClickedDateFromTarget(targetElement);
      uiStore.selectedDate = date ?? null;
      uiStore.openTodoSheet('add');
    },
    condition: isDateElement,
    targetView: ['calendar'],
  },
  {
    id: 'view-schedule',
    label: '해당 일자 보기',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }
      const date = getClickedDateFromTarget(targetElement);
      if (!date) {
        return;
      }
      useUiStore().openRightSidebarWithDate(date);
    },
    condition: isDateElement,
    targetView: ['calendar'],
  },
  {
    id: 'edit-schedule',
    label: '일정 수정',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }
      const eventId = targetElement.closest('.fc-event')?.getAttribute('data-event-id');
      if (!eventId || eventId === 'undefined') {
        return;
      }
      useUiStore().openTodoSheet('edit', eventId);
    },
    condition: (target) => !!target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
  {
    id: 'delete-schedule',
    label: '일정 삭제',
    action: async (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }
      const eventId = targetElement?.closest('.fc-event')?.getAttribute('data-event-id');
      if (!eventId || eventId === 'undefined') {
        return;
      }

      const confirmed = window.confirm('이 일정을 삭제하시겠습니까?');
      if (!confirmed) {
        return;
      }

      try {
        const isSuccess = await useScheduleStore().removeScheduleById(eventId);
        if (!isSuccess) {
          toast.error('일정 삭제에 실패했습니다. 다시 시도해주세요.');
        } else {
          toast.success('일정이 삭제되었습니다.');
        }
      } catch {
        toast.error('일정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },
    condition: (target) => !!target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
];
