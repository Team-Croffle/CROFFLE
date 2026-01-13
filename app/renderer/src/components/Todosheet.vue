<script setup lang="ts">
import { ref, watch } from "vue";
import { 
  Trash2, 
  Save, 
  X,
  ChevronDown 
} from "lucide-vue-next";

// Shadcn UI Components
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

// Popover Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { 
  CalendarDate, 
  getLocalTimeZone, 
  today 
} from '@internationalized/date'

// 1. 타입 정의
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

// 상태 관리
const title = ref("");
const description = ref("");
const priority = ref<'low' | 'medium' | 'high'>('medium');
const isCalendarOpen = ref(false);

// 초기값은 undefined이거나 오늘 날짜
const date = ref<CalendarDate | undefined>();

const priorityOptions = [
  { value: 'low', label: '낮음', color: 'bg-green-100 text-green-800 border-green-200', emoji: '🟢' },
  { value: 'medium', label: '보통', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', emoji: '🟡' },
  { value: 'high', label: '높음', color: 'bg-red-100 text-red-800 border-red-200', emoji: '🔴' },
] as const;

const toCalendarDate = (jsDate: Date): CalendarDate => {
  return new CalendarDate(
    jsDate.getFullYear(),
    jsDate.getMonth() + 1, // JS 월은 0부터 시작하므로 +1
    jsDate.getDate()
  );
};

const formatCalendarDate = (cd: CalendarDate | undefined) => {
  if (!cd) return "날짜를 선택하세요";
  // CalendarDate를 다시 JS Date로 변환하여 포맷팅
  const jsDate = cd.toDate(getLocalTimeZone());
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(jsDate);
};

// 날짜 선택 핸들러
const handleDateSelect = (newDate: any) => {
  if (!newDate) return;
  date.value = newDate;
  isCalendarOpen.value = false;
};

// 데이터 초기화
watch(
  () => [props.open, props.editTodo], 
  ([isOpen]) => {
    if (isOpen) {
      if (props.editTodo) {
        // 수정 모드
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
        // 추가 모드
        title.value = "";
        description.value = "";
        priority.value = 'medium';
        
        // 초기값 설정
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

const closeSheet = () => {
  emit('update:open', false);
};

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
    <SheetContent side="left" class="w-[440px] p-0 flex flex-col gap-0 z-[50]">
      
      <SheetHeader class="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
        <div class="flex items-center justify-between">
          <SheetTitle class="text-xl">
            {{ editTodo ? '일정 수정' : '새 일정 추가' }}
          </SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            class="h-8 w-8 cursor-pointer relative z-[60]" 
            @click.stop="closeSheet"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
        <SheetDescription class="sr-only">일정 입력</SheetDescription>
      </SheetHeader>

      <ScrollArea class="flex-1">
        <div class="px-6 py-6 space-y-6">
          
          <div class="space-y-2">
            <Label for="title" class="text-sm font-medium">
              제목 <span class="text-red-500">*</span>
            </Label>
            <Input id="title" v-model="title" placeholder="일정 제목을 입력하세요" class="h-11" />
          </div>

          <div class="space-y-2">
            <Label for="description" class="text-sm font-medium">설명</Label>
            <Textarea id="description" v-model="description" placeholder="설명 입력" rows="4" class="resize-none" />
          </div>

          <div class="space-y-2 flex flex-col">
            <Label class="text-sm font-medium">
              날짜 <span class="text-red-500">*</span>
            </Label>
            
            <Popover v-model:open="isCalendarOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="cn(
                    'w-full justify-between text-left font-normal h-11', 
                    !date && 'text-muted-foreground'
                  )"
                >
                  {{ formatCalendarDate(date) }}
                  <ChevronDown class="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent class="w-auto p-0 !z-[100]" align="start">
                <Calendar
                  v-model="date"
                  mode="single"
                  class="rounded-md border bg-white" 
                  @update:model-value="handleDateSelect" 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div class="space-y-2">
            <Label class="text-sm font-medium">우선순위</Label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="option in priorityOptions"
                :key="option.value"
                type="button"
                @click="priority = option.value"
                class="p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 hover:bg-muted/50 cursor-pointer"
                :class="[priority === option.value ? `${option.color} border-current shadow-sm` : 'border-border bg-background']"
              >
                <span class="text-xl">{{ option.emoji }}</span>
                <span class="text-xs font-medium">{{ option.label }}</span>
              </button>
            </div>
          </div>

        </div>
      </ScrollArea>

      <div class="px-6 py-4 border-t bg-muted/30 flex-shrink-0">
        <div class="flex gap-2">
          <Button v-if="editTodo" variant="destructive" @click="handleDelete" class="flex-1">
            <Trash2 class="h-4 w-4 mr-2" /> 삭제
          </Button>
          <Button variant="outline" @click="closeSheet" class="flex-1">
            <X class="h-4 w-4 mr-2" /> 닫기
          </Button>
          <Button @click="handleSave" :disabled="!title.trim() || !date" class="bg-[#8B5E3C] hover:bg-[#6F4B30] flex-1 text-white">
            <Save class="h-4 w-4 mr-2" /> {{ editTodo ? '수정' : '추가' }}
          </Button>
        </div>
      </div>

    </SheetContent>
  </Sheet>
</template>