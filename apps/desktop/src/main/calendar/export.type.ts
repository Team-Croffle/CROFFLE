import type { Schedule as ScheduleInterface } from '@croffledev/common';

export type ExportShapeV1 = {
  version: 1;
  exportedAt: string;
  schedules: ScheduleInterface[];
};
