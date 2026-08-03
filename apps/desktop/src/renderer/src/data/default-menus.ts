import type { FeatureView } from '@croffledev/common';

export const DEFAULT_MENU_ITEMS: FeatureView[] = [
  {
    id: 'calendar',
    title: '캘린더',
    subtitle: 'Calendar',
    icon: 'lucide:calendar-days',
    url: '/calendar',
    active: true,
  },
];
