<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Trash2, Save, X, ChevronDown } from 'lucide-vue-next';
  // Shadcn UI Components
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
  // Textarea, ScrollArea 제거됨
  import { Calendar } from '@/components/ui/calendar';
  import { cn } from '@/lib/utils';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
  // Types
  export interface Todo {
    id: string;
    title: string;
    description?: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }
  interface Props {
    open: boolean;
    initialDate?: Date;
    editTodo?: Todo | null;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'save', todo: Omit<Todo, 'id'>): void;
    (e: 'delete', id: string): void;
  }>();
  // State
  const title = ref('');
  const description = ref('');
  const priority = ref<'low' | 'medium' | 'high'>('medium');
  const isCalendarOpen = ref(false);
  const date = ref<CalendarDate | undefined>();
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
  // Helper: JS Date -> CalendarDate
  const toCalendarDate = (jsDate: Date): CalendarDate => {
    return new CalendarDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
  };
  // Helper: Format Date
  const formatCalendarDate = (cd: CalendarDate | undefined) => {
    if (!cd) return '날짜를 선택하세요';
    const jsDate = cd.toDate(getLocalTimeZone());
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(jsDate);
  };
  // Logic: Reset & Init
  watch(
    () => [props.open, props.editTodo],
    ([isOpen]) => {
      if (isOpen) {
        if (props.editTodo) {
          title.value = props.editTodo.title;
          description.value = props.editTodo.description || '';
          priority.value = props.editTodo.priority;

          if (props.editTodo.date) {
            const jsDate = new Date(props.editTodo.date);
            date.value = toCalendarDate(jsDate);
          } else {
            date.value = today(getLocalTimeZone());
          }
        } else {
          title.value = '';
          description.value = '';
          priority.value = 'medium';

          if (props.initialDate) {
            date.value = toCalendarDate(props.initialDate);
          } else {
            date.value = today(getLocalTimeZone());
          }
        }
      }
    },
    { immediate: true }
  );
  const handleSave = () => {
    if (!title.value.trim() || !date.value) return;
    const jsDate = date.value.toDate(getLocalTimeZone());
    emit('save', {
      title: title.value.trim(),
      description: description.value.trim(),
      date: jsDate.toISOString(),
      priority: priority.value,
      completed: props.editTodo?.completed || false,
    });
    emit('update:open', false);
  };
  const handleDelete = () => {
    if (props.editTodo) {
      emit('delete', props.editTodo.id);
      emit('update:open', false);
    }
  };
</script>

<template>
  <Sheet :open="open" @update:open="(val) => emit('update:open', val)">
    <SheetContent
      side="left"
      class="bg-croffle-bg! border-croffle-border! z-50 flex w-110 flex-col gap-0 border-r p-0"
    >
      <SheetHeader class="border-croffle-border bg-croffle-sidebar shrink-0 border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <SheetTitle class="text-croffle-text-dark text-xl font-bold">
            {{ editTodo ? '일정 수정' : '새 일정 추가' }}
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
              v-model="title"
              placeholder="일정 제목을 입력하세요"
              class="border-croffle-border focus-visible:ring-croffle-primary h-11 bg-white"
            />
          </div>

          <div class="space-y-2">
            <!-- 이부분도 추후 chadcn scroll-area로 변경 해야함 -->
            <Label for="description" class="text-croffle-text-dark text-sm font-medium">설명</Label>
            <textarea
              id="description"
              v-model="description"
              placeholder="일정에 대한 자세한 설명을 입력하세요 (선택사항)"
              rows="4"
              class="placeholder:text-muted-foreground focus-visible:ring-croffle-primary border-croffle-border flex w-full resize-none rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>

          <div class="flex flex-col space-y-2">
            <Label class="text-croffle-text-dark text-sm font-medium">
              날짜 <span class="text-red-400">*</span>
            </Label>

            <Popover v-model:open="isCalendarOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'border-croffle-border hover:bg-croffle-sidebar h-11 w-full justify-between bg-white text-left font-normal',
                      !date && 'text-muted-foreground'
                    )
                  "
                >
                  <span class="text-croffle-text-dark">{{ formatCalendarDate(date) }}</span>
                  <ChevronDown class="text-croffle-text ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent class="border-croffle-border z-100 w-auto bg-white p-0">
                <Calendar
                  v-model="date"
                  mode="single"
                  class="rounded-md border-0"
                  @update:model-value="isCalendarOpen = false"
                />
              </PopoverContent>
            </Popover>
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
                  priority === option.value
                    ? `${option.color} ring-croffle-border shadow-sm ring-1 ring-offset-1`
                    : 'border-croffle-border hover:bg-croffle-sidebar text-croffle-text bg-white',
                ]"
                @click="priority = option.value"
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
            v-if="editTodo"
            variant="destructive"
            class="flex-1 border border-red-100 bg-white text-red-500 hover:border-red-200 hover:bg-red-50"
            @click="handleDelete"
          >
            <Trash2 class="mr-2 h-4 w-4" /> 삭제
          </Button>

          <Button
            variant="outline"
            class="border-croffle-border text-croffle-text-dark hover:bg-croffle-hover flex-1 bg-white"
            @click="emit('update:open', false)"
          >
            <X class="mr-2 h-4 w-4" /> 닫기
          </Button>

          <Button
            :disabled="!title.trim() || !date"
            class="bg-croffle-primary hover:bg-croffle-hover flex-1 text-white"
            @click="handleSave"
          >
            <Save class="mr-2 h-4 w-4" /> {{ editTodo ? '수정' : '추가' }}
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
