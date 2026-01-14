import { ipcMain } from 'electron';
import { osService } from '../core/native-os/service/OSService';

export const registerOsIpcHandlers = (): void => {
  // 1. 알림 보내기 (받기만 하고 끝남)
  ipcMain.handle('os:showNotification', async (_, title: string, body: string): Promise<void> => {
    await osService.showNotification(title, body);
  });

  // 2. 클립보드 
  // 2-1) 읽기
  ipcMain.handle('os:getClipboard', async (): Promise<string> => {  
    const text = await osService.getClipboard();
    return text;
  });

  // 2-2) 클립보드 쓰기
  ipcMain.handle('os:setClipboard', async (_, text: string): Promise<void> => {
    await osService.setClipboard(text);
  });
};


export interface OsApi {
  showNotification(title: string, body: string): Promise<void>;
  getClipboard(): Promise<string>;
  setClipboard(text: string): Promise<void>;
}