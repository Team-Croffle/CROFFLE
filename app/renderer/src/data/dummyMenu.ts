import type { MenuItem } from '@/types/menuitem';
import {
  CalendarDays,
  ChartLine,
  Pencil,
  Users
} from 'lucide-vue-next';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { 
    id: 'calendar',
    title: '캘린더', 
    subtitle: 'Calendar', 
    icon: CalendarDays, 
    url: '#', 
    active: true 
  },
  { 
    id: 'dashboard',
    title: '대시보드', 
    subtitle: 'Dashboard', 
    icon: ChartLine, 
    url: '#', 
    active: false 
  },
  { 
    id: 'report',
    title: '리포트', 
    subtitle: 'Report', 
    icon: Pencil, 
    url: '#', 
    active: false 
  },
  { 
    id: 'team',
    title: '팀 관리', 
    subtitle: 'Team', 
    icon: Users, 
    url: '#', 
    active: false 
  },
];