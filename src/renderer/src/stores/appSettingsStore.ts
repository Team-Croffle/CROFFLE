import { type AppSettings } from '@croffledev/croffle-types';
import { AppSettingTheme } from '../../../shared/enums';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useThemeStore } from './themeStore';
import { AppEventType } from '../../../shared/enums';
import { UpdateInfo } from '@/types/setting';

export const useAppSettingsStore = defineStore('appSettings', () => {
  const settings = ref<AppSettings | null>(null);
  const isReady = ref(false);
  let unsubscribe: (() => void) | null = null;

  const applyToUi = (value: AppSettings) => {
    const themeStore = useThemeStore();
    themeStore.applyFromSettings(value.general.theme);
  };

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
    if (!settings.value) return;
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

export const useUpdateStore = defineStore('update', () => {
  const isModalOpen = ref<boolean>(false);
  const updateInfo = ref<UpdateInfo | null>(null);
  const isDownloading = ref<boolean>(false);
  const downloadProgress = ref<number>(0);
  let unsubscribers: (() => void)[] = [];

  function init() {
    unsubscribers = [
      croffle.app.event.on(AppEventType.UPDATE_AVAILABLE, (payload) => {
        updateInfo.value = payload as UpdateInfo;
        isModalOpen.value = true;
      }),
      croffle.app.event.on(AppEventType.UPDATE_DOWNLOAD_PROGRESS, (payload) => {
        isDownloading.value = true;
        const { percent } = payload as { percent: number; transferred: number };
        downloadProgress.value = percent;
      }),
      croffle.app.event.on(AppEventType.UPDATE_DOWNLOADED, () => {
        isDownloading.value = false;
        downloadProgress.value = 0;
      }),
      croffle.app.event.on(AppEventType.UPDATE_ERROR, () => {
        isDownloading.value = false;
        downloadProgress.value = 0;
        isModalOpen.value = false;
      }),
    ];
  }

  function dispose() {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
  }

  function downloadNow() {
    isDownloading.value = true;
    croffle.app.event.emit(AppEventType.UPDATE_DOWNLOAD_NOW, null);
  }

  function downloadLater() {
    croffle.app.event.emit(AppEventType.UPDATE_DOWNLOAD_LATER, null);
    isDownloading.value = false;
  }

  function skipUpdate() {
    croffle.app.event.emit(AppEventType.UPDATE_SKIP_THIS_VERSION, null);
    isDownloading.value = false;
    downloadProgress.value = 0;
    isModalOpen.value = false;
  }

  return {
    isModalOpen,
    updateInfo,
    isDownloading,
    downloadProgress,
    init,
    dispose,
    downloadNow,
    downloadLater,
    skipUpdate,
  };
});
