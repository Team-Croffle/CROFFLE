<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue';
  import { Settings, Bell, Puzzle, CalendarDays } from 'lucide-vue-next';
  import {
    AppSettingLanguage,
    AppSettingStartupBehavior,
    AppSettingTheme,
    CalendarTimeFormat,
    CalendarView,
    CalendarWeekStartDay,
  } from '../../../shared/enums';
  import { useAppSettingsStore } from '@/stores/appSettingsStore';
  import { useSettingsStore } from '@/stores/settingsStore';
  import SettingsExtensionPanel from '@/components/settings/SettingsExtensionPanel.vue';
  import ConfigSchemaForm from '@/components/settings/ConfigSchemaForm.vue';
  import { mergeWithSchemaDefaults } from '@/utils/pluginSettingsSchema';
  import type { SettingsTabContribution } from '@croffledev/croffle-types';
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

  import { Separator } from '@/components/ui/separator';
  import type { AppSettings } from '@croffledev/croffle-types';

  interface Props {
    open: boolean;
  }

  // 알림 탭 UI 전용 스키마
  interface NotificationDraft {
    emailAlert: boolean;
    dndStart: string;
    dndEnd: string;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
  }>();

  const settingsStore = useSettingsStore();
  const appSettingsStore = useAppSettingsStore();

  const activeTab = ref<string>('general');
  const originalSettings = ref<AppSettings | null>(null);
  const settings = ref<AppSettings | null>(null);

  // 로딩/오류 상태
  const isLoadingSettings = ref(true);
  const loadError = ref<string | null>(null);

  const notificationDraft = ref<NotificationDraft>({
    emailAlert: true,
    dndStart: '22:00',
    dndEnd: '07:00',
  });

  // 취소 복원용 원본(UI draft)
  const originalNotificationDraft = ref<NotificationDraft>({
    emailAlert: true,
    dndStart: '22:00',
    dndEnd: '07:00',
  });

  const extensionDrafts = ref<Record<string, Record<string, unknown>>>({});
  const originalExtensionDrafts = ref<Record<string, Record<string, unknown>>>({});

  const UI_DRAFT_STORAGE_KEY = 'croffle:settings-ui-draft';

  const builtinTabs = [
    { id: 'general', label: '일반', icon: Settings },
    { id: 'calendar', label: '캘린더', icon: CalendarDays },
    { id: 'notifications', label: '알림', icon: Bell },
  ] as const;

  const isBootEnabled = computed(() => settings.value?.general.startOnSystemBoot ?? false);

  const allTabs = computed(() => {
    const extension = settingsStore.sortedExtensionTabs.map((tab) => ({
      id: settingsStore.getTabCompositeId(tab),
      label: tab.label,
      icon: (tab.icon as typeof Puzzle) ?? Puzzle,
      extensionTab: tab,
    }));
    return [...builtinTabs, ...extension];
  });

  const activeExtensionTab = computed(() => settingsStore.findExtensionTab(activeTab.value));

  const activeExtensionDraft = computed({
    get: () => extensionDrafts.value[activeTab.value] ?? {},
    set: (value: Record<string, unknown>) => {
      extensionDrafts.value[activeTab.value] = value;
    },
  });

  const activeTabLabel = computed(
    () => allTabs.value.find((t) => t.id === activeTab.value)?.label ?? '설정'
  );

  // 깊은 복사 유틸
  const cloneSettings = (value: AppSettings) => JSON.parse(JSON.stringify(value)) as AppSettings;
  const cloneNotificationDraft = (value: NotificationDraft) =>
    JSON.parse(JSON.stringify(value)) as NotificationDraft;
  const cloneExtensionDrafts = (value: Record<string, Record<string, unknown>>) =>
    JSON.parse(JSON.stringify(value)) as Record<string, Record<string, unknown>>;

  const loadExtensionTabSettings = async (tab: SettingsTabContribution) => {
    if (!tab.sections?.length) return;
    const compositeId = settingsStore.getTabCompositeId(tab);
    const stored = await croffle.base.pluginSettings.get<Record<string, unknown>>(tab.pluginId);
    const merged = mergeWithSchemaDefaults(tab.sections, stored);
    extensionDrafts.value[compositeId] = merged;
    originalExtensionDrafts.value[compositeId] = JSON.parse(JSON.stringify(merged));
  };

  const loadAllExtensionSettings = async () => {
    const drafts: Record<string, Record<string, unknown>> = {};
    const originals: Record<string, Record<string, unknown>> = {};

    for (const tab of settingsStore.sortedExtensionTabs) {
      if (!tab.sections?.length) continue;
      const compositeId = settingsStore.getTabCompositeId(tab);
      const stored = await croffle.base.pluginSettings.get<Record<string, unknown>>(tab.pluginId);
      const merged = mergeWithSchemaDefaults(tab.sections, stored);
      drafts[compositeId] = merged;
      originals[compositeId] = JSON.parse(JSON.stringify(merged));
    }

    extensionDrafts.value = drafts;
    originalExtensionDrafts.value = originals;
  };

  const loadUiDraftFromStorage = (): { notifications: NotificationDraft } | null => {
    try {
      const raw = localStorage.getItem(UI_DRAFT_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as { notifications: NotificationDraft };
    } catch (error) {
      console.error('UI draft 로드 실패:', error);
      return null;
    }
  };

  const saveUiDraftToStorage = () => {
    try {
      const payload = {
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

    notificationDraft.value = saved?.notifications
      ? cloneNotificationDraft(saved.notifications)
      : {
          emailAlert: true,
          dndStart: '22:00',
          dndEnd: '07:00',
        };

    // 취소 복원용 원본 갱신
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
      await loadAllExtensionSettings();
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
        extensionDrafts.value = cloneExtensionDrafts(originalExtensionDrafts.value);
      } else {
        void reloadSettings();
      }
    }
  );

  const handleSave = async () => {
    if (!settings.value) return;
    try {
      await croffle.base.settings.update(cloneSettings(settings.value));

      for (const tab of settingsStore.sortedExtensionTabs) {
        if (!tab.sections?.length) continue;
        const compositeId = settingsStore.getTabCompositeId(tab);
        const draft = extensionDrafts.value[compositeId];
        if (draft) {
          await croffle.base.pluginSettings.set(tab.pluginId, draft);
        }
      }

      // 저장 후 재조회(실제 반영값 동기화)
      const reloaded = await croffle.base.settings.getAll();
      originalSettings.value = reloaded;
      settings.value = cloneSettings(reloaded);

      saveUiDraftToStorage();

      originalNotificationDraft.value = cloneNotificationDraft(notificationDraft.value);
      originalExtensionDrafts.value = cloneExtensionDrafts(extensionDrafts.value);

      emit('update:open', false);
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  };

  const handleCancel = () => {
    if (originalSettings.value) {
      settings.value = cloneSettings(originalSettings.value);
    }
    notificationDraft.value = cloneNotificationDraft(originalNotificationDraft.value);
    extensionDrafts.value = cloneExtensionDrafts(originalExtensionDrafts.value);

    emit('update:open', false);
  };

  // Switch 이벤트값 정규화(checked/modelValue 둘 다 대응)
  const asBool = (v: unknown): boolean => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v === 'true' || v === '1' || v === 'on';
    return !!v;
  };

  const setGeneralBool = (
    key: 'autoUpdate' | 'startOnSystemBoot' | 'startMinimized',
    v: unknown
  ) => {
    if (!settings.value) return;
    settings.value.general[key] = asBool(v);
  };

  const onThemeChange = (theme: unknown) => {
    if (!settings.value || typeof theme !== 'string') return;
    settings.value.general.theme = theme as AppSettingTheme;
    appSettingsStore.setThemeDraft(theme as AppSettingTheme);
  };

  const onReminderMinutesChange = (v: unknown) => {
    if (!settings.value || v == null) return;
    settings.value.notifications.defaultReminderMinutes = Number(v);
  };

  const onEmailAlertSwitch = (v: unknown) => {
    notificationDraft.value.emailAlert = asBool(v);
  };

  const onAppAlertSwitch = (v: unknown) => {
    if (!settings.value) return;
    settings.value.notifications.enabled = asBool(v);
  };

  const onShowWeekNumbersSwitch = (v: unknown) => {
    if (!settings.value) return;
    settings.value.calendar.showWeekNumbers = asBool(v);
  };

  const languageOptions = [
    { value: AppSettingLanguage.KO, label: '한국어' },
    { value: AppSettingLanguage.EN, label: 'English' },
  ] as const;

  const themeOptions = [
    { value: AppSettingTheme.LIGHT, label: '라이트' },
    { value: AppSettingTheme.DARK, label: '다크' },
    { value: AppSettingTheme.SYSTEM, label: '시스템 설정 따름' },
  ] as const;

  const startupBehaviorOptions = [
    { value: AppSettingStartupBehavior.OPEN_LAST_SESSION, label: '마지막에 열었던 화면' },
    { value: AppSettingStartupBehavior.OPEN_NEW_WINDOW, label: '캘린더 기본 화면' },
    { value: AppSettingStartupBehavior.DO_NOTHING, label: '열지 않음 (백그라운드)' },
  ] as const;

  const calendarViewOptions = [
    { value: CalendarView.DAY, label: '일' },
    { value: CalendarView.WEEK, label: '주' },
    { value: CalendarView.MONTH, label: '월' },
    { value: CalendarView.YEAR, label: '연' },
  ] as const;

  const weekStartOptions = [
    { value: CalendarWeekStartDay.SUNDAY, label: '일요일' },
    { value: CalendarWeekStartDay.MONDAY, label: '월요일' },
  ] as const;

  const timeFormatOptions = [
    { value: CalendarTimeFormat.H12, label: '12시간 (AM/PM)' },
    { value: CalendarTimeFormat.H24, label: '24시간' },
  ] as const;

  const reminderMinuteOptions = [5, 10, 15, 30, 60].map((m) => ({
    value: String(m),
    label: `${m}분 전`,
  }));

  const onExtensionTabClick = async (tab: SettingsTabContribution) => {
    const compositeId = settingsStore.getTabCompositeId(tab);
    activeTab.value = compositeId;
    if (tab.sections?.length && !extensionDrafts.value[compositeId]) {
      await loadExtensionTabSettings(tab);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = `${String(i).padStart(2, '0')}:00`;
    return { value: hour, label: hour };
  });
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <!-- 반응형 모달 크기 -->
    <DialogContent
      class="h-[90vh] max-h-[940px] w-[96vw] gap-0 overflow-hidden border-none p-0 shadow-2xl sm:w-[94vw] sm:max-w-none lg:w-[92vw]"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>설정</DialogTitle>
        <DialogDescription>설정을 관리하고 업데이트하세요.</DialogDescription>
      </DialogHeader>

      <div class="bg-background text-foreground absolute inset-0 flex overflow-hidden">
        <!-- 좌측 탭 -->
        <div class="border-border bg-muted/20 w-60 shrink-0 overflow-y-auto border-r p-4">
          <h2 class="text-foreground mb-6 px-2 text-xl font-bold">설정</h2>
          <nav class="space-y-1">
            <button
              v-for="tab in allTabs"
              :key="tab.id"
              type="button"
              :class="[
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-croffle-sidebar-selected text-croffle-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              ]"
              @click="
                'extensionTab' in tab && tab.extensionTab
                  ? onExtensionTabClick(tab.extensionTab)
                  : (activeTab = tab.id)
              "
            >
              <component :is="tab.icon" class="h-4 w-4" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- 우측 콘텐츠 -->
        <div class="flex min-h-0 min-w-0 flex-1 flex-col">
          <div class="shrink-0 px-6 py-6 md:px-8">
            <h3 class="text-2xl font-bold wrap-break-word">
              {{ activeTabLabel }}
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
              <div v-if="activeTab === 'general'" class="space-y-8">
                <p class="text-muted-foreground text-sm">앱 전역 기본 설정입니다.</p>

                <section class="space-y-4">
                  <h4 class="text-base font-bold text-neutral-900">표시</h4>

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
                  </div>

                  <div class="space-y-2">
                    <Label for="settings-theme" class="text-foreground text-sm font-medium"
                      >테마</Label
                    >
                    <Select
                      :model-value="settings.general.theme"
                      @update:model-value="onThemeChange"
                    >
                      <SelectTrigger id="settings-theme" class="w-full">
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
                  </div>
                </section>

                <Separator />

                <section class="space-y-4">
                  <h4 class="text-base font-bold text-neutral-900">업데이트</h4>
                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label class="text-foreground text-sm font-medium">자동 업데이트</Label>
                      <p class="text-muted-foreground text-xs">
                        새 버전이 있으면 자동으로 확인하고 알립니다.
                      </p>
                    </div>
                    <Switch
                      :checked="settings.general.autoUpdate"
                      :model-value="settings.general.autoUpdate"
                      aria-label="자동 업데이트"
                      @update:checked="(v) => setGeneralBool('autoUpdate', v)"
                      @update:model-value="(v) => setGeneralBool('autoUpdate', v)"
                    />
                  </div>
                </section>

                <Separator />

                <section class="space-y-4">
                  <h4 class="text-base font-bold text-neutral-900">시작 프로그램</h4>

                  <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                      <Label class="text-foreground text-sm font-medium">OS 시작 시 실행</Label>
                      <p class="text-muted-foreground text-xs">
                        켜면 로그인 시 Croffle이 자동으로 실행됩니다.
                      </p>
                    </div>
                    <Switch
                      :checked="settings.general.startOnSystemBoot"
                      :model-value="settings.general.startOnSystemBoot"
                      aria-label="OS 시작 시 실행"
                      @update:checked="(v) => setGeneralBool('startOnSystemBoot', v)"
                      @update:model-value="(v) => setGeneralBool('startOnSystemBoot', v)"
                    />
                  </div>

                  <div
                    class="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4"
                    :class="{ 'pointer-events-none opacity-50': !isBootEnabled }"
                  >
                    <div class="space-y-2">
                      <Label
                        for="settings-startup-behavior"
                        class="text-foreground text-sm font-medium"
                        >시작 시 동작</Label
                      >
                      <Select v-model="settings.general.startupBehavior" :disabled="!isBootEnabled">
                        <SelectTrigger id="settings-startup-behavior" class="w-full">
                          <SelectValue placeholder="시작 동작 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in startupBehaviorOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p class="text-muted-foreground text-xs">
                        OS 시작으로 앱이 실행될 때의 초기 화면 동작입니다.
                      </p>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="space-y-0.5">
                        <Label class="text-foreground text-sm font-medium">최소화로 시작</Label>
                        <p class="text-muted-foreground text-xs">
                          시작 시 창을 표시하지 않고 트레이에서 실행합니다.
                        </p>
                      </div>
                      <Switch
                        :checked="settings.general.startMinimized"
                        :model-value="settings.general.startMinimized"
                        :disabled="!isBootEnabled"
                        aria-label="최소화로 시작"
                        @update:checked="(v) => setGeneralBool('startMinimized', v)"
                        @update:model-value="(v) => setGeneralBool('startMinimized', v)"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <!-- 캘린더 -->
              <div v-if="activeTab === 'calendar'" class="space-y-6">
                <p class="text-muted-foreground text-sm">캘린더 표시 방식을 설정합니다.</p>

                <div class="space-y-2">
                  <Label for="settings-default-view" class="text-foreground text-sm font-medium"
                    >기본 뷰</Label
                  >
                  <Select v-model="settings.calendar.defaultView">
                    <SelectTrigger id="settings-default-view" class="w-full">
                      <SelectValue placeholder="기본 뷰 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in calendarViewOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="settings-week-start" class="text-foreground text-sm font-medium"
                    >한 주의 시작 요일</Label
                  >
                  <Select v-model="settings.calendar.weekStartDay">
                    <SelectTrigger id="settings-week-start" class="w-full">
                      <SelectValue placeholder="시작 요일" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in weekStartOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="space-y-2">
                  <Label for="settings-time-format" class="text-foreground text-sm font-medium"
                    >시간 형식</Label
                  >
                  <Select v-model="settings.calendar.timeFormat">
                    <SelectTrigger id="settings-time-format" class="w-full">
                      <SelectValue placeholder="시간 형식" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in timeFormatOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label class="text-foreground text-sm font-medium">주차 표시</Label>
                    <p class="text-muted-foreground text-xs">캘린더에 주차 번호를 표시합니다.</p>
                  </div>
                  <Switch
                    :checked="settings.calendar.showWeekNumbers"
                    :model-value="settings.calendar.showWeekNumbers"
                    aria-label="주차 표시"
                    @update:checked="onShowWeekNumbersSwitch"
                    @update:model-value="onShowWeekNumbersSwitch"
                  />
                </div>
              </div>

              <!-- 알림 -->
              <div v-if="activeTab === 'notifications'" class="space-y-6">
                <p class="text-muted-foreground text-sm">일정 알림 설정입니다.</p>

                <div class="flex items-center justify-between border-b border-neutral-100 py-2">
                  <div class="min-w-0 space-y-0.5">
                    <Label class="text-sm font-semibold">알림 사용</Label>
                    <p class="text-muted-foreground wrap-break-words text-xs">
                      일정 알림을 받을지 설정합니다.
                    </p>
                  </div>
                  <Switch
                    :checked="settings.notifications.enabled"
                    :model-value="settings.notifications.enabled"
                    aria-label="알림 사용"
                    @update:checked="onAppAlertSwitch"
                    @update:model-value="onAppAlertSwitch"
                  />
                </div>

                <div class="space-y-2">
                  <Label for="settings-reminder-minutes" class="text-foreground text-sm font-medium"
                    >기본 알림 시간</Label
                  >
                  <Select
                    :model-value="String(settings.notifications.defaultReminderMinutes)"
                    @update:model-value="onReminderMinutesChange"
                  >
                    <SelectTrigger id="settings-reminder-minutes" class="w-full">
                      <SelectValue placeholder="알림 시점" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in reminderMinuteOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="text-muted-foreground text-xs">
                    새 일정 생성 시 기본으로 적용되는 알림 시점입니다.
                  </p>
                </div>

                <Separator class="my-4" />

                <section class="space-y-4 opacity-80">
                  <p class="text-muted-foreground text-xs">
                    아래 항목은 추후 계정/알림 고도화용 UI입니다 (현재 AppSettings에 미포함).
                  </p>
                  <div class="flex items-center justify-between py-2">
                    <Label class="text-sm font-semibold">이메일 알림 (준비 중)</Label>
                    <Switch
                      :checked="notificationDraft.emailAlert"
                      :model-value="notificationDraft.emailAlert"
                      @update:checked="onEmailAlertSwitch"
                      @update:model-value="onEmailAlertSwitch"
                    />
                  </div>
                  <div class="flex flex-wrap items-center gap-3">
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
                    <span class="text-sm font-medium text-neutral-500">~</span>
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
                    <span class="text-sm text-neutral-500">방해 금지 (준비 중)</span>
                  </div>
                </section>
              </div>

              <!-- Extension: custom render -->
              <SettingsExtensionPanel
                v-else-if="activeExtensionTab?.render"
                :render-fn="activeExtensionTab.render"
                :panel-key="activeTab"
              />

              <!-- Extension: schema sections -->
              <div v-else-if="activeExtensionTab?.sections?.length" class="space-y-8">
                <p v-if="activeExtensionTab.pluginName" class="text-muted-foreground text-sm">
                  {{ activeExtensionTab.pluginName }} 확장 설정
                </p>
                <ConfigSchemaForm
                  v-for="section in activeExtensionTab.sections"
                  :key="section.id"
                  v-model:values="activeExtensionDraft"
                  :items="section.items"
                  :section-title="section.title"
                  :section-description="section.description"
                />
              </div>
            </div>
          </div>

          <div
            class="bg-muted/10 mt-auto flex shrink-0 justify-end gap-3 border-t px-6 py-4 md:px-8"
          >
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
