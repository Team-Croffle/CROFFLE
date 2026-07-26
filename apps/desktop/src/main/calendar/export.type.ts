import type { Schedule as ScheduleInterface } from '@croffledev/croffle-types';

export type ExportShapeV1 = {
  version: 1;
  exportedAt: string;
  schedules: ScheduleInterface[];
};
