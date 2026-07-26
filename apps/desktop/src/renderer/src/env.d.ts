/// <reference types="vite/client" />

import type { base, app, enums, ui } from '@croffledev/croffle-types';

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

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
