<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { useUpdateStore } from '@/stores/update-store';

  const updateStore = useUpdateStore();
  const { isModalOpen, updateInfo, isDownloading, downloadProgress } = storeToRefs(updateStore);
  const { skipUpdate, downloadLater, downloadNow } = updateStore;
</script>

<template>
  <Dialog :open="isModalOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ '새 버전이 있습니다.' }}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {{ `v${updateInfo?.version} 버전으로 업데이트 할 수 있습니다.` }}
      </DialogDescription>

      <div
        v-if="updateInfo?.releaseNotes"
        class="text-muted-foreground max-h-32 overflow-y-auto rounded-md border p-3 text-sm"
        v-html="updateInfo.releaseNotes"
      />

      <div v-if="isDownloading">
        <p>{{ `다운로드 중... (${Math.round(downloadProgress)}%)` }}</p>
      </div>

      <DialogFooter class="gap-2">
        <Button variant="ghost" :disabled="isDownloading" @click="skipUpdate">{{
          '이번 버전은 건너뛰기'
        }}</Button>
        <Button variant="outline" :disabled="isDownloading" @click="downloadLater">{{
          '다음 시작 시 적용'
        }}</Button>
        <Button :disabled="isDownloading" @click="downloadNow">{{ '지금 업데이트' }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
