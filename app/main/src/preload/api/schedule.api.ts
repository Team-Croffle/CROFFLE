import { ipcRenderer } from 'electron';
import { Schedule } from '../../core/schedules/model/Schedule';
import { ScheduleApi } from '../../ipc/schedule.handler';

export const scheduleApi = {
    getSchedules: async (period: { start: string; end: string }): Promise<Schedule[]> => {
        return ipcRenderer.invoke('schedule:get', period);
    },

    createSchedule: async (data: Partial<Schedule>): Promise<Schedule> => {
        return ipcRenderer.invoke('schedule:create', data);
    },

    updateSchedule: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
        return ipcRenderer.invoke('schedule:update', id, data);
    },

    deleteSchedule: async (id: string): Promise<boolean> => {
        return ipcRenderer.invoke('schedule:delete', id);
    },
} satisfies ScheduleApi;