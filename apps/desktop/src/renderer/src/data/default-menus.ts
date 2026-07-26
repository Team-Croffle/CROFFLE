import type { FeatureView } from '@croffledev/croffle-types';
import { CalendarDays, ChartLine, Pencil, Users } from 'lucide-vue-next';

export const DEFAULT_MENU_ITEMS: FeatureView[] = [
  {
    id: 'calendar',
    title: '캘린더',
    subtitle: 'Calendar',
    icon: CalendarDays,
    url: '/calendar',
    active: true,
  },
  {
    id: 'dashboard',
    title: '대시보드',
    subtitle: 'Dashboard',
    icon: ChartLine,
    url: '/plugin/dashboard',
    active: false,
  },
  {
    id: 'report',
    title: '리포트',
    subtitle: 'Report',
    icon: Pencil,
    url: '/plugin/report',
    active: false,
  },
  {
    id: 'team',
    title: '팀 관리',
    subtitle: 'Team',
    icon: Users,
    url: '/plugin/team',
    active: false,
  },
];
