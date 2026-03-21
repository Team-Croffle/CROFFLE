import type { FeatureContextMenu } from '@croffledev/croffle-types';
import { useUiStore } from '../stores/uiStore';
import { useCalendarLogic } from '@/composables/useCalendarLogic';
import { useScheduleStore } from '@/stores/scheduleStore';

export const defaultMenus: FeatureContextMenu[] = [
  {
    id: 'add-schedule',
    label: '일정 추가',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) return;
      useUiStore().openTodoSheet('add');
    },
    condition: (target) => !target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
  {
    id: 'view-schedule',
    label: '해당 일자 보기',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) return;
      const date = useCalendarLogic().getClickedDateFromTarget(targetElement);
      useUiStore().openRightSidebarWithDate(date || '');
    },
    condition: (target) => !target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
  {
    id: 'edit-schedule',
    label: '일정 수정',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) return;
      const eventId =
        targetElement?.closest('.fc-event')?.getAttribute('data-event-id') || undefined;
      useUiStore().openTodoSheet('edit', eventId);
    },
    condition: (target) => !!target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
  {
    id: 'delete-schedule',
    label: '일정 삭제',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) return;
      const eventId =
        targetElement?.closest('.fc-event')?.getAttribute('data-event-id') || undefined;
      if (!eventId) return;

      const ok = window.confirm('이 일정을 삭제하시겠습니까?');
      if (!ok) return;

      void useScheduleStore()
        .removeScheduleById(eventId)
        .catch((error) => {
          console.error('일정 삭제 실패:', error);
        });
    },
    condition: (target) => !!target?.closest('.fc-event'),
    targetView: ['calendar'],
  },
];
