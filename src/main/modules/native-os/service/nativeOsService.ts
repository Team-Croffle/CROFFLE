import { ClipboardResult } from '@croffledev/croffle-types';
import { ClipboardDataType } from '../../../../shared/enums';
import { Notification, app, clipboard, nativeImage } from 'electron';
import path from 'path';
import { logger } from '../../../core/logger/loggerService';

export class OsService {
  public showNotification(title?: string, body?: string): void {
    try {
      if (!Notification.isSupported()) {
        logger.warn('OS', 'Notification not supported');
        return;
      }

      const Title = title?.trim();
      const Body = body?.trim();

      if (!Title && !Body) {
        logger.warn('OS', 'Notification content is empty');
        return;
      }

      new Notification({
        icon: path.join(app.getAppPath(), '../../icons/Logo2OnlyNoBorderIcon.png'),
        title: Title || 'Notification',
        body: Body || '',
      }).show();
    } catch (error) {
      logger.error('OS', 'Notification error:', error);
      throw error;
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
      logger.error('OS', 'Read Clipboard error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { type: ClipboardDataType.ERROR, value: errorMessage };
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
      logger.error('OS', 'Write Clipboard error:', error);
      throw error;
    }
  }
}

export const osService = new OsService();
