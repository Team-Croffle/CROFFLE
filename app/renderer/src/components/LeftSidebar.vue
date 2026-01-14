<script setup lang="ts">
import { computed } from 'vue';
import { DEFAULT_MENU_ITEMS } from '@/data/dummyMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { Bell, CircleHelp, Settings } from 'lucide-vue-next'
import logoImg from '@/assets/Logo2Only.png';

const { state } = useSidebar()
const isSidebarExpanded = computed(() => state.value === 'expanded')
const menuItems = computed(() => DEFAULT_MENU_ITEMS);
</script>

<template>
  <Sidebar 
  collapsible="icon" class="border-r">
    
    <SidebarHeader 
      class="flex flex-col border-b relative transition-all duration-200"
      :class="[isSidebarExpanded ? 'p-4' : 'p-4 items-center']"
    >
      <div 
        class="flex items-center gap-3 w-full"
        :class="{ 'flex-col justify-center': !isSidebarExpanded }"
      >
        <div class="flex w-8 h-8 shrink-0 items-center justify-center overflow-hidden">
          <img :src="logoImg" alt="Croffle Logo" class="w-full h-full object-contain" />
        </div>
        
        <div v-if="isSidebarExpanded" class="flex flex-col gap-0.5">
          <span class="text-xs font-bold leading-none text-yellow-600">CROFFLE</span>
          <span class="text-[10px] leading-none text-muted-foreground">할일 달력</span>
        </div>

        <SidebarTrigger 
          class="text-muted-foreground !bg-transparent !border-none !shadow-none !ring-0 !ring-offset-0 !outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0"
          :class="[isSidebarExpanded ? 'absolute top-3 right-3' : 'relative mt-3']" 
        />
      </div>
    </SidebarHeader>

    <div v-if="isSidebarExpanded" class="pl-4 pr-0 pt-3 pb-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-left w-full">
      메인 메뉴
    </div>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton 
                as-child 
                size="lg" 
                class="rounded-lg transition-all duration-200 !bg-transparent hover:!bg-gray-100 !ring-0 !outline-none"
                :class="[
                  { '!bg-[#e8aa6f] hover:!bg-[#e8aa6f]': item.active },
                  isSidebarExpanded ? 'ml-0 mr-2' : 'mx-0 justify-center'
                ]"
                :tooltip="item.title" 
              >
                <a 
                  :href="item.url" 
                  class="flex items-center w-full py-2.5"
                  :class="[isSidebarExpanded ? 'px-4 gap-3' : 'justify-center px-0']"
                >
                  <component 
                    :is="item.icon" 
                    class="w-5 h-5 shrink-0 text-muted-foreground" 
                    :class="{ '!text-white': item.active }" 
                  />
                  
                  <div v-if="isSidebarExpanded" class="flex flex-col gap-0.5">
                    <span class="text-sm font-medium leading-tight text-gray-800" :class="{ '!text-white': item.active }">
                      {{ item.title }}
                    </span>
                    <span class="text-[11px] leading-none text-muted-foreground" :class="{ '!text-white/80': item.active }">
                      {{ item.subtitle }}
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t p-3">
      <div 
        class="flex items-center justify-around gap-2" 
        :class="{ 'flex-col': !isSidebarExpanded }"
      >
        <SidebarMenuButton 
          size="sm" 
          class="flex h-9 w-9 items-center justify-center aspect-square transition-colors !bg-transparent hover:!bg-gray-100 !border-none !shadow-none !ring-0 !ring-offset-0 !outline-none focus:!ring-0 focus-visible:!ring-0 [--sidebar-accent:transparent]"
          tooltip="알림"
        >
          <Bell class="w-5 h-5 text-muted-foreground" />
        </SidebarMenuButton>
        
        <SidebarMenuButton 
          size="sm" 
          class="flex h-9 w-9 items-center justify-center aspect-square transition-colors !bg-transparent hover:!bg-gray-100 !border-none !shadow-none !ring-0 !ring-offset-0 !outline-none focus:!ring-0 focus-visible:!ring-0 [--sidebar-accent:transparent]"
          tooltip="설정"
        >
          <Settings class="w-5 h-5 text-muted-foreground" />
        </SidebarMenuButton>
        
        <SidebarMenuButton 
          size="sm" 
          class="flex h-9 w-9 items-center justify-center aspect-square transition-colors !bg-transparent hover:!bg-gray-100 !border-none !shadow-none !ring-0 !ring-offset-0 !outline-none focus:!ring-0 focus-visible:!ring-0 [--sidebar-accent:transparent]"
          tooltip="도움말"
        >
          <CircleHelp class="w-5 h-5 text-muted-foreground" />
        </SidebarMenuButton>
      </div>
    </SidebarFooter>
  </Sidebar>
</template>

<style scoped>
:deep(.bg-sidebar) {
  background-color: #faf9f7 !important;
}
</style>