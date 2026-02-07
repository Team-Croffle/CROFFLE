import { ipcMain } from 'electron';
import { HttpResponse } from '@croffledev/croffle-common';
import { httpService } from '../core/http/service/HttpService';

export const registerHttpIpcHandlers = (): void => {
  ipcMain.handle(
    'http:get',
    async (
      _,
      url: string,
      params?: Record<string, string>,
      headers?: Record<string, string>
    ): Promise<HttpResponse> => {
      if (!url || typeof url !== 'string') {
        throw new Error('[HTTP] Invalid URL.');
      }

      return httpService.get(url, params, headers);
    }
  );

  ipcMain.handle(
    'http:post',
    async (
      _,
      url: string,
      body?: unknown,
      headers?: Record<string, string>
    ): Promise<HttpResponse> => {
      if (!url || typeof url !== 'string') {
        throw new Error('[HTTP] Invalid URL.');
      }

      return httpService.post(url, body, headers);
    }
  );
};

export interface HttpAPI {
  get: (
    url: string,
    params?: Record<string, string>,
    headers?: Record<string, string>
  ) => Promise<HttpResponse>;
  post: (url: string, body?: unknown, headers?: Record<string, string>) => Promise<HttpResponse>;
}
