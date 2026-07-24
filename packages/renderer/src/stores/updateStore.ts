import { defineStore } from 'pinia';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { AppEventType } from '@croffledev/shared';
import type { UpdateInfo } from '@/types/update';

export const useUpdateStore = defineStore('update', () => {
  const isModalOpen = ref<boolean>(false);
  const updateInfo = ref<UpdateInfo | null>(null);
  const isDownloading = ref<boolean>(false);
  const downloadProgress = ref<number>(0);
  const updateError = ref<string | null>(null);
  let unsubscribers: (() => void)[] = [];

  function init() {
    unsubscribers = [
      croffle.app.event.on(AppEventType.UPDATE_AVAILABLE, (payload) => {
        updateInfo.value = payload as UpdateInfo;
        updateError.value = null;
        isModalOpen.value = true;
      }),
      croffle.app.event.on(AppEventType.UPDATE_NOT_AVAILABLE, () => {
        toast('이미 최신 버전입니다.');
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
      croffle.app.event.on(AppEventType.UPDATE_ERROR, (payload) => {
        const err = payload as Error;
        const message = err?.message ?? '업데이트 중 오류가 발생했습니다.';
        isDownloading.value = false;
        downloadProgress.value = 0;
        isModalOpen.value = false;
        updateError.value = message;
        toast.error('업데이트 실패', { description: message });
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
    croffle.app.event.emit(AppEventType.UPDATE_DOWNLOAD_NOW, null);
  }

  function downloadLater() {
    updateError.value = null;
    isModalOpen.value = false;
    isDownloading.value = true;
    downloadProgress.value = 0;
    croffle.app.event.emit(AppEventType.UPDATE_DOWNLOAD_LATER, null);
  }

  function skipUpdate() {
    croffle.app.event.emit(AppEventType.UPDATE_SKIP_THIS_VERSION, null);
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
