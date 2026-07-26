import type { SearchQuery, Schedule, search } from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

type searchApi = typeof search;

export const searchApi = {
  q: (query: SearchQuery): Promise<Schedule[]> => {
    return ipcRenderer.invoke('search:search', query);
  },
} satisfies searchApi;
