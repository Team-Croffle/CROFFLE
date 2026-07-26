import type { ClipboardImageData, ClipboardResult, ClipboardTextData } from '../models/clipboard';

export interface OsApi {
  showNotification(title: string, body: string): Promise<void>;
  getClipboard(): Promise<ClipboardResult>;
  setClipboard(data: ClipboardTextData | ClipboardImageData): Promise<void>;
}
