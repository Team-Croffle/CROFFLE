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
  <Sidebar collapsible="icon" class="border-r border-neutral-000 !bg-[#faf9f7]">
    
    <SidebarHeader 
      class="flex flex-col border-b border-neutral-000 relative transition-all duration-200"
      :class="[isSidebarExpanded ? 'p-4' : 'p-4 items-center']"
    >
      <div 
        class="flex items-center gap-[0.75rem] w-full"
        :class="{ 'flex-col justify-center': !isSidebarExpanded }"
      >
        <div class="flex w-8 h-8 shrink-0 items-center justify-center overflow-hidden">
          <img :src="logoImg" alt="Croffle Logo" class="w-full h-full object-contain" />
        </div>
        
        <div v-if="isSidebarExpanded" class="flex flex-col gap-[0.125rem]">
          <span class="text-[0.75rem] font-bold leading-none text-[#666]">CROFFLE</span>
          <span class="text-[0.65rem] leading-none text-[#999]">할일 달력</span>
        </div>

        <SidebarTrigger 
          class="text-[#999] !bg-transparent !border-none !shadow-none"
          :class="[isSidebarExpanded ? 'absolute top-[0.75rem] right-[0.75rem]' : 'relative mt-[0.75rem]']" 
        />
      </div>
    </SidebarHeader>

    <div v-if="isSidebarExpanded" class="px-4 pt-[0.75rem] pb-[0.5rem] text-[0.7rem] font-semibold text-[#999] uppercase tracking-[0.05em]">
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
                class="mx-2 rounded-[0.5rem] transition-all duration-200 !bg-transparent hover:!bg-[#f0eeeb]"
                :class="{ '!bg-[#e8aa6f] hover:!bg-[#e8aa6f]': item.active }"
                :tooltip="item.title" 
              >
                <a :href="item.url" class="flex items-center gap-[0.75rem] w-full px-4 py-[0.625rem]">
                  <component 
                    :is="item.icon" 
                    class="w-5 h-5 shrink-0 text-[#666]" 
                    :class="{ '!text-white': item.active }" 
                  />
                  
                  <div v-if="isSidebarExpanded" class="flex flex-col gap-[0.125rem]">
                    <span class="text-[0.875rem] font-medium leading-[1.2] text-[#333]" :class="{ '!text-white': item.active }">
                      {{ item.title }}
                    </span>
                    <span class="text-[0.7rem] leading-none text-[#999]" :class="{ '!text-white/80': item.active }">
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

    <SidebarFooter class="border-t border-neutral-000 p-[0.75rem] bg-[#faf9f7]">
      <div 
        class="flex items-center justify-around gap-[0.5rem]" 
        :class="{ 'flex-col': !isSidebarExpanded }"
      >
        <SidebarMenuButton 
          size="sm" 
          class="relative p-2 transition-colors !bg-transparent hover:!bg-[#f0eeeb] !border-none !shadow-none [--sidebar-accent:transparent]"
          tooltip="알림"
        >
          <Bell class="w-5 h-5 text-[#666]" />
        </SidebarMenuButton>
        
        <SidebarMenuButton 
          size="sm" 
          class="relative p-2 transition-colors !bg-transparent hover:!bg-[#f0eeeb] !border-none !shadow-none [--sidebar-accent:transparent]"
          tooltip="설정"
        >
          <Settings class="w-5 h-5 text-[#666]" />
        </SidebarMenuButton>
        
        <SidebarMenuButton 
          size="sm" 
          class="relative p-2 transition-colors !bg-transparent hover:!bg-[#f0eeeb] !border-none !shadow-none [--sidebar-accent:transparent]"
          tooltip="도움말"
        >
          <CircleHelp class="w-5 h-5 text-[#666]" />
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