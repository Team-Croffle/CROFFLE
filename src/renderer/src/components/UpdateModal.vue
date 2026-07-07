<script setup lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { useUpdateStore } from '@/stores/appSettingsStore';
  import { Button } from './ui/button';
  import { storeToRefs } from 'pinia';

  const updateStore = useUpdateStore();
  const { updateInfo, isDownloading, downloadProgress } = storeToRefs(updateStore);
  const { skipUpdate, downloadLater, downloadNow } = updateStore;
</script>

<template>
  <Dialog>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ '새 버전이 있습니다.' }}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {{ `v${updateInfo?.version} 버전으로 업데이트 할 수 있습니다.` }}
      </DialogDescription>
    </DialogContent>
    <div v-if="isDownloading">
      <p>{{ `다운로드 중... (${Math.round(downloadProgress)}%)` }}</p>
    </div>

    <DialogFooter class="gap-2">
      <Button variant="ghost" @click="skipUpdate">{{ '이번 버전은 건너뛰기' }}</Button>
      <Button variant="outline" @click="downloadLater">{{ '다음 시작 시 적용' }}</Button>
      <Button @click="downloadNow">{{ '지금 업데이트' }}</Button>
    </DialogFooter>
  </Dialog>
</template>
