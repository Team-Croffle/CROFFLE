import type { base, app, enums, ui } from 'croffle';

// 전역 타입 선언
declare global {
  const croffle: {
    readonly base: typeof base;
    readonly app: typeof app;
    readonly enums: typeof enums;
    readonly ui: typeof ui;
  };

  interface Window {
    readonly croffle: typeof croffle;
  }
}

export {};
