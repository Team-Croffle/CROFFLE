import { ipcMain } from 'electron';

export function registerScheduleIpcHandlers() {
  ipcMain.handle('schedule:get', async (event, date: string) => {
    console.log(`Fetching schedule for date: ${date}`);
    return [{ id: 1, title: 'Sample Event', date }];
  });
}

export interface ScheduleAPI {
  get: (date: string) => Promise<{ id: number; title: string; date: string }[]>;
}
