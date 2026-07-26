import type { AppSettings } from '@croffledev/croffle-types';
import { type AppSettingTheme, AppEventType } from '@croffledev/shared';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { useThemeStore } from './theme-store';

const applyToUi = (value: AppSettings) => {
  const themeStore = useThemeStore();
  themeStore.applyFromSettings(value.general.theme);
};

export const useAppSettingsStore = defineStore('appSettings', () => {
  const settings = ref<AppSettings | null>(null);
  const isReady = ref(false);
  let unsubscribe: (() => void) | null = null;

  const load = async () => {
    const loaded = await croffle.base.settings.getAll();
    settings.value = loaded;
    applyToUi(loaded);
    isReady.value = true;
  };

  const initialize = async () => {
    await load();
    unsubscribe?.();
    unsubscribe = croffle.app.event.on(AppEventType.SETTINGS_UPDATE, (payload) => {
      const updated = payload as AppSettings;
      settings.value = updated;
      applyToUi(updated);
    });
  };

  const dispose = () => {
    unsubscribe?.();
    unsubscribe = null;
  };

  const setThemeDraft = (theme: AppSettingTheme) => {
    if (!settings.value) {
      return;
    }
    settings.value.general.theme = theme;
    useThemeStore().applyFromSettings(theme);
  };

  return {
    settings,
    isReady,
    initialize,
    dispose,
    load,
    setThemeDraft,
  };
});
