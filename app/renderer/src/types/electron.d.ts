import type { ElectronAPI } from '@croffledev/croffle/src/preload';

// 전역 타입 선언
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
