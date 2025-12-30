import { AppSettings, DEFAULT_SETTINGS } from '@croffledev/croffle-common';
import { app } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

class SettingService {
  private settings: AppSettings;
  private filePath: string;

  constructor() {
    this.filePath = path.join(app.getPath('userData'), 'settings.json');
    this.settings = this.loadSettings();
  }

  private loadSettings(): AppSettings {
    try {
      if (!existsSync(this.filePath)) {
        console.info('[Settings] Settings file does not exist. Creating default settings.');
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }

      const data = readFileSync(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);

      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (err) {
      console.error('[Settings] Failed to load settings, using default settings.', err);
      return DEFAULT_SETTINGS;
    }
  }

  private saveSettings(settings: AppSettings): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(settings, null, 2), 'utf-8');
      this.settings = settings;
      console.info('[Settings] Settings saved successfully.');
    } catch (err) {
      console.error('[Settings] Failed to save settings.', err);
    }
  }

  // --- API ---
  public get(): AppSettings {
    return this.settings;
  }

  public getOf(search: string): AppSettings[keyof AppSettings] {
    // validate key
    if (!(search in this.settings)) {
      throw new Error(`[Settings] Key "${search}" does not exist in settings.`);
    }

    const key: keyof AppSettings = search as keyof AppSettings;
    return this.settings[key];
  }

  public update(partialSettings: Partial<AppSettings>): AppSettings {
    const updatedSettings = {
      ...this.settings,
      ...partialSettings,
      general: {
        ...this.settings.general,
        ...partialSettings.general,
      },
      calendar: {
        ...this.settings.calendar,
        ...partialSettings.calendar,
      },
      notifications: {
        ...this.settings.notifications,
        ...partialSettings.notifications,
      },
    };

    this.saveSettings(updatedSettings);
    return updatedSettings;
  }
}

export const settingService = new SettingService();
