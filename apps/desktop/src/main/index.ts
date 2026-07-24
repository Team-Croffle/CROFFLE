import 'reflect-metadata';
import { app, shell, BrowserWindow, protocol } from 'electron';
import { AppSettingStartupBehavior } from '@croffledev/shared';
import { autoUpdater } from 'electron-updater';
import { databaseManager } from './core/database/DatabaseManager';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { join } from 'path';
import { registerAllIpcHandlers } from './ipc';
import { windowService } from './core/window/WindowService';
import { settingService } from './modules/settings/service/SettingService';
import {
  settingsApplyService,
  STARTUP_ARG,
  LOGIN_HIDDEN_ARG,
} from './modules/settings/service/SettingsApplyService';
import icon from '../../resources/Logo2Only.png?asset';
import { logger } from './core/logger/loggerService';

// Must be called before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'plugin',
    privileges: {
      standard: true,
      secure: true,
      corsEnabled: true,
      supportFetchAPI: true,
      allowServiceWorkers: false,
    },
  },
]);

const DEV_URL = 'http://localhost:5173';

function createWindow(): void {
  logger.info('Main', 'Creating main window');
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    frame: false,
    icon: icon,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  windowService.init(mainWindow);

  mainWindow.on('ready-to-show', () => {
    logger.info('Main', 'Main window is ready to show');
    const settings = settingService.get();
    settingsApplyService.applyStartupPresentation(settings);

    const loginSettings = app.getLoginItemSettings();
    const wasOpenedAtLogin = loginSettings.wasOpenedAtLogin || process.argv.includes(STARTUP_ARG);
    const shouldHideOnLogin =
      wasOpenedAtLogin &&
      (settings.general.startupBehavior === AppSettingStartupBehavior.DO_NOTHING ||
        settings.general.startMinimized ||
        process.argv.includes(LOGIN_HIDDEN_ARG));

    if (!shouldHideOnLogin) {
      logger.debug('Main', 'Showing main window');
      mainWindow.show();
    } else {
      logger.debug('Main', 'Main window is hidden on login');
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev) {
    logger.debug('Main', `Loading DEV_URL: ${DEV_URL}`);
    mainWindow.loadURL(DEV_URL);
    mainWindow.webContents.openDevTools();
  } else {
    logger.debug('Main', 'Loading local HTML file for production');
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logger.warn('Main', 'Another instance is already running. Quitting this instance.');
  app.quit();
} else {
  app.on('second-instance', () => {
    logger.info('Main', 'Second instance requested. Focusing existing window.');
    // Someone tried to run a second instance, we should focus our window.
    windowService.showWindow();
  });

  app.whenReady().then(async () => {
    logger.info('Main', 'Application is ready. Starting initialization...');
    // Set app user model id for windows
    electronApp.setAppUserModelId('kr.croffledev.croffle');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    try {
      await databaseManager.initialize();

      logger.info('Main', 'Registering IPC handlers');
      registerAllIpcHandlers();

      createWindow();

      if (!is.dev && settingsApplyService.shouldCheckForUpdates(settingService.get())) {
        logger.info('Main', 'Checking for application updates');
        autoUpdater.checkForUpdatesAndNotify();
      }
    } catch (error) {
      logger.error('Main', 'Failed to initialize the application', error);
      app.quit();
    }

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    logger.info('Main', 'All windows closed');
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
