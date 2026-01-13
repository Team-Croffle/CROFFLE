import { ipcMain } from 'electron';
import { osService } from '../services/OSService'; // 위에서 만든 서비스 임포트

export const registerOsIpcHandlers = (): void => {
  // 1. 알림 보내기 (받기만 하고 끝남)
  ipcMain.handle('os:showNotification', async (_, title: string, body: string): Promise<void> => {
    await osService.showNotification(title, body);
  });

  // 2. 클립보드 가져오기 (결과를 돌려줌)
  ipcMain.handle('os:getClipboard', async (): Promise<string> => {
    const text = await osService.getClipboard();
    return text;
  });

  // 3. 클립보드 저장하기 (텍스트를 받아서 실행)
  ipcMain.handle('os:setClipboard', async (_, text: string): Promise<void> => {
    await osService.setClipboard(text);
  });
};

// 프론트엔드와 공유할 API 명세서 (타입 정의)
export interface OsApi {
  showNotification(title: string, body: string): Promise<void>;
  getClipboard(): Promise<string>;
  setClipboard(text: string): Promise<void>;
}