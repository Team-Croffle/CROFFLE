import { ipcMain } from 'electron';
import { settingService } from '../modules/settings/service/SettingService';
import { AppSettings } from '@croffledev/croffle-types';
import { eventService } from '../core/event-bus/EventService';
import { AppEventType } from '../../shared/enums';

export const registerSettingsIpcHandlers = (): void => {
  ipcMain.handle('settings:getAll', async (): Promise<AppSettings> => {
    const result = settingService.get();
    // Add app event emit
    eventService.emit(AppEventType.SETTINGS_GET, result);

    return result;
  });

  ipcMain.handle(
    'settings:getOf',
    async (_, key: unknown): Promise<AppSettings[keyof AppSettings]> => {
      if (typeof key !== 'string') {
        throw new Error('[Settings] Key must be a string.');
      }

      const result = settingService.getOf(key);

      // Add app event emit
      eventService.emit(AppEventType.SETTINGS_GET_OF, key, result);

      return result;
    }
  );

  ipcMain.handle(
    'settings:update',
    async (_, partialSettings: Partial<AppSettings>): Promise<AppSettings> => {
      const newSettings = settingService.update(partialSettings);

      // Add app event emit
      eventService.emit(AppEventType.SETTINGS_UPDATE, newSettings);

      return newSettings;
    }
  );
};
