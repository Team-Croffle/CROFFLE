import { AppEventType } from '@croffledev/common';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

import { i18n } from '@/i18n';
import type { UpdateInfo } from '@/types/update';

function t(key: string) {
  return String(i18n.global.t(key));
}

export const useUpdateStore = defineStore('update', () => {
  const isModalOpen = ref<boolean>(false);
  const updateInfo = ref<UpdateInfo | null>(null);
  const isDownloading = ref<boolean>(false);
  const downloadProgress = ref<number>(0);
  const updateError = ref<string | null>(null);
  let unsubscribers: (() => void)[] = [];

  function init() {
    unsubscribers = [
      croffle.event.on(AppEventType.UPDATE_AVAILABLE, (payload) => {
        updateInfo.value = payload as UpdateInfo;
        updateError.value = null;
        isModalOpen.value = true;
      }),
      croffle.event.on(AppEventType.UPDATE_NOT_AVAILABLE, () => {
        toast(t('update.alreadyLatest'));
      }),
      croffle.event.on(AppEventType.UPDATE_DOWNLOAD_PROGRESS, (payload) => {
        isDownloading.value = true;
        const { percent } = payload as { percent: number; transferred: number };
        downloadProgress.value = percent;
      }),
      croffle.event.on(AppEventType.UPDATE_DOWNLOADED, () => {
        isDownloading.value = false;
        downloadProgress.value = 0;
      }),
      croffle.event.on(AppEventType.UPDATE_ERROR, (payload) => {
        const err = payload as Error;
        const message = err?.message ?? t('update.errorFallback');
        isDownloading.value = false;
        downloadProgress.value = 0;
        isModalOpen.value = false;
        updateError.value = message;
        toast.error(t('update.failed'), { description: message });
      }),
    ];
  }

  function dispose() {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    unsubscribers = [];
  }

  function downloadNow() {
    updateError.value = null;
    isDownloading.value = true;
    croffle.event.emit(AppEventType.UPDATE_DOWNLOAD_NOW, null);
  }

  function downloadLater() {
    updateError.value = null;
    isModalOpen.value = false;
    isDownloading.value = true;
    downloadProgress.value = 0;
    croffle.event.emit(AppEventType.UPDATE_DOWNLOAD_LATER, null);
  }

  function skipUpdate() {
    croffle.event.emit(AppEventType.UPDATE_SKIP_THIS_VERSION, null);
    isDownloading.value = false;
    downloadProgress.value = 0;
    updateError.value = null;
    isModalOpen.value = false;
  }

  return {
    isModalOpen,
    updateInfo,
    isDownloading,
    downloadProgress,
    updateError,
    init,
    dispose,
    downloadNow,
    downloadLater,
    skipUpdate,
  };
});
