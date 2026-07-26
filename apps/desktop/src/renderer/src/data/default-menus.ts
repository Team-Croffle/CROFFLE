import type { FeatureView } from '@croffledev/croffle-types';
import { CalendarDays } from 'lucide-vue-next';

export const DEFAULT_MENU_ITEMS: FeatureView[] = [
  {
    id: 'calendar',
    title: '캘린더',
    subtitle: 'Calendar',
    icon: CalendarDays,
    url: '/calendar',
    active: true,
  },
];
