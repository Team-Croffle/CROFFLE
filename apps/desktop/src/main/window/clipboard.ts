import type { ClipboardResult } from '@croffledev/croffle-types';
import { ClipboardDataType } from '@croffledev/shared';
import { clipboard, nativeImage } from 'electron';

import { logger } from '../logger';

export function getClipboard(): ClipboardResult {
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

export function setClipboard(
  data: { type: 'text'; value: string } | { type: 'image'; value: Buffer },
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
