import type { CroffleAPI } from '@croffledev/croffle-types';
import type { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  /** contextBridge로 노출된 호스트 API (bare identifier) */
  const croffle: CroffleAPI;

  interface Window {
    electron: ElectronAPI;
    croffle: CroffleAPI;
  }
}

export {};
