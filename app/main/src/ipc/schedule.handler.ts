import { ipcMain } from 'electron';
import { scheduleService } from '../core/schedules/service/ScheduleService';
import { Schedule } from '../core/schedules/model/Schedule';

export const registerScheduleIpcHandlers = (): void => {
  ipcMain.handle(
    'schedule:get',
    async (_, period: { start: string; end: string }): Promise<Schedule[]> => {
      const schedules = await scheduleService.getSchedules(period);
      return schedules;
    }
  );

  ipcMain.handle(
    'schedule:create',
    async (_, data: Partial<Schedule>): Promise<Schedule> => {
      const newSchedule = await scheduleService.createSchedule(data);
      return newSchedule;
    }
  );

  ipcMain.handle(
    'schedule:update',
    async (_, id: string, data: Partial<Schedule>): Promise<Schedule> => {
      const updatedSchedule = await scheduleService.updateSchedule(id, data);
      return updatedSchedule;
    }
  );

  ipcMain.handle('schedule:delete',
    async (_, id: string): Promise<boolean> => {
    const result = await scheduleService.deleteSchedule(id);
    return result;
  });
};

export interface ScheduleApi {
  getSchedules(period: { start: string; end: string }): Promise<Schedule[]>;
  createSchedule(data: Partial<Schedule>): Promise<Schedule>;
  updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule>;
  deleteSchedule(id: string): Promise<boolean>;
}
