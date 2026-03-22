<script setup lang="ts">
  import { reactive, ref, shallowRef, toRaw, watch } from 'vue';
  import { Save, X, ChevronDown } from 'lucide-vue-next';
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from '@/components/ui/sheet';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Calendar } from '@/components/ui/calendar';
  import { cn } from '@/lib/utils';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
  import { useUiStore } from '@/stores/uiStore';
  import { storeToRefs } from 'pinia';
  import { useScheduleStore } from '@/stores/scheduleStore';
  import type { Schedule } from '@croffledev/croffle-types';
  import { toast } from 'vue-sonner';
  // import type { Tag } from 'croffle';

  // 스토어 연결
  const uiStore = useUiStore();
  const scheduleStore = useScheduleStore();
  const { isTodoSheetOpen, todoSheetMode, selectedScheduleId } = storeToRefs(uiStore);

  // 우선순위 태그 관련 상수
  // const PRIORITY_TAG_PREFIX = 'sys:priority:';

  // const PRIORITY_TAG_META: Record<'low' | 'medium' | 'high', { name: string; color: string }> = {
  //   low: { name: 'sys:priority:low', color: '#10b981' },
  //   medium: { name: 'sys:priority:medium', color: '#f59e0b' },
  //   high: { name: 'sys:priority:high', color: '#f43f5e' },
  // };

  const toCalendarDate = (iso: string) => {
    const d = new Date(iso);
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  };

  // 달력 컴포넌트에서 사용할 상태값과 함수들을 정의
  const formatCalendarDate = (calendarDate: CalendarDate | undefined) => {
    if (!calendarDate) return '날짜를 선택하세요';
    const jsDate = calendarDate.toDate(getLocalTimeZone());
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(jsDate);
  };

  // 태그 배열에서 우선순위 태그를 찾아 반환하는 함수
  // const getPriorityFromTags = (tags: Tag[] | undefined): 'low' | 'medium' | 'high' => {
  //   if (!tags || tags.length === 0) return 'medium';
  //   const found = tags.find((t) => t.name?.startsWith(PRIORITY_TAG_PREFIX));
  //   if (!found) return 'medium';

  //   if (found.name === PRIORITY_TAG_META.low.name) return 'low';
  //   if (found.name === PRIORITY_TAG_META.high.name) return 'high';
  //   return 'medium';
  // };

  // const applyPriorityTag = (
  //   tags: Tag[] | undefined,
  //   selected: 'low' | 'medium' | 'high'
  // ): Tag[] => {
  //   const base = (tags ?? []).filter((t) => !t.name?.startsWith(PRIORITY_TAG_PREFIX));
  //   const meta = PRIORITY_TAG_META[selected];

  //   const priorityTag: Tag = {
  //     id: `system-priority-${selected}`,
  //     name: meta.name,
  //     color: meta.color,
  //   };

  //   return [...base, priorityTag];
  // };

  const form = reactive({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isAllDay: true,
    recurrenceRule: '',
    colorLabel: '#DCA780',
  });

  // CalendarDate 객체 내부의 #private 필드가 Vue Proxy와 충돌하는 것을 막기 위해
  // 반드시 ref가 아닌 shallowRef를 사용해야 함
  const startDate = shallowRef<CalendarDate | undefined>(undefined);
  const endDate = shallowRef<CalendarDate | undefined>(undefined);
  const isStartCalendarOpen = ref(false);
  const isEndCalendarOpen = ref(false);

  const resetForm = () => {
    form.title = '';
    form.description = '';
    form.location = '';
    form.priority = 'medium';
    form.isAllDay = true;
    form.recurrenceRule = '';
    form.colorLabel = '#DCA780';
    startDate.value = undefined;
    endDate.value = undefined;
  };

  const fillFormFromSchedule = (schedule: Schedule) => {
    // 스토어의 원본 데이터를 보호하기 위해 깊은 복사 사용
    const cloned = structuredClone(toRaw(schedule));

    form.title = cloned.title ?? '';
    form.description = cloned.description ?? '';
    form.location = cloned.location ?? '';
    form.isAllDay = cloned.isAllDay ?? true;
    form.recurrenceRule = cloned.recurrenceRule ?? '';
    form.colorLabel = cloned.colorLabel ?? '#DCA780';
    startDate.value = cloned.startDate ? toCalendarDate(cloned.startDate) : undefined;
    endDate.value = cloned.endDate ? toCalendarDate(cloned.endDate) : startDate.value;

    // 우선순위는 현재 미연결 정책 유지
    form.priority = 'medium';
  };

  // 일정 시트가 열릴 때마다 모드에 따라 상태 초기화
  watch(
    () => ({
      open: isTodoSheetOpen.value,
      mode: todoSheetMode.value,
      scheduleId: selectedScheduleId.value,
    }),
    ({ open, mode, scheduleId }) => {
      if (!open) return;
      // add 모드일 때는 모든 필드를 초기값으로 설정
      if (mode === 'add') {
        resetForm();
        return;
      }

      // edit 모드일 때는 선택된 일정의 데이터를 불러와 상태에 반영
      if (!scheduleId) {
        resetForm();
        uiStore.closeTodoSheet();
        return;
      }

      const schedule = scheduleStore.getScheduleById(scheduleId);
      if (!schedule) {
        resetForm();
        uiStore.closeTodoSheet();
        return;
      }

      fillFormFromSchedule(schedule);
    },
    { immediate: true }
  );

  // 저장 버튼 핸들러
  const handleSave = async () => {
    if (!form.title.trim() || !startDate.value || !endDate.value) return;

    const selectedStart = startDate.value.toString();
    const selectedEnd = endDate.value.toString();

    // 시작일이 종료일보다 늦을 수 없도록 검증
    if (selectedEnd < selectedStart) {
      toast.error('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    const payload: Partial<Schedule> = {
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      startDate: selectedStart,
      endDate: selectedEnd,
      isAllDay: form.isAllDay,
      recurrenceRule: form.recurrenceRule.trim() || undefined,
      colorLabel: form.colorLabel || '#DCA780',
      // TODO 태그 시스템 미완성이라 현재 빈 배열로 고정
      tags: [],
    };

    try {
      if (todoSheetMode.value === 'add') {
        await scheduleStore.createSchedule(payload);
      } else {
        if (!selectedScheduleId.value) return;
        await scheduleStore.updateScheduleById(selectedScheduleId.value, payload);
      }

      uiStore.closeTodoSheet();
    } catch (error) {
      console.error('일정 저장 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (todoSheetMode.value !== 'edit' || !selectedScheduleId.value) return;

    try {
      const isSuccess = await scheduleStore.removeScheduleById(selectedScheduleId.value);
      if (isSuccess) {
        uiStore.closeTodoSheet();
      }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
    }
  };

  // Priority Options
  const priorityOptions = [
    {
      value: 'low',
      label: '낮음',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      emoji: '🟢',
    },
    {
      value: 'medium',
      label: '보통',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      emoji: '🟡',
    },
    {
      value: 'high',
      label: '높음',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      emoji: '🔴',
    },
  ] as const;
</script>

<template>
  <Sheet
    :open="isTodoSheetOpen"
    @update:open="
      (val) => {
        if (!val) uiStore.closeTodoSheet();
      }
    "
  >
    <SheetContent
      side="left"
      class="bg-croffle-bg border-croffle-border z-50 flex w-110 flex-col gap-0 border-r p-0"
    >
      <SheetHeader class="border-croffle-border bg-croffle-sidebar shrink-0 border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <SheetTitle class="text-croffle-text-dark text-xl font-bold">
            {{ todoSheetMode === 'edit' ? '일정 수정' : '새 일정 추가' }}
          </SheetTitle>
        </div>
        <SheetDescription class="sr-only">일정 입력</SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto">
        <div class="space-y-6 px-6 py-6">
          <div class="space-y-2">
            <!-- 이부분 추후 chadcn textarea로 변경 해야함 -->
            <Label for="title" class="text-croffle-text-dark text-sm font-medium">
              제목 <span class="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              v-model="form.title"
              placeholder="일정 제목을 입력하세요"
              class="border-croffle-border focus-visible:ring-croffle-primary bg-background h-11"
            />
          </div>

          <div class="space-y-2">
            <!-- 이부분도 추후 chadcn scroll-area로 변경 해야함 -->
            <Label for="description" class="text-croffle-text-dark text-sm font-medium">설명</Label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="일정에 대한 자세한 설명을 입력하세요 (선택사항)"
              rows="4"
              class="placeholder:text-muted-foreground focus-visible:ring-croffle-primary border-croffle-border bg-background flex w-full resize-none rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>

          <div class="space-y-2">
            <Label for="location" class="text-croffle-text-dark text-sm font-medium">장소</Label>
            <Input
              id="location"
              v-model="form.location"
              placeholder="장소를 입력하세요 (선택사항)"
              class="border-croffle-border focus-visible:ring-croffle-primary bg-background h-11"
            />
          </div>

          <div class="space-y-2">
            <Label class="text-croffle-text-dark text-sm font-medium">종일 일정</Label>
            <div class="flex items-center gap-2">
              <input id="isAllDay" v-model="form.isAllDay" type="checkbox" class="h-4 w-4" />
              <Label for="isAllDay" class="text-croffle-text text-sm">하루 종일</Label>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="recurrenceRule" class="text-croffle-text-dark text-sm font-medium"
              >반복 규칙</Label
            >
            <Input
              id="recurrenceRule"
              v-model="form.recurrenceRule"
              placeholder="예: FREQ=WEEKLY;BYDAY=FR"
              class="border-croffle-border focus-visible:ring-croffle-primary bg-background h-11"
            />
          </div>

          <div class="space-y-2">
            <Label for="colorLabel" class="text-croffle-text-dark text-sm font-medium">색상</Label>
            <Input id="colorLabel" v-model="form.colorLabel" type="color" class="h-11 w-20 p-1" />
          </div>

          <div class="flex flex-col space-y-2">
            <Label class="text-croffle-text-dark text-sm font-medium">
              날짜 <span class="text-red-400">*</span>
            </Label>

            <div class="grid grid-cols-2 gap-2">
              <Popover v-model:open="isStartCalendarOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'border-croffle-border hover:bg-croffle-sidebar bg-background h-11 w-full justify-between text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )
                    "
                  >
                    <span class="text-croffle-text-dark">{{ formatCalendarDate(startDate) }}</span>
                    <ChevronDown class="text-croffle-text ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  class="border-croffle-border bg-popover text-popover-foreground z-50 w-auto p-0"
                >
                  <Calendar
                    v-model="startDate"
                    mode="single"
                    class="rounded-md border-0"
                    @update:model-value="isStartCalendarOpen = false"
                  />
                </PopoverContent>
              </Popover>

              <Popover v-model:open="isEndCalendarOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="
                      cn(
                        'border-croffle-border hover:bg-croffle-sidebar bg-background h-11 w-full justify-between text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )
                    "
                  >
                    <span class="text-croffle-text-dark">{{ formatCalendarDate(endDate) }}</span>
                    <ChevronDown class="text-croffle-text ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  class="border-croffle-border bg-popover text-popover-foreground z-50 w-auto p-0"
                >
                  <Calendar
                    v-model="endDate"
                    mode="single"
                    class="rounded-md border-0"
                    @update:model-value="isEndCalendarOpen = false"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div class="space-y-2">
            <Label class="text-croffle-text-dark text-sm font-medium">우선순위</Label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in priorityOptions"
                :key="option.value"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-3 transition-all"
                :class="[
                  form.priority === option.value
                    ? `${option.color} ring-croffle-border shadow-sm ring-1 ring-offset-1`
                    : 'border-croffle-border hover:bg-croffle-sidebar text-croffle-text bg-background',
                ]"
                @click="form.priority = option.value"
              >
                <span class="text-xl">{{ option.emoji }}</span>
                <span class="text-xs font-medium">{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="border-croffle-border bg-croffle-sidebar shrink-0 border-t px-6 py-4">
        <div class="flex gap-2">
          <Button
            variant="outline"
            class="border-croffle-border text-croffle-text-dark hover:bg-croffle-hover bg-background flex-1"
            @click="uiStore.closeTodoSheet()"
          >
            <X class="mr-2 h-4 w-4" /> 닫기
          </Button>

          <Button
            :disabled="!form.title.trim() || !startDate || !endDate"
            class="bg-croffle-primary hover:bg-croffle-hover flex-1 text-white"
            @click="handleSave"
          >
            <Save class="mr-2 h-4 w-4" />
            {{ todoSheetMode === 'edit' ? '수정' : '추가' }}
          </Button>

          <Button
            v-if="todoSheetMode === 'edit'"
            variant="destructive"
            class="flex-1"
            @click="handleDelete"
          >
            삭제
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
