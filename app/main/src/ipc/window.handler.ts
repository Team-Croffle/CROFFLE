import { BrowserWindow, ipcMain } from 'electron';

export function registerWindowIpcHandlers() {
  ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.minimize();
  });

  ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.close();
  });
}

export interface WindowAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}
