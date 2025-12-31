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
import {
  Bell,
  CircleHelp,
  Settings,
} from 'lucide-vue-next'
import logoImg from '@/assets/Logo2Only.png';

// 사이드바 상태 가져오기 (펼쳐짐/접힘)
const { state } = useSidebar()

// 사이드바가 펼쳐져 있는지 확인 (true/false)
const isSidebarExpanded = computed(() => state.value === 'expanded')

// 더미 데이터 가져오기
const menuItems = computed(() => DEFAULT_MENU_ITEMS);
</script>

<template>
  <Sidebar collapsible="icon" class="border-r border-[#e8e6e3]">
    
    <SidebarHeader class="header-section" :class="{ 'collapsed-header': !isSidebarExpanded }">
      <div class="header-content" :class="{ 'flex-col items-center justify-center': !isSidebarExpanded }">
        <div class="logo-wrapper">
          <img :src="logoImg" alt="Croffle Logo" class="logo-img" />
        </div>
        
        <div v-if="isSidebarExpanded" class="title-text">
          <span class="title-main">CROFFLE</span>
          <span class="title-sub">할일 달력</span>
        </div>

        <SidebarTrigger class="collapse-button" />
      </div>
    </SidebarHeader>

    <div v-if="isSidebarExpanded" class="menu-category">
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
                class="menu-button"
                :class="{ 'menu-active': item.active }"
                :tooltip="item.title" 
              >
                <a :href="item.url" class="menu-link">
                  <component 
                    :is="item.icon" 
                    class="menu-icon" 
                    :class="{ 'icon-active': item.active }" 
                  />
                  
                  <div v-if="isSidebarExpanded" class="menu-text">
                    <span class="menu-title" :class="{ 'title-active': item.active }">
                      {{ item.title }}
                    </span>
                    <span class="menu-subtitle" :class="{ 'subtitle-active': item.active }">
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

    <SidebarFooter class="footer-container">
      <div class="footer-buttons" :class="{ 'footer-collapsed': !isSidebarExpanded }">
        
        <SidebarMenuButton size="sm" class="footer-button" tooltip="알림">
          <div class="footer-button-content">
            <Bell class="footer-icon" />
          </div>
        </SidebarMenuButton>
        
        <SidebarMenuButton size="sm" class="footer-button" tooltip="설정">
          <Settings class="footer-icon" />
        </SidebarMenuButton>
        
        <SidebarMenuButton size="sm" class="footer-button" tooltip="도움말">
          <CircleHelp class="footer-icon" />
        </SidebarMenuButton>
        
      </div>
    </SidebarFooter>
    
  </Sidebar>
</template>


<style scoped>
/* 사이드바 배경색 */
:deep(.bg-sidebar) {
  background-color: #faf9f7 !important;
}

/* --- 헤더 섹션 스타일 --- */
.header-section {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid #e8e6e3;
  position: relative;
  transition: all 0.2s ease;
}

/* 사이드바가 접혔을 때 헤더 패딩 */
.collapsed-header {
  padding: 1rem 0;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

/* 로고 이미지 스타일 */
.logo-wrapper {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 타이틀 텍스트 영역 */
.title-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.title-main {
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1;
  color: #666;
}

.title-sub {
  font-size: 0.65rem;
  line-height: 1;
  color: #999;
}

/* 접기 버튼 위치 제어 */
.collapse-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: #999;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 사이드바가 접혔을 때 로고 아래로 버튼 배치 */
:deep(.collapsed-header) .collapse-button {
  position: relative;
  top: unset;
  right: unset;
  margin-top: 0.75rem; /* 로고 이미지와의 간격 */
}

/* 메뉴 및 푸터 공통 스타일 */
.menu-category {
  padding: 0.75rem 1rem 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
}

.menu-button {
  margin: 0 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.menu-button:hover {
  background-color: #f0eeeb !important;
}

.menu-active {
  background-color: #e8aa6f !important;
}

.menu-active:hover {
  background-color: #e8aa6f !important;
}

.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #666;
}

.icon-active {
  color: white !important;
}

.menu-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.menu-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
}

.title-active {
  color: white !important;
}

.menu-subtitle {
  font-size: 0.7rem;
  color: #999;
  line-height: 1;
}

.subtitle-active {
  color: rgba(255, 255, 255, 0.8) !important;
}

.footer-container {
  border-top: 1px solid #e8e6e3;
  padding: 0.75rem;
  background-color: #faf9f7;
}

.footer-buttons {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 0.5rem;
}

.footer-collapsed {
  flex-direction: column;
}

/* 푸터 버튼 스타일 수정 */
.footer-button {
  position: relative;
  padding: 0.5rem;
  transition: background-color 0.2s;
  /* 기본 배경색 및 그림자 제거 */
  background-color: transparent !important;
  --sidebar-accent: transparent !important;
  --sidebar-primary: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 마우스 호버 시에만 연한 회색 배경 적용 */
.footer-button:hover {
  background-color: #f0eeeb !important;
}

/* shadcn 내부 버튼 구조까지 강제 투명화 */
:deep(.footer-button) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.footer-button:hover) {
  background-color: #f0eeeb !important;
}

.footer-icon {
  width: 20px;
  height: 20px;
  color: #666;
}
</style>