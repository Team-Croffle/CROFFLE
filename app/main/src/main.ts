import 'reflect-metadata';
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { registerAllIpcHandlers } from './ipc';
import { databaseManager } from './services/DatabaseManager';

const DEV_URL = 'http://localhost:5173';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, './preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../renderer/dist/index.html'));
  }
}

app.whenReady().then(async () => {
  try {
    await databaseManager.initialize();
    registerAllIpcHandlers();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    app.quit();
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
