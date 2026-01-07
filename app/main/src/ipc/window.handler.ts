import { BrowserWindow, ipcMain } from 'electron';
import { windowService } from '../core/window/service/WindowService';

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

  ipcMain.handle('window:minimizeToTray', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) window.hide();
  });

  ipcMain.handle('window:exitApp', () => {
    windowService.exitApp();
  });

  ipcMain.handle('window:checkForUpdates', () => {
    windowService.checkForUpdates();
  });
}

export interface WindowAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  minimizeToTray: () => void;
  exitApp: () => void;
  checkForUpdates: () => void;
}
