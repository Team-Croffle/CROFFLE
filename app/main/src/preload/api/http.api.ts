import { ipcRenderer } from 'electron';
import { HttpAPI } from '../../ipc/http.handler';

export const httpApi: { httpApi: HttpAPI } = {
  httpApi: {
    get: (url, params, headers) => ipcRenderer.invoke('http:get', url, params, headers),
    post: (url, body, headers) => ipcRenderer.invoke('http:post', url, body, headers),
  },
};