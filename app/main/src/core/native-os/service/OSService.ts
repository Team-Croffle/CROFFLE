import { Notification, clipboard } from 'electron';

type ClipboardResult = //클립보드 반환 타입 선언: 텍스트, 이미지, 공백, 에러
  | { type: 'text'; value: string }
  | { type: 'image'; value: Buffer }
  | { type: 'empty' }
  | { type: 'error' };

export class OsService {
  
  // 1. 알림
  public async showNotification(title: string, body: string): Promise<void> {
  try {
    if (!Notification.isSupported()) {
      console.warn('OS/ Notification 지원 X');
      return; // 예외 내부 처리
    }

    new Notification({ title, body }).show();
  } 
  catch (error) {
    console.error('OS/ 알림 Content 실패: ', error);
  }
}

  // 2. 클립보드
  // 2-1) 읽기 (sync)
  public getClipboard(): string | null {
    try {
      return clipboard.readText();
    } catch (error) {
      console.error('OS/ 클립보드 읽기 실패: ', error);
      return null;
    }
  }

  // 2-2) 쓰기 (sync)
  public setClipboard(text: string): void {
    try {
      clipboard.writeText(text);
    } catch (error) {
      console.error('OS/ 클립보드 쓰기 실패: ', error);
    }
  }
}

export const osService = new OsService();