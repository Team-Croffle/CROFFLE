import { ipcMain } from 'electron';
import { searchSchedules } from '../calendar/search';
import type { SearchQuery } from '@croffledev/croffle-types';

export function registerSearchIpcHandlers() {
  ipcMain.handle('search:search', async (_event, query: SearchQuery) => {
    return await searchSchedules(query);
  });
}
