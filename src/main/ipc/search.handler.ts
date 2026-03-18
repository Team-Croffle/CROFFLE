import { ipcMain } from 'electron';
import { searchService } from '../modules/search/service/searchService';
import { SearchQuery } from '@croffledev/croffle-types';

export function registerSearchIpcHandlers() {
  ipcMain.handle('search:search', async (_event, query: SearchQuery) => {
    return await searchService.searchSchedules(query);
  });
}
