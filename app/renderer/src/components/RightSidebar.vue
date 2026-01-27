<script setup lang="ts">
import { 
  Calendar, 
  Clock, 
  Plus, 
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
defineProps<{
  todayCount?: number
  hasTodayEvent?: boolean
  hasUpcomingEvent?: boolean
}>()
const emit = defineEmits(['click-add-schedule'])
const { state } = useSidebar() 
</script>

<template>
  <Sidebar 
    side="right" 
    collapsible="icon" 
    class="border-l border-croffle-border bg-croffle-sidebar w-[320px] group-data-[collapsible=icon]:w-15"
  >
    <SidebarHeader class="p-4 pb-0 bg-croffle-sidebar">
      <div class="flex items-center mb-2 h-10 group-data-[collapsible=icon]:justify-center" :class="state === 'expanded' ? 'justify-between' : 'justify-center'">
        <div class="space-y-1 text-left overflow-hidden group-data-[collapsible=icon]:hidden transition-all duration-300">
          <h2 class="text-lg font-bold text-croffle-text-dark whitespace-nowrap">
            일정 관리
          </h2>
          <p class="text-xs text-croffle-text whitespace-nowrap">
            오늘의 일정과 계획
          </p>
        </div>

      <SidebarTrigger 
          class="text-muted-foreground bg-transparent border-none shadow-none ring-0 ring-offset-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div class="h-px bg-croffle-border w-full mb-2 group-data-[collapsible=icon]:hidden"></div>
    </SidebarHeader>

    <SidebarContent class="p-4 pt-0 gap-6 overflow-hidden bg-croffle-sidebar">
      <div class="mt-2 flex justify-center">
        <Button 
          @click="emit('click-add-schedule')"
          class="bg-croffle-primary text-white shadow-sm font-medium transition-all duration-300 border-none 
          w-full h-11 rounded-lg
          hover:bg-croffle-hover 
          group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0"
        >
          <Plus class="w-5 h-5 transition-all" :class="state === 'expanded' ? 'mr-1' : ''" />
          <span class="group-data-[collapsible=icon]:hidden">새 일정 추가</span>
        </Button>
      </div>

      <div class="flex flex-col gap-4 group-data-[collapsible=icon]:hidden animate-in fade-in duration-300">
        <Card class="bg-white/80 border border-croffle-border shadow-sm rounded-xl overflow-hidden">
          <CardHeader class="px-4 pt-0 pb-2 space-y-0">
            <CardTitle class="flex items-center gap-2 text-sm font-bold text-croffle-text-dark">
              <Calendar class="w-4 h-4" />
              <span>오늘의 일정</span>
              <Badge class="bg-croffle-sidebar text-croffle-text-dark ml-auto h-5 px-1.5 rounded-md">
                {{ todayCount || 0 }}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent class="h-25 flex items-center justify-center text-sm text-croffle-text">
            <span v-if="!hasTodayEvent">오늘 일정이 없습니다</span>
            <span v-else>일정 리스트</span>
          </CardContent>
        </Card>

        <Card class="bg-white/80 border border-croffle-border shadow-sm rounded-xl overflow-hidden">
          <CardHeader class="px-4 pt-0 pb-2 space-y-0">
            <CardTitle class="flex items-center gap-2 text-sm font-bold text-croffle-text-dark">
              <Clock class="w-4 h-4" />
              <span>다가오는 일정</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="h-25 flex items-center justify-center text-sm text-croffle-text">
            다가오는 일정이 없습니다
          </CardContent>
        </Card>
      </div>
    </SidebarContent>

    <SidebarFooter class="p-4 flex flex-col items-center justify-center bg-croffle-sidebar">
      <div class="bg-white/50 border border-croffle-border w-full rounded-xl p-4 flex flex-col items-center justify-center shadow-sm mb-4 
                  group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:p-0">
        <Home class="w-6 h-6 text-croffle-primary mb-1 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5" />
        <div class="text-center group-data-[collapsible=icon]:hidden">
            <h4 class="font-bold text-croffle-text-dark text-xs tracking-wider">CROFFLE</h4>
            <span class="text-[10px] text-croffle-text">v 버전 추가해야함</span>
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>