import type {
  ClipboardImageData,
  ClipboardResult,
  ClipboardTextData,
  os,
} from '@croffledev/croffle-types';
import { ipcRenderer } from 'electron';

type OsApi = typeof os;

export const osApi = {
  showNotification: (title: string, body: string): Promise<void> =>
    ipcRenderer.invoke('os:showNotification', title, body),

  getClipboard: (): Promise<ClipboardResult> => ipcRenderer.invoke('os:getClipboard'),

  setClipboard: (data: ClipboardTextData | ClipboardImageData): Promise<void> =>
    ipcRenderer.invoke('os:setClipboard', data),
} satisfies OsApi;
