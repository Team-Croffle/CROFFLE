import type { FeatureView } from '@croffledev/common';

export const DEFAULT_MENU_ITEMS: FeatureView[] = [
  {
    id: 'calendar',
    title: 'sidebar.calendar.title',
    subtitle: 'sidebar.calendar.subtitle',
    icon: 'lucide:calendar-days',
    url: '/calendar',
    active: true,
  },
];
