import { Notification, clipboard, nativeImage } from 'electron';

export type ClipboardResult = //클립보드 반환 타입 선언: 텍스트, 이미지, 공백, 에러(실패)
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
  // 2-1) 읽기
  public getClipboard(): ClipboardResult {
    try {
      const formats = clipboard.availableFormats();

      if (formats.includes('text/plain')) {
        const text = clipboard.readText();
        if (text.length > 0) {
          return { type: 'text', value: text };
        }
      }

      if (formats.some(f => f.startsWith('image/'))) {
        const image = clipboard.readImage();
        if (!image.isEmpty()) {
          return {
            type: 'image',
            value: image.toPNG(), // Buffer (IPC-safe)
          };
        }
      }

      return { type: 'empty' };
    } catch (error) {
      console.error('OS/ 클립보드 읽기 실패:', error);
      return { type: 'error' };
    }
  }

  // 2-2) 쓰기
  public setClipboard(
    data:
      | { type: 'text'; value: string }
      | { type: 'image'; value: Buffer }
  ): void {
    try {
      if (data.type === 'text') {
        clipboard.writeText(data.value);
        return;
      }

      if (data.type === 'image') {
        const image = nativeImage.createFromBuffer(data.value);
        clipboard.writeImage(image);
      }
    } catch (error) {
      console.error('OS/ 클립보드 쓰기 실패:', error);
    }
  }
}

export const osService = new OsService();