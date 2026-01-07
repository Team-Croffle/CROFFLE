import { ipcMain } from 'electron';
import { scheduleService } from '../core/schedules/service/ScheduleService';
import { Schedule } from '../core/schedules/model/Schedule';

export const registerScheduleIpcHandlers = (): void => {
  ipcMain.handle(
    'schedule:get',
    async (_, period: { start: string; end: string }): Promise<Schedule[]> => {
      return await scheduleService.getSchedules({
        start: new Date(period.start),
        end: new Date(period.end),
      });
    }
  );

  ipcMain.handle('schedule:create', async (_, data: Partial<Schedule>): Promise<Schedule> => {
    return await scheduleService.createSchedule(data);
  });

  ipcMain.handle(
    'schedule:update',
    async (_, id: string, data: Partial<Schedule>): Promise<Schedule> => {
      return await scheduleService.updateSchedule(id, data);
    }
  );

  ipcMain.handle('schedule:delete', async (_, id: string): Promise<boolean> => {
    return await scheduleService.deleteSchedule(id);
  });
};

export interface ScheduleApi {
  getSchedules(period: { start: string; end: string }): Promise<Schedule[]>;
  createSchedule(data: Partial<Schedule>): Promise<Schedule>;
  updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule>;
  deleteSchedule(id: string): Promise<boolean>;
}
