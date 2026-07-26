import type { HttpResponse } from '@croffledev/croffle-types';
import { ipcMain } from 'electron';

import { httpService } from '../http';

export const registerHttpIpcHandlers = (): void => {
  ipcMain.handle(
    'http:get',
    async (
      _,
      url: string,
      params?: Record<string, string>,
      headers?: Record<string, string>,
    ): Promise<HttpResponse> => {
      if (!url || typeof url !== 'string') {
        throw new Error('[HTTP] Invalid URL.');
      }

      return await httpService.get(url, params, headers);
    },
  );

  ipcMain.handle(
    'http:post',
    async (
      _,
      url: string,
      body?: unknown,
      headers?: Record<string, string>,
    ): Promise<HttpResponse> => {
      if (!url || typeof url !== 'string') {
        throw new Error('[HTTP] Invalid URL.');
      }

      return await httpService.post(url, body, headers);
    },
  );
};
