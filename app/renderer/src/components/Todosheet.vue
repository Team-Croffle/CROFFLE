<script setup lang="ts">
import { ref, watch } from "vue";
import { Trash2, Save, X, ChevronDown } from "lucide-vue-next";
// Shadcn UI Components
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Textarea, ScrollArea 제거됨
import { Calendar } from "@/components/ui/calendar";
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
const title = ref("");
const description = ref("");
const priority = ref<'low' | 'medium' | 'high'>('medium');
const isCalendarOpen = ref(false);
const date = ref<CalendarDate | undefined>();
// Priority Options
const priorityOptions = [
  { value: 'low', label: '낮음', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '🟢' },
  { value: 'medium', label: '보통', color: 'bg-amber-50 text-amber-700 border-amber-200', emoji: '🟡' },
  { value: 'high', label: '높음', color: 'bg-rose-50 text-rose-700 border-rose-200', emoji: '🔴' },
] as const;
// Helper: JS Date -> CalendarDate
const toCalendarDate = (jsDate: Date): CalendarDate => {
  return new CalendarDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
};
// Helper: Format Date
const formatCalendarDate = (cd: CalendarDate | undefined) => {
  if (!cd) return "날짜를 선택하세요";
  const jsDate = cd.toDate(getLocalTimeZone());
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(jsDate);
};
// Logic: Reset & Init
watch(
  () => [props.open, props.editTodo], 
  ([isOpen]) => {
    if (isOpen) {
      if (props.editTodo) {
        title.value = props.editTodo.title;
        description.value = props.editTodo.description || "";
        priority.value = props.editTodo.priority;
        
        if (props.editTodo.date) {
            const jsDate = new Date(props.editTodo.date);
            date.value = toCalendarDate(jsDate);
        } else {
            date.value = today(getLocalTimeZone());
        }
      } else {
        title.value = "";
        description.value = "";
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
    <SheetContent side="left" class="w-110 p-0 flex flex-col gap-0 z-50 bg-croffle-bg! border-r border-croffle-border!">

      <SheetHeader class="px-6 py-4 border-b border-croffle-border bg-croffle-sidebar shrink-0">
        <div class="flex items-center justify-between">
          <SheetTitle class="text-xl text-croffle-text-dark font-bold">
            {{ editTodo ? '일정 수정' : '새 일정 추가' }}
          </SheetTitle>
        </div>
        <SheetDescription class="sr-only">일정 입력</SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto">
        <div class="px-6 py-6 space-y-6">

          <div class="space-y-2"> <!-- 이부분 추후 chadcn textarea로 변경 해야함 -->
            <Label for="title" class="text-sm font-medium text-croffle-text-dark">
              제목 <span class="text-red-400">*</span>
            </Label>
            <Input 
              id="title" 
              v-model="title" 
              placeholder="일정 제목을 입력하세요" 
              class="h-11 bg-white border-croffle-border focus-visible:ring-croffle-primary" 
            />
          </div>

          <div class="space-y-2"> <!-- 이부분도 추후 chadcn scroll-area로 변경 해야함 -->
            <Label for="description" class="text-sm font-medium text-croffle-text-dark">설명</Label>
            <textarea 
              id="description" 
              v-model="description" 
              placeholder="일정에 대한 자세한 설명을 입력하세요 (선택사항)" 
              rows="4" 
              class="flex w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-croffle-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none bg-white border-croffle-border" 
            ></textarea>
          </div>

          <div class="space-y-2 flex flex-col">
            <Label class="text-sm font-medium text-croffle-text-dark">
              날짜 <span class="text-red-400">*</span>
            </Label>

            <Popover v-model:open="isCalendarOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn(
                    'w-full justify-between text-left font-normal h-11 bg-white border-croffle-border hover:bg-croffle-sidebar', 
                    !date && 'text-muted-foreground'
                  )"
                >
                  <span class="text-croffle-text-dark">{{ formatCalendarDate(date) }}</span>
                  <ChevronDown class="ml-2 h-4 w-4 opacity-50 text-croffle-text" />
                </Button>
              </PopoverTrigger>

              <PopoverContent class="w-auto p-0 z-100 bg-white border-croffle-border">
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
            <Label class="text-sm font-medium text-croffle-text-dark">우선순위</Label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in priorityOptions"
                :key="option.value"
                type="button"
                @click="priority = option.value"
                class="p-3 rounded-lg border transition-all flex flex-col items-center gap-1 cursor-pointer"
                :class="[
                  priority === option.value 
                    ? `${option.color} ring-1 ring-offset-1 ring-croffle-border shadow-sm` 
                    : 'border-croffle-border bg-white hover:bg-croffle-sidebar text-croffle-text'
                ]"
              >
                <span class="text-xl">{{ option.emoji }}</span>
                <span class="text-xs font-medium">{{ option.label }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div class="px-6 py-4 border-t border-croffle-border bg-croffle-sidebar shrink-0">
        <div class="flex gap-2">
          <Button 
            v-if="editTodo" 
            variant="destructive" 
            @click="handleDelete" 
            class="flex-1 bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 class="h-4 w-4 mr-2" /> 삭제
          </Button>

          <Button 
            variant="outline" 
            @click="emit('update:open', false)" 
            class="flex-1 bg-white border-croffle-border text-croffle-text-dark hover:bg-croffle-hover"
          >
            <X class="h-4 w-4 mr-2" /> 닫기
          </Button>

          <Button 
            @click="handleSave" 
            :disabled="!title.trim() || !date" 
            class="flex-1 bg-croffle-primary hover:bg-croffle-hover text-white"
          >
            <Save class="h-4 w-4 mr-2" /> {{ editTodo ? '수정' : '추가' }}
          </Button>
        </div>
      </div>

    </SheetContent>
  </Sheet>
</template>