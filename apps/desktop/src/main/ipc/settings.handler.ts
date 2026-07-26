import { AppEventType } from '@croffledev/common';
import type { AppSettings } from '@croffledev/croffle-types';
import { ipcMain } from 'electron';

import { eventService } from '../event-bus/event-service';
import { settingService } from '../setting/setting-service';
import { validateSettings } from '../utils/settings-validator';

export const registerSettingsIpcHandlers = (): void => {
  ipcMain.handle('settings:getAll', async (): Promise<AppSettings> => {
    return settingService.get();
  });

  ipcMain.handle(
    'settings:getOf',
    async (_, key: unknown): Promise<AppSettings[keyof AppSettings]> => {
      if (typeof key !== 'string') {
        throw new Error('[Settings] Key must be a string.');
      }

      return settingService.getOf(key);
    },
  );

  ipcMain.handle(
    'settings:update',
    async (_, partialSettings: Partial<AppSettings>): Promise<AppSettings> => {
      validateSettings(partialSettings);
      const newSettings = settingService.update(partialSettings);
      eventService.emit(AppEventType.SETTINGS_UPDATE, newSettings);
      return newSettings;
    },
  );
};
