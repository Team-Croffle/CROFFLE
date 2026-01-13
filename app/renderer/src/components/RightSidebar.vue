<script setup lang="ts">
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  Home 
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

defineProps<{
  todayCount?: number
  hasTodayEvent?: boolean
  hasUpcomingEvent?: boolean
}>()

const emit = defineEmits(['click-add-schedule'])
const { toggleSidebar, state } = useSidebar()

// 전역 상수(__APP_VERSION__) 사용
const appVersion = __APP_VERSION__
</script>

<template>
  <Sidebar side="right" collapsible="icon" class="border-l border-[#E5DCCF] bg-[#FAF8F5]">
    
    <SidebarHeader class="p-4 pb-0">
      <div class="flex justify-between items-center mb-2 h-10">
        
        <div class="space-y-1 text-left overflow-hidden group-data-[collapsible=icon]:hidden transition-all duration-300">
          <h2 class="text-lg font-bold text-[#8B5E3C] whitespace-nowrap">
            일정 관리
          </h2>
          <p class="text-xs text-[#A89F91] whitespace-nowrap">
            오늘의 일정과 계획
          </p>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          class="h-8 w-8 text-[#8B5E3C] hover:bg-[#EDE5D8] ml-auto shrink-0"
          @click="toggleSidebar"
        >
          <ChevronLeft v-if="state === 'collapsed'" class="w-4 h-4" />
          <ChevronRight v-else class="w-4 h-4" />
        </Button>
      </div>

      <div class="h-[1px] bg-[#E5DCCF] w-full mb-2 group-data-[collapsible=icon]:hidden"></div>
    </SidebarHeader>

    <SidebarContent class="p-4 pt-0 gap-6 overflow-hidden">
      
      <div class="mt-2 flex justify-center">
        <Button 
          @click="emit('click-add-schedule')"
          class="!bg-[#d4a574] hover:!bg-[#b88a5c] text-white shadow-sm font-medium transition-all duration-300 border-none 
          w-full h-11 rounded-lg 
          group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0"
        >
          <Plus class="w-5 h-5 transition-all" :class="state === 'expanded' ? 'mr-1' : ''" />
          <span class="group-data-[collapsible=icon]:hidden">새 일정 추가</span>
        </Button>
      </div>

      <div class="flex flex-col gap-4 group-data-[collapsible=icon]:hidden animate-in fade-in duration-300">
        
        <Card class="bg-white border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader class="px-4 pt-2 pb-2 space-y-0">
            <CardTitle class="flex items-center gap-2 text-sm font-bold text-[#5A4E46]">
              <Calendar class="w-4 h-4" />
              <span>오늘의 일정</span>
              <Badge class="bg-[#F0EAE0] text-[#8B5E3C] ml-auto h-5 px-1.5 rounded-md hover:bg-[#E5DCCF]">
                {{ todayCount || 0 }}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent class="h-[120px] flex items-center justify-center text-sm text-[#A89F91]">
            <span v-if="!hasTodayEvent">오늘 일정이 없습니다</span>
            <span v-else>일정 리스트...</span>
          </CardContent>
        </Card>

        <Card class="bg-white border-none shadow-sm rounded-xl overflow-hidden">
          <CardHeader class="px-4 pt-2 pb-2 space-y-0">
            <CardTitle class="flex items-center gap-2 text-sm font-bold text-[#5A4E46]">
              <Clock class="w-4 h-4" />
              <span>다가오는 일정</span>
            </CardTitle>
          </CardHeader>

          <CardContent class="h-[120px] flex items-center justify-center text-sm text-[#A89F91]">
            다가오는 일정이 없습니다
          </CardContent>
        </Card>
      </div>

      <div class="hidden group-data-[collapsible=icon]:flex flex-col gap-4 items-center mt-2 animate-in fade-in duration-300">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#d4a574] hover:bg-[#FAF8F5] cursor-pointer" title="오늘의 일정">
            <Calendar class="w-5 h-5" />
        </div>
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#d4a574] hover:bg-[#FAF8F5] cursor-pointer" title="다가오는 일정">
            <Clock class="w-5 h-5" />
        </div>
      </div>

    </SidebarContent>

    <SidebarFooter class="p-4 flex flex-col items-center justify-center">
      <div class="bg-white w-full rounded-xl p-4 flex flex-col items-center justify-center shadow-sm mb-4 
                  group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:p-0">
        <Home class="w-6 h-6 text-[#d4a574] mb-1 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5" />
        
        <div class="text-center group-data-[collapsible=icon]:hidden">
            <h4 class="font-bold text-[#8B5E3C] text-xs tracking-wider">CROFFLE</h4>
            <span class="text-[10px] text-[#A89F91]">v{{ appVersion }}</span>
        </div>
      </div>
    </SidebarFooter>
    
    <Button
      variant="ghost"
      size="icon"
      class="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#2C2C2C] text-white hover:bg-black shadow-md z-10 p-0
            group-data-[collapsible=icon]:right-1/2 group-data-[collapsible=icon]:translate-x-1/2"
    >
      <span class="text-xs font-bold">?</span>
    </Button>

  </Sidebar>
</template>