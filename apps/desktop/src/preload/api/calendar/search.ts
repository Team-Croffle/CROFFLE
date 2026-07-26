import type { Schedule, SearchApi, SearchQuery } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const searchApi = {
  q: (query: SearchQuery): Promise<Schedule[]> => {
    return ipcRenderer.invoke('search:search', query);
  },
} satisfies SearchApi;
