import type { Schedule, SearchQuery } from '@croffledev/common';
import type { SearchApi } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

export const searchApi = {
  q: (query: SearchQuery): Promise<Schedule[]> => {
    return ipcRenderer.invoke('search:search', query);
  },
} satisfies SearchApi;
