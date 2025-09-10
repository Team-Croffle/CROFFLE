// 전역 타입 선언
declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export {};
