<script setup lang="ts">
import { ref } from 'vue' // 상태 관리를 위해 ref 가져오기
import { Calendar, Clock, Plus, PanelRightClose, PanelRightOpen } from 'lucide-vue-next' 
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils' // shadcn의 유틸리티 (클래스 병합용, 없으면 빼고 일반 문자열로 해도 됨)

// 부모로부터 받을 데이터 (기존 유지)
defineProps<{
  todayCount?: number
  hasTodayEvent?: boolean
  hasUpcomingEvent?: boolean
}>()

const emit = defineEmits(['click-add-schedule'])

// 사이드바 접힘/펼침 상태 관리 (기본값: false = 펼침)
const isCollapsed = ref(false)

// 토글 함수
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <aside 
    class="h-full border-l bg-[#FDFBF7] flex flex-col p-4 gap-6 text-slate-800 transition-all duration-300 ease-in-out flex-shrink-0"
    :class="isCollapsed ? 'w-[80px]' : 'w-[300px]'"
  >
    
    <div class="space-y-1">
      <div 
        class="flex items-center" 
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <h2 v-if="!isCollapsed" class="text-lg font-semibold tracking-tight text-[#D4A373] whitespace-nowrap overflow-hidden">
          일정 관리
        </h2>

        <Button variant="ghost" size="icon" class="h-8 w-8 text-slate-500" @click="toggleSidebar">
            <span class="sr-only">메뉴 토글</span>
            <PanelRightOpen v-if="isCollapsed" class="w-5 h-5" />
            <PanelRightClose v-else class="w-5 h-5" />
        </Button>
      </div>
      
      <p v-if="!isCollapsed" class="text-sm text-muted-foreground whitespace-nowrap overflow-hidden">
        오늘의 일정과 계획
      </p>
    </div>

    <Button 
      @click="emit('click-add-schedule')"
      class="bg-[#D4A373] hover:bg-[#C39262] text-white shadow-sm font-medium transition-all duration-300"
      :class="isCollapsed ? 'w-10 h-10 rounded-full p-0 mx-auto' : 'w-full h-12 rounded-md'"
    >
      <Plus class="h-5 w-5" :class="{ 'mr-2': !isCollapsed }" />
      <span v-if="!isCollapsed">새 일정 추가</span>
    </Button>

    <div v-if="!isCollapsed" class="flex flex-col gap-6 animate-in fade-in duration-500">
        
        <section class="space-y-3">
        <div class="flex items-center justify-between">
            <h3 class="font-medium flex items-center gap-2">
            <Calendar class="w-4 h-4 text-slate-500" />
            오늘의 일정
            </h3>
            <Badge variant="secondary" class="bg-gray-200 text-gray-600">
            {{ todayCount || 0 }}
            </Badge>
        </div>
        
        <Card class="bg-white border-none shadow-sm">
            <CardContent class="h-[150px] flex items-center justify-center text-sm text-muted-foreground">
            <span v-if="!hasTodayEvent">오늘 일정이 없습니다</span>
            <span v-else>일정 리스트...</span>
            </CardContent>
        </Card>
        </section>

        <section class="space-y-3">
        <div class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-slate-500" />
            <h3 class="font-medium">다가오는 일정</h3>
        </div>

        <Card class="bg-white border-none shadow-sm">
            <CardContent class="h-[150px] flex items-center justify-center text-sm text-muted-foreground">
            다가오는 일정이 없습니다
            </CardContent>
        </Card>
        </section>
    </div>

    <div v-else class="flex flex-col gap-6 items-center mt-4 animate-in fade-in duration-300">
        <div class="p-2 rounded-md hover:bg-slate-100 cursor-pointer" title="오늘의 일정">
             <Calendar class="w-5 h-5 text-slate-500" />
        </div>
         <div class="p-2 rounded-md hover:bg-slate-100 cursor-pointer" title="다가오는 일정">
             <Clock class="w-5 h-5 text-slate-500" />
        </div>
    </div>

    <div class="mt-auto pt-6 flex flex-col items-center justify-center gap-2 pb-4 overflow-hidden">
      <div class="p-2">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A373" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </div>
      <div v-if="!isCollapsed" class="text-center whitespace-nowrap">
        <h4 class="font-bold text-[#8B5E3C] text-sm tracking-wider">CROFFLE</h4>
        <span class="text-[10px] text-muted-foreground">v1.0.0</span>
      </div>
    </div>
  </aside>
</template>