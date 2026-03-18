import type { FeatureContextMenu } from '@croffledev/croffle-types';
import { useUiStore } from '../stores/uiStore';
import { useCalendarLogic } from '@/composables/useCalendarLogic';
import { useContextMenuStore } from '@/stores/contextMenuStore';

export const defaultMenus: FeatureContextMenu[] = [
  {
    id: 'add-schedule',
    label: '일정 추가',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }
      const date = useCalendarLogic().getClickedDateFromTarget(targetElement);
      useUiStore().openRightSidebarWithDate(date || ''); // 추후 일정 추가 폼으로 연결하도록 수정 예정
    },
    condition: (target) => {
      if (!target) return false;
      return target.closest('[data-date]') !== null;
    },
    targetView: ['calendar'],
  },
  {
    id: 'view-schedule',
    label: '해당 일자 보기',
    action: (targetElement: HTMLElement | null) => {
      if (!targetElement) {
        return;
      }
      const date = useCalendarLogic().getClickedDateFromTarget(targetElement);
      useUiStore().openRightSidebarWithDate(date || '');
    },
    condition: (target) => {
      if (!target) return false;
      return target.closest('[data-date]') !== null;
    },
    targetView: ['calendar'],
  },
  {
    id: 'delete-schedule',
    label: '일정 삭제 (준비중)',
    action: () => {
      // 추후 일정 삭제 기능 구현 시 연결
    },
    condition: () => {
      const activeElement = useContextMenuStore().activeElement;
      if (!activeElement) return false;
      return activeElement.closest('.fc-event') !== null;
    },
    targetView: ['calendar'],
    disabled: true, // 아직 기능이 없으니 비활성화 처리 예시
  },
];
