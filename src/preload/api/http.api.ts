import { ipcRenderer } from 'electron';
import { http } from 'croffle';

type HttpApi = typeof http;

export const httpApi = {
  get: (url, params, headers) => ipcRenderer.invoke('http:get', url, params, headers),
  post: (url, body, headers) => ipcRenderer.invoke('http:post', url, body, headers),
} satisfies HttpApi;
