import { AppEventType } from '@croffledev/common';
import type { Schedule } from '@croffledev/croffle-types';
import { ipcMain } from 'electron';

import { exportSchedulesToFile } from '../calendar/export-schedule';
import { importScheduleFromFile } from '../calendar/import-schedule';
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../calendar/schedule-service';
import { eventService } from '../event-bus/event-service';
import { scheduleMapper } from '../mapper/schedule-mapper';

export const registerScheduleIpcHandlers = (): void => {
  ipcMain.handle(
    'schedule:get',
    async (_, period: { start: string; end: string }): Promise<Schedule[]> => {
      const schedules = await getSchedules({
        start: new Date(period.start),
        end: new Date(period.end),
      });

      const dto = schedules.map(scheduleMapper.toInterface);
      // Add app event emit
      eventService.emit(AppEventType.SCHEDULE_GET, dto);

      return dto;
    },
  );

  ipcMain.handle('schedule:create', async (_, data: Partial<Schedule>): Promise<Schedule> => {
    const entityData = scheduleMapper.toEntity(data);
    const createdEntity = await createSchedule(entityData);

    const dto = scheduleMapper.toInterface(createdEntity);
    // Add app event emit
    eventService.emit(AppEventType.SCHEDULE_CREATE, dto);

    return dto;
  });

  ipcMain.handle(
    'schedule:update',
    async (_, id: string, data: Partial<Schedule>): Promise<Schedule> => {
      const entityData = scheduleMapper.toEntity(data);
      const updatedEntity = await updateSchedule(id, entityData);

      const dto = scheduleMapper.toInterface(updatedEntity);
      // Add app event emit
      eventService.emit(AppEventType.SCHEDULE_UPDATE, dto);

      return dto;
    },
  );

  ipcMain.handle('schedule:delete', async (_, id: string): Promise<boolean> => {
    // Add app event emit
    eventService.emit(AppEventType.SCHEDULE_DELETE, id);

    return await deleteSchedule(id);
  });

  ipcMain.handle(
    'schedule:exportSchedulesToFile',
    async (
      _,
      period?: { start: string; end: string },
    ): Promise<{ filePath: string; count: number } | null> => {
      const result = await exportSchedulesToFile(period);
      eventService.emit(AppEventType.SCHEDULE_EXPORT_TO_FILE, result);
      return result;
    },
  );

  ipcMain.handle(
    'schedule:importScheduleFromFile',
    async (
      _,
      mode?: 'merge' | 'duplicate',
    ): Promise<{ created: number; updated: number } | null> => {
      const result = await importScheduleFromFile(mode ?? 'merge');
      eventService.emit(AppEventType.SCHEDULE_IMPORT_FROM_FILE, result);
      return result;
    },
  );
};
