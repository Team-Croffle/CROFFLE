<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { Settings, User, Bell, Pencil } from 'lucide-vue-next';
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
  import { Input } from '@/components/ui/input';
  import { Separator } from '@/components/ui/separator';
  import type { AppSettings } from '@croffledev/croffle-types';

  interface Props {
    open: boolean;
  }

  // 일반 탭 UI 전용 스키마
  interface GeneralDraft {
    timezone: string;
  }

  // 계정 탭 UI 전용 스키마
  interface AccountDraft {
    username: string;
    email: string;
  }

  // 알림 탭 UI 전용 스키마
  interface NotificationDraft {
    emailAlert: boolean;
    dndStart: string;
    dndEnd: string;
  }

  // UI draft 저장 스키마
  interface SettingsUiDraftStorage {
    general: GeneralDraft;
    account: AccountDraft;
    notifications: NotificationDraft;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
  }>();

  // 실제 저장 상태
  const activeTab = ref<'general' | 'account' | 'notifications'>('general');
  const originalSettings = ref<AppSettings | null>(null);
  const settings = ref<AppSettings | null>(null);

  // 로딩/오류 상태
  const isLoadingSettings = ref(true);
  const loadError = ref<string | null>(null);

  // 비밀번호 입력 상태
  const currentPassword = ref('');
  const newPassword = ref('');

  // UI draft 상태
  const generalDraft = ref<GeneralDraft>({ timezone: 'Asia/Seoul' });
  const accountDraft = ref<AccountDraft>({
    username: 'testuser',
    email: 'testuser@example.com',
  });
  const notificationDraft = ref<NotificationDraft>({
    emailAlert: true,
    dndStart: '22:00',
    dndEnd: '07:00',
  });

  // 취소 복원용 원본(UI draft)
  const originalGeneralDraft = ref<GeneralDraft>({ timezone: 'Asia/Seoul' });
  const originalAccountDraft = ref<AccountDraft>({
    username: 'testuser',
    email: 'testuser@example.com',
  });
  const originalNotificationDraft = ref<NotificationDraft>({
    emailAlert: true,
    dndStart: '22:00',
    dndEnd: '07:00',
  });

  const UI_DRAFT_STORAGE_KEY = 'croffle:settings-ui-draft';

  // 깊은 복사 유틸
  const cloneSettings = (value: AppSettings) => JSON.parse(JSON.stringify(value)) as AppSettings;
  const cloneGeneralDraft = (value: GeneralDraft) =>
    JSON.parse(JSON.stringify(value)) as GeneralDraft;
  const cloneAccountDraft = (value: AccountDraft) =>
    JSON.parse(JSON.stringify(value)) as AccountDraft;
  const cloneNotificationDraft = (value: NotificationDraft) =>
    JSON.parse(JSON.stringify(value)) as NotificationDraft;

  const loadUiDraftFromStorage = (): SettingsUiDraftStorage | null => {
    try {
      const raw = localStorage.getItem(UI_DRAFT_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SettingsUiDraftStorage;
    } catch (error) {
      console.error('UI draft 로드 실패:', error);
      return null;
    }
  };

  const saveUiDraftToStorage = () => {
    try {
      const payload: SettingsUiDraftStorage = {
        general: cloneGeneralDraft(generalDraft.value),
        account: cloneAccountDraft(accountDraft.value),
        notifications: cloneNotificationDraft(notificationDraft.value),
      };
      localStorage.setItem(UI_DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('UI draft 저장 실패:', error);
    }
  };

  // 저장본 우선 동기화
  const syncUiDraft = () => {
    const saved = loadUiDraftFromStorage();

    generalDraft.value = saved?.general
      ? cloneGeneralDraft(saved.general)
      : { timezone: 'Asia/Seoul' };

    accountDraft.value = saved?.account
      ? cloneAccountDraft(saved.account)
      : { username: 'testuser', email: 'testuser@example.com' };

    notificationDraft.value = saved?.notifications
      ? cloneNotificationDraft(saved.notifications)
      : {
          emailAlert: true,
          dndStart: '22:00',
          dndEnd: '07:00',
        };

    // 취소 복원용 원본 갱신
    originalGeneralDraft.value = cloneGeneralDraft(generalDraft.value);
    originalAccountDraft.value = cloneAccountDraft(accountDraft.value);
    originalNotificationDraft.value = cloneNotificationDraft(notificationDraft.value);
  };

  const reloadSettings = async () => {
    isLoadingSettings.value = true;
    loadError.value = null;
    try {
      const loaded = await croffle.base.settings.getAll();
      originalSettings.value = loaded;
      settings.value = cloneSettings(loaded);
      syncUiDraft();
    } catch (error) {
      console.error('설정 로드 실패:', error);
      loadError.value = '설정을 불러오지 못했습니다.';
    } finally {
      isLoadingSettings.value = false;
    }
  };

  onMounted(() => {
    void reloadSettings();
  });

  watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;
      if (originalSettings.value) {
        settings.value = cloneSettings(originalSettings.value);
        syncUiDraft();
      } else {
        void reloadSettings();
      }
      currentPassword.value = '';
      newPassword.value = '';
    }
  );

  const handleSave = async () => {
    if (!settings.value) return;
    try {
      await croffle.base.settings.update(cloneSettings(settings.value));

      // 저장 후 재조회(실제 반영값 동기화)
      const reloaded = await croffle.base.settings.getAll();
      originalSettings.value = reloaded;
      settings.value = cloneSettings(reloaded);

      saveUiDraftToStorage();

      originalGeneralDraft.value = cloneGeneralDraft(generalDraft.value);
      originalAccountDraft.value = cloneAccountDraft(accountDraft.value);
      originalNotificationDraft.value = cloneNotificationDraft(notificationDraft.value);

      emit('update:open', false);
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  };

  const handleCancel = () => {
    if (originalSettings.value) {
      settings.value = cloneSettings(originalSettings.value);
    }
    generalDraft.value = cloneGeneralDraft(originalGeneralDraft.value);
    accountDraft.value = cloneAccountDraft(originalAccountDraft.value);
    notificationDraft.value = cloneNotificationDraft(originalNotificationDraft.value);

    currentPassword.value = '';
    newPassword.value = '';
    emit('update:open', false);
  };

  // Switch 이벤트값 정규화(checked/modelValue 둘 다 대응)
  const asBool = (v: unknown): boolean => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v === 'true' || v === '1' || v === 'on';
    return !!v;
  };

  const onAutoSaveSwitch = (v: unknown) => {
    if (!settings.value) return;
    settings.value.general.autoUpdate = asBool(v);
  };

  const onEmailAlertSwitch = (v: unknown) => {
    notificationDraft.value.emailAlert = asBool(v);
  };

  const onAppAlertSwitch = (v: unknown) => {
    if (!settings.value) return;
    settings.value.notifications.enabled = asBool(v);
  };

  const tabs = [
    { id: 'general', label: '일반', icon: Settings },
    { id: 'account', label: '계정', icon: User },
    { id: 'notifications', label: '알림', icon: Bell },
  ] as const;

  const languageOptions = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
  ] as const;

  const timezoneOptions = [
    { value: 'Asia/Seoul', label: '서울 (GMT+9)' },
    { value: 'Asia/Tokyo', label: '도쿄 (GMT+9)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/Los_Angeles', label: '로스앤젤레스 (GMT-8)' },
  ] as const;

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = `${String(i).padStart(2, '0')}:00`;
    return { value: hour, label: hour };
  });
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <!-- 반응형 모달 크기 -->
    <DialogContent
      class="h-[90vh] max-h-[940px] w-[96vw]! max-w-none! gap-0 overflow-hidden border-none p-0 shadow-2xl sm:w-[94vw]! lg:w-[92vw]!"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>설정</DialogTitle>
        <DialogDescription>설정을 관리하고 업데이트하세요.</DialogDescription>
      </DialogHeader>

      <div class="bg-background text-foreground flex h-full">
        <!-- 좌측 탭 -->
        <div class="border-border bg-muted/20 w-60 shrink-0 border-r p-4">
          <h2 class="text-foreground mb-6 px-2 text-xl font-bold">설정</h2>
          <nav class="space-y-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              :class="[
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[#F2EBE3] text-[#8C6A4D]'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              ]"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="h-4 w-4" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- 우측 콘텐츠 -->
        <div class="flex min-w-0 flex-1 flex-col bg-white">
          <div class="px-6 py-6 md:px-8">
            <h3 class="text-2xl font-bold wrap-break-word text-neutral-900">
              {{ tabs.find((t) => t.id === activeTab)?.label }}
            </h3>
          </div>

          <div class="flex-1 overflow-y-auto px-6 pb-8 md:px-8">
            <div v-if="isLoadingSettings" class="w-full max-w-none space-y-3">
              <p class="text-muted-foreground text-sm">설정을 불러오는 중...</p>
            </div>

            <div v-else-if="loadError" class="w-full max-w-none space-y-3">
              <p class="text-destructive text-sm">{{ loadError }}</p>
              <div class="flex gap-2">
                <Button type="button" variant="outline" @click="reloadSettings">다시 시도</Button>
                <Button type="button" @click="emit('update:open', false)">닫기</Button>
              </div>
            </div>

            <div v-else-if="settings" class="w-full max-w-none space-y-8">
              <!-- 일반 -->
              <div v-if="activeTab === 'general'" class="space-y-6">
                <p class="text-muted-foreground text-sm">기본 설정을 조정하세요.</p>

                <div class="space-y-2">
                  <Label for="settings-language" class="text-foreground text-sm font-medium"
                    >언어</Label
                  >
                  <Select v-model="settings.general.language">
                    <SelectTrigger id="settings-language" class="w-full">
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
                  <p class="text-muted-foreground text-xs">애플리케이션이 언어를 설정합니다.</p>
                </div>

                <div class="space-y-2">
                  <Label for="settings-timezone" class="text-foreground text-sm font-medium"
                    >시간대</Label
                  >
                  <Select v-model="generalDraft.timezone">
                    <SelectTrigger id="settings-timezone" class="w-full">
                      <SelectValue placeholder="시간대 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="tz in timezoneOptions" :key="tz.value" :value="tz.value">
                        {{ tz.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-muted-foreground text-xs">올바른 시간대가 표시되도록 합니다.</p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-foreground text-sm font-medium">자동 저장</Label>
                    <p class="text-muted-foreground text-xs">변경 사항을 자동으로 저장합니다.</p>
                  </div>
                  <Switch
                    :checked="settings.general.autoUpdate"
                    :model-value="settings.general.autoUpdate"
                    aria-label="자동 저장"
                    @update:checked="onAutoSaveSwitch"
                    @update:model-value="onAutoSaveSwitch"
                  />
                </div>
              </div>

              <!-- 계정 -->
              <div v-if="activeTab === 'account'" class="space-y-6">
                <section class="space-y-4">
                  <p class="text-muted-foreground text-sm">계정 설정을 조정하세요.</p>
                  <h4 class="text-base font-bold text-neutral-900">사용자 정보</h4>

                  <div class="space-y-2">
                    <Label class="text-xs font-semibold text-neutral-500 uppercase"
                      >사용자 이름</Label
                    >
                    <Input v-model="accountDraft.username" class="h-10 border-neutral-200" />
                  </div>

                  <div class="space-y-2">
                    <Label class="text-xs font-semibold text-neutral-500 uppercase">이메일</Label>
                    <div class="relative">
                      <Input
                        v-model="accountDraft.email"
                        readonly
                        class="h-10 border-neutral-200 pr-10"
                      />
                      <Pencil
                        class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-neutral-400"
                      />
                    </div>
                  </div>
                </section>

                <Separator class="my-6" />

                <section class="space-y-4">
                  <h4 class="text-base font-bold text-neutral-900">비밀번호 변경</h4>

                  <div class="space-y-2">
                    <Label class="text-xs font-semibold text-neutral-500 uppercase"
                      >현재 비밀번호</Label
                    >
                    <Input
                      v-model="currentPassword"
                      type="password"
                      placeholder="현재 비밀번호"
                      class="h-10 border-neutral-200"
                    />
                  </div>

                  <div class="space-y-2">
                    <Label class="text-xs font-semibold text-neutral-500 uppercase"
                      >새 비밀번호</Label
                    >
                    <Input
                      v-model="newPassword"
                      type="password"
                      placeholder="새 비밀번호"
                      class="h-10 border-neutral-200"
                    />
                  </div>
                </section>
              </div>

              <!-- 알림 -->
              <div v-if="activeTab === 'notifications'" class="space-y-6">
                <section class="space-y-4">
                  <p class="text-muted-foreground text-sm">알림 설정을 조정하세요.</p>

                  <div class="flex items-center justify-between border-b border-neutral-100 py-2">
                    <div class="min-w-0 space-y-0.5">
                      <Label class="text-sm font-semibold">이메일 알림</Label>
                      <p class="text-muted-foreground wrap-break-words text-xs">
                        새로운 업데이트 및 중요 공지사항에 대한 이메일을 받습니다.
                      </p>
                    </div>
                    <Switch
                      :checked="notificationDraft.emailAlert"
                      :model-value="notificationDraft.emailAlert"
                      aria-label="이메일 알림"
                      @update:checked="onEmailAlertSwitch"
                      @update:model-value="onEmailAlertSwitch"
                    />
                  </div>

                  <div
                    class="flex items-center justify-between border-b border-neutral-100 py-2 last:border-0"
                  >
                    <div class="min-w-0 space-y-0.5">
                      <Label class="text-sm font-semibold">앱 알림</Label>
                      <p class="text-muted-foreground wrap-break-words text-xs">
                        앱 내에서 직접 알림을 받습니다.
                      </p>
                    </div>
                    <Switch
                      :checked="settings.notifications.enabled"
                      :model-value="settings.notifications.enabled"
                      aria-label="앱 알림"
                      @update:checked="onAppAlertSwitch"
                      @update:model-value="onAppAlertSwitch"
                    />
                  </div>
                </section>

                <section class="space-y-4 pt-4">
                  <h4 class="text-sm font-bold text-neutral-900 uppercase">방해 금지 시간</h4>
                  <p class="text-muted-foreground text-xs">
                    이 시간 동안에는 알림을 받지 않습니다.
                  </p>

                  <div class="flex flex-wrap items-center gap-3 pt-2">
                    <Select v-model="notificationDraft.dndStart">
                      <SelectTrigger class="w-32 border-none bg-neutral-100 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="t in timeOptions" :key="t.value" :value="t.value">
                          {{ t.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <span class="text-sm font-medium text-neutral-500">부터</span>

                    <Select v-model="notificationDraft.dndEnd">
                      <SelectTrigger class="w-32 border-none bg-neutral-100 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="t in timeOptions" :key="t.value" :value="t.value">
                          {{ t.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <span class="text-sm font-medium text-neutral-500">까지</span>
                  </div>

                  <p class="text-[11px] text-neutral-400">
                    알림 설정은 기기의 시스템 설정에 따라 달라질 수 있습니다.
                  </p>
                </section>
              </div>
            </div>
          </div>

          <div class="bg-muted/10 mt-auto flex justify-end gap-3 border-t px-6 py-4 md:px-8">
            <Button
              type="button"
              variant="outline"
              class="h-9 border-neutral-200 px-6 font-semibold"
              @click="handleCancel"
            >
              취소
            </Button>
            <Button
              type="button"
              class="h-9 border-none bg-[#A68A64] px-6 font-semibold text-white transition-colors hover:bg-[#8E7554]"
              @click="handleSave"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
