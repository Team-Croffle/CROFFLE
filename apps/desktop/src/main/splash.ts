import { join } from 'node:path';

import { BrowserWindow } from 'electron';

import splashHtml from '../../resources/splash/index.html?asset';
import { logger } from './logger';

let splash: BrowserWindow | null = null;

export function showSplash(): void {
  if (splash) {
    return;
  }

  splash = new BrowserWindow({
    width: 600,
    height: 360,
    frame: false,
    transparent: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    center: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  logger.debug('Splash', `Loading splash file from ${join(process.resourcesPath, 'splash.html')}`);
  splash.loadFile(splashHtml);

  splash.once('ready-to-show', () => {
    splash?.show();
  });
}

export function closeSplash(): void {
  if (!splash) {
    return;
  }

  splash.close();
  splash = null;
}
