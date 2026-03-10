import type { FeatureContextMenu } from 'croffle';
import { useUiStore } from '../stores/uiStore';

export const defaultMenus: FeatureContextMenu[] = [
  {
    id: 'add-schedule',
    label: '일정 추가',
    action: (date: string) => {
      useUiStore().openRightSidebarWithDate(date); // 추후 일정 추가 폼으로 연결하도록 수정 예정
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
    action: (date: string) => {
      useUiStore().openRightSidebarWithDate(date);
    },
    condition: (target) => {
      if (!target) return false;
      return target.closest('[data-date]') !== null;
    },
    targetView: ['calendar'],
  },
];
