import { Notification, clipboard } from 'electron';

export class OsService {
  // 1. 알림
  public async showNotification(title: string, body: string): Promise<void> {
  try {
    if (!Notification.isSupported()) {
      console.warn('OS 알림이 지원 X');
      return; // 예외 내부 처리
    }

    new Notification({ title, body }).show();
  } 
  catch (error) {
    console.error('알림 실패 내용: ', error);
  }
}

  // 2. 클립보드
  // 2-1) 읽기
  public async getClipboard(): Promise<string> {
    return clipboard.readText();
  }

  // 2-2) 쓰기
  public async setClipboard(text: string): Promise<void> {
    clipboard.writeText(text);
  }
}

export const osService = new OsService();