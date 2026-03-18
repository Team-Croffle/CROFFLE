import { ipcRenderer } from 'electron';
import type { SearchQuery, Schedule, search } from '@croffledev/croffle-types';

type searchApi = typeof search;

export const searchApi = {
  search: (query: SearchQuery): Promise<Schedule[]> => {
    return ipcRenderer.invoke('search:search', query);
  },
} satisfies searchApi;
