import { ClipboardDataType, ClipboardResult } from 'croffle';
import { Notification, clipboard, nativeImage } from 'electron';

export class OsService {
  public showNotification(title?: string, body?: string): void {
    try {
      if (!Notification.isSupported()) {
        // 향후 협업 Point
        console.warn('OS/ Notification not supported X');
        return;
      }

      const Title = title?.trim();
      const Body = body?.trim();

      if (!Title && !Body) {
        // 향후 협업 Point
        console.warn('OS/ Notification content X');
        return;
      }

      new Notification({
        title: Title || 'Notification',
        body: Body || '',
      }).show();
    } catch (error) {
      // 향후 협업 Point
      console.error('OS/ Notification:', error);
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
          return { type: ClipboardDataType.TEXT, value: text };
        }
      }

      if (formats.some((f) => f.startsWith('image/'))) {
        const image = clipboard.readImage();
        if (!image.isEmpty()) {
          return {
            type: ClipboardDataType.IMAGE,
            value: image.toPNG(),
          };
        }
      }

      return { type: ClipboardDataType.EMPTY, value: null };
    } catch (error) {
      // 향후 협업 Point
      console.error('OS/ Read Clipboard :', error);
      return { type: ClipboardDataType.ERROR, value: null };
    }
  }

  // 2-2) 쓰기
  public setClipboard(
    data: { type: 'text'; value: string } | { type: 'image'; value: Buffer }
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
      // 향후 협업 Point
      console.error('OS/ Write Clipboard:', error);
    }
  }
}

export const osService = new OsService();
