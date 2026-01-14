import { Notification, clipboard } from 'electron';

export class OsService {
  // 1. 알림
  public async showNotification(title: string, body: string): Promise<void> {
    console.log('알림', {title, body})  // test line
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  }

  // 2. 클립보드
  // 2-1) 읽기
  public async getClipboard(): Promise<string> {
    const test  = clipboard.readText();
    console.log(' main 클립보드 읽기 완료', test) // test line
    return test;
    // return clipboard.readText(); // real line
  }

  // 2-2) 쓰기
  public async setClipboard(text: string): Promise<void> {
    clipboard.writeText(text);
  }
}

export const osService = new OsService();