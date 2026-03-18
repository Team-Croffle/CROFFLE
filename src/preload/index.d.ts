import type { base, app, enums, ui } from '@croffledev/croffle-types';
import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  const croffle: {
    readonly base: typeof base;
    readonly app: typeof app;
    readonly enums: typeof enums;
    readonly ui: typeof ui;
  };

  interface Window {
    electron: ElectronAPI;
    readonly croffle: typeof croffle;
  }
}

export {};
