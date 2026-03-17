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
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from '@/components/ui/select';
  import { Switch } from '@/components/ui/switch';
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

  // 설정 로드 상태
  const isLoadingSettings = ref(true);
  const loadError = ref<string | null>(null);

  // reactive 객체를 깊은 복사하는 유틸 함수
  const cloneSettings = (value: AppSettings) => JSON.parse(JSON.stringify(value)) as AppSettings;

  // 설정 재 로드
  const reloadSettings = async () => {
    isLoadingSettings.value = true;
    loadError.value = null;
    try {
      const loaded = await croffle.base.settings.getAll();
      originalSettings.value = loaded;
      settings.value = cloneSettings(loaded);
    } catch (error) {
      console.error('설정 로드 실패:', error);
      loadError.value = '설정을 불러오지 못했습니다.';
    } finally {
      isLoadingSettings.value = false;
    }
  };

  // 최초 설정 로드
  onMounted(() => {
    void reloadSettings();
  });

  // 모달 열릴 때 임시 설정 초기화
  watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;
      if (originalSettings.value) {
        settings.value = cloneSettings(originalSettings.value);
      } else {
        void reloadSettings();
      }
    }
  );

  // 설정 저장
  const handleSave = async () => {
    if (settings.value) {
      try {
        const plainSettings = JSON.parse(JSON.stringify(settings.value));
        await croffle.base.settings.update(plainSettings);
        originalSettings.value = JSON.parse(JSON.stringify(settings.value)); // 원본 업데이트
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

  // 스위치 여부
  const onAutoUpdateChecked = (v: boolean) => {
    if (!settings.value) return;
    settings.value.general.autoUpdate = v;
  };
  const onStartOnSystemBootChecked = (v: boolean) => {
    if (!settings.value) return;
    settings.value.general.startOnSystemBoot = v;
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
          <h2 class="mb-4 px-2 text-lg font-bold text-neutral-900">설정</h2>
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              :class="[
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                activeTab === tab.id
                  ? 'bg-croffle-primary text-white'
                  : 'hover:bg-croffle-hover text-neutral-700',
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
          <div class="border-croffle-border border-b px-6 py-4">
            <h3 class="text-xl font-bold text-neutral-900">
              {{ tabs.find((t) => t.id === activeTab)?.label }}
            </h3>
            <p class="mt-1 text-sm text-neutral-600">설정을 관리하고 업데이트하세요.</p>
          </div>

          <!-- 콘텐츠 영역 -->
          <div class="flex-1 overflow-y-auto px-6 py-6">
            <!-- 로딩 상태 -->
            <div v-if="isLoadingSettings" class="max-w-2xl space-y-3">
              <p class="text-sm text-neutral-600">설정을 불러오는 중...</p>
            </div>

            <!-- 로드 실패 상태 -->
            <div v-else-if="loadError" class="max-w-2xl space-y-3">
              <p class="text-sm text-red-600">{{ loadError }}</p>
              <div class="flex gap-2">
                <Button type="button" variant="outline" @click="reloadSettings">다시 시도</Button>
                <Button type="button" @click="emit('update:open', false)">닫기</Button>
              </div>
            </div>

            <!-- 일반 탭 -->
            <div v-else-if="activeTab === 'general' && settings" class="max-w-2xl space-y-6">
              <p class="text-sm text-neutral-800">기본 설정 및 선호도를 조정하세요.</p>

              <!-- 언어 -->
              <div class="space-y-2">
                <Label for="settings-language" class="text-sm font-medium text-neutral-900"
                  >언어</Label
                >
                <Select v-model="settings.general.language">
                  <SelectTrigger id="settings-language" class="w-full bg-white text-neutral-900">
                    <SelectValue placeholder="언어 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in languageOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-neutral-500">애플리케이션이 언어로 설정됩니다.</p>
              </div>

              <!-- 테마 -->
              <div class="space-y-2">
                <Label for="settings-theme" class="text-sm font-medium text-neutral-900"
                  >테마</Label
                >
                <Select v-model="settings.general.theme">
                  <SelectTrigger id="settings-theme" class="w-full bg-white text-neutral-900">
                    <SelectValue placeholder="테마 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="option in themeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p class="text-xs text-neutral-500">애플리케이션 테마를 설정합니다.</p>
              </div>

              <!-- 자동 업데이트 -->
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label class="text-sm font-medium text-neutral-900">자동 업데이트</Label>
                  <p class="text-xs text-neutral-500">새로운 업데이트를 자동으로 설치합니다.</p>
                </div>
                <Switch
                  :checked="settings.general.autoUpdate"
                  aria-label="자동 업데이트"
                  @update:checked="onAutoUpdateChecked"
                />
              </div>

              <!-- 시스템 부팅 시 시작 -->
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <Label class="text-sm font-medium text-neutral-900">시스템 부팅 시 시작</Label>
                  <p class="text-xs text-neutral-500">컴퓨터 시작 시 자동으로 실행합니다.</p>
                </div>
                <Switch
                  :checked="settings.general.startOnSystemBoot"
                  aria-label="시스템 부팅 시 시작"
                  @update:checked="onStartOnSystemBootChecked"
                />
              </div>
            </div>

            <!-- 계정 탭 -->
            <div v-else-if="activeTab === 'account'" class="max-w-2xl space-y-6">
              <p class="text-sm text-neutral-600">계정 설정 및 프로필 관리</p>
            </div>

            <!-- 알림 탭 -->
            <div v-else-if="activeTab === 'notifications'" class="max-w-2xl space-y-6">
              <p class="text-sm text-neutral-600">알림 설정 및 환경 설정</p>
            </div>
          </div>

          <!-- 하단 버튼 -->
          <div class="border-croffle-border bg-croffle-sidebar border-t px-6 py-4">
            <div class="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                class="border-croffle-border hover:bg-croffle-hover bg-white text-neutral-800"
                @click="handleCancel"
              >
                취소
              </Button>
              <Button
                type="button"
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
