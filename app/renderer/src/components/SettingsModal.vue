<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { Settings, User, Bell } from 'lucide-vue-next';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { Label } from '@/components/ui/label';
  import type { AppSettings } from 'croffle';

  interface Props {
    open: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
  }>();

  // State
  const activeTab = ref<'general' | 'account' | 'notifications'>('general');
  const originalSettings = ref<AppSettings | null>(null);
  const settings = ref<AppSettings | null>(null);

  // 설정 로드
  onMounted(async () => {
    originalSettings.value = await croffle.base.settings.getAll();
    settings.value = JSON.parse(JSON.stringify(originalSettings.value)); // 복사본 생성
  });

  // 모달이 열릴 때마다 초기화
  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen && originalSettings.value) {
        settings.value = JSON.parse(JSON.stringify(originalSettings.value)); // 복사본 재생성
      }
    }
  );

  // 설정 저장
  const handleSave = async () => {
    if (settings.value) {
      try {
        const plainSettings = JSON.parse(JSON.stringify(settings.value));
        await croffle.base.settings.update(plainSettings);
        originalSettings.value = settings.value; // 원본 업데이트
        emit('update:open', false);
      } catch (error) {
        console.error('설정 저장 실패:', error);
      }
    }
  };

  // 취소
  const handleCancel = () => {
    // 변경사항 무시하고 닫기
    if (originalSettings.value) {
      settings.value = JSON.parse(JSON.stringify(originalSettings.value));
    }
    emit('update:open', false);
  };

  // 탭 목록
  const tabs = [
    { id: 'general', label: '일반', icon: Settings },
    { id: 'account', label: '계정', icon: User },
    { id: 'notifications', label: '알림', icon: Bell },
  ] as const;

  // 언어 옵션
  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
  ];

  // 테마 옵션
  const themeOptions = [
    { value: 'light', label: '라이트' },
    { value: 'dark', label: '다크' },
    { value: 'system', label: '시스템' },
  ];
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="max-w-4xl gap-0 overflow-hidden p-0">
      <DialogHeader class="sr-only">
        <DialogTitle>설정</DialogTitle>
        <DialogDescription>설정을 관리하고 업데이트하세요.</DialogDescription>
      </DialogHeader>

      <div class="flex h-[600px]">
        <!-- 왼쪽 사이드바 -->
        <div class="bg-croffle-sidebar border-croffle-border w-48 border-r p-4">
          <h2 class="text-croffle-text-dark mb-4 px-2 text-lg font-bold">설정</h2>
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                activeTab === tab.id
                  ? 'bg-croffle-primary text-white'
                  : 'text-croffle-text hover:bg-croffle-hover',
              ]"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="h-4 w-4" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- 오른쪽 콘텐츠 -->
        <div class="flex flex-1 flex-col">
          <!-- 헤더 -->
          <div class="border-croffle-border flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 class="text-croffle-text-dark text-xl font-bold">
                {{ tabs.find((t) => t.id === activeTab)?.label }}
              </h3>
              <p class="text-croffle-text mt-1 text-sm">설정을 관리하고 업데이트하세요.</p>
            </div>
          </div>

          <!-- 콘텐츠 영역 -->
          <div class="flex-1 overflow-y-auto px-6 py-6">
            <!-- 일반 탭 -->
            <div v-if="activeTab === 'general' && settings" class="max-w-2xl space-y-6">
              <p class="text-croffle-text-dark text-sm">기본 설정 및 선호도를 조정하세요.</p>

              <!-- 언어 -->
              <div class="space-y-2">
                <Label class="text-croffle-text-dark text-sm font-medium">언어</Label>
                <select
                  v-model="settings.general.language"
                  class="border-croffle-border focus:ring-croffle-primary flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option
                    v-for="option in languageOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p class="text-croffle-text text-xs">애플리케이션이 언어로 설정됩니다.</p>
              </div>

              <!-- 테마 -->
              <div class="space-y-2">
                <Label class="text-croffle-text-dark text-sm font-medium">테마</Label>
                <select
                  v-model="settings.general.theme"
                  class="border-croffle-border focus:ring-croffle-primary flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option v-for="option in themeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <p class="text-croffle-text text-xs">애플리케이션 테마를 설정합니다.</p>
              </div>

              <!-- 자동 업데이트 -->
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label class="text-croffle-text-dark text-sm font-medium">자동 업데이트</Label>
                  <p class="text-croffle-text text-xs">새로운 업데이트를 자동으로 설치합니다.</p>
                </div>
                <button
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.general.autoUpdate ? 'bg-croffle-primary' : 'bg-gray-200',
                  ]"
                  @click="settings.general.autoUpdate = !settings.general.autoUpdate"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.general.autoUpdate ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>

              <!-- 시스템 부팅 시 시작 -->
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label class="text-croffle-text-dark text-sm font-medium"
                    >시스템 부팅 시 시작</Label
                  >
                  <p class="text-croffle-text text-xs">컴퓨터 시작 시 자동으로 실행합니다.</p>
                </div>
                <button
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settings.general.startOnSystemBoot ? 'bg-croffle-primary' : 'bg-gray-200',
                  ]"
                  @click="settings.general.startOnSystemBoot = !settings.general.startOnSystemBoot"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      settings.general.startOnSystemBoot ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  />
                </button>
              </div>
            </div>

            <!-- 계정 탭 -->
            <div v-if="activeTab === 'account'" class="max-w-2xl space-y-6">
              <p class="text-croffle-text text-sm">계정 설정 및 프로필 관리</p>
              <!-- 계정 설정 내용 추가 -->
            </div>

            <!-- 알림 탭 -->
            <div v-if="activeTab === 'notifications'" class="max-w-2xl space-y-6">
              <p class="text-croffle-text text-sm">알림 설정 및 환경 설정</p>
              <!-- 알림 설정 내용 추가 -->
            </div>
          </div>

          <!-- 하단 버튼 -->
          <div class="border-croffle-border bg-croffle-sidebar border-t px-6 py-4">
            <div class="flex justify-end gap-2">
              <Button
                variant="outline"
                class="border-croffle-border text-croffle-text-dark hover:bg-croffle-hover bg-white"
                @click="handleCancel"
              >
                취소
              </Button>
              <Button
                class="bg-croffle-primary hover:bg-croffle-hover text-white"
                @click="handleSave"
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
