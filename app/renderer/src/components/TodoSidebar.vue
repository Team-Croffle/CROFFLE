<script setup lang="ts">
// 아이콘 (npm install lucide-vue-next)
import { 
  ChevronRight, Menu, Home,
  Calendar, Settings // 예시 아이콘
} from 'lucide-vue-next'

// Shadcn UI 컴포넌트
import { Button } from '@/components/ui/button'

// --- Props & Emits ---
// 데이터(todos)는 받지 않고, 오직 열림/닫힘 상태만 받습니다.
interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

</script>

<template>
  <div 
    class="h-full bg-background border-l border-border flex flex-col transition-all duration-300"
    :class="isOpen ? 'w-80' : 'w-16'"
  >
    <!-- 1. 헤더 영역 -->
    <div class="p-4 border-b border-border flex items-center justify-between h-14">
      <!-- 열렸을 때만 보이는 타이틀 -->
      <div v-if="isOpen" class="fade-in overflow-hidden whitespace-nowrap">
        <h2 class="font-semibold text-foreground">메뉴</h2>
      </div>
      
      <!-- 접기/펴기 버튼 -->
      <Button variant="ghost" size="icon" @click="emit('toggle')" class="shrink-0 ml-auto">
        <ChevronRight v-if="isOpen" class="w-4 h-4" />
        <Menu v-else class="w-4 h-4" />
      </Button>
    </div>

    <!--  메인 컨텐츠 -->
    <div class="flex-1 flex flex-col overflow-hidden py-4">
      
      <div class="px-2 mb-2">
        <Button 
          variant="ghost" 
          class="w-full justify-start h-10 px-2"
          :class="!isOpen ? 'justify-center' : ''"
        >
          <Calendar class="w-5 h-5" :class="isOpen ? 'mr-2' : ''" />
          <span v-if="isOpen" class="fade-in">일정 관리</span>
        </Button>
      </div>

      <div class="px-2 mb-2">
        <Button 
          variant="ghost" 
          class="w-full justify-start h-10 px-2"
          :class="!isOpen ? 'justify-center' : ''"
        >
          <Settings class="w-5 h-5" :class="isOpen ? 'mr-2' : ''" />
          <span v-if="isOpen" class="fade-in">설정</span>
        </Button>
      </div>
    </div>
    <!-- 푸터 -->
    <div class="p-4 border-t border-border">
      <div class="bg-muted/50 rounded-lg p-2 text-center flex items-center justify-center">
        <Home class="w-4 h-4 text-primary" :class="isOpen ? 'mr-2' : ''" />
        <p v-if="isOpen" class="text-[10px] font-bold text-muted-foreground fade-in whitespace-nowrap">
          CROFFLE v1.0
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>