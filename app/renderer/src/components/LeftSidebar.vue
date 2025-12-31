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

// 사이드바 상태 가져오기 (펼쳐짐/접힘)
const { state } = useSidebar()

// 사이드바가 펼쳐져 있는지 확인 (true/false)
const isSidebarExpanded = computed(() => state.value === 'expanded')

const menuItems = computed(() => DEFAULT_MENU_ITEMS);
</script>

<template>
  <!-- 사이드바 전체 컨테이너 -->
  <Sidebar collapsible="icon" class="border-r border-[#e8e6e3]">
    
    <!-- 상단 헤더 영역 (로고 + 타이틀 + 접기 버튼) -->
    <SidebarHeader class="header-section">
      <div class="header-content">
        <!-- 로고 아이콘 -->
        <div class="logo-circle">
          C
        </div>
        
        <!-- 타이틀 텍스트 (사이드바가 펼쳐졌을 때만 보임) -->
        <div v-if="isSidebarExpanded" class="title-text">
          <span class="title-main">CROFFLE</span>
          <span class="title-sub">할일 달력</span>
        </div>
      </div>
      
      <!-- 접기 버튼 (항상 오른쪽 상단에 표시) -->
      <SidebarTrigger class="collapse-button" />
    </SidebarHeader>

    <!-- 메뉴 카테고리 제목 -->
    <div v-if="isSidebarExpanded" class="menu-category">
      메인 메뉴
    </div>

    <!-- 중간 메뉴 영역 -->
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <!-- 각 메뉴 아이템 반복 -->
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton 
                as-child 
                size="lg" 
                class="menu-button"
                :class="{ 'menu-active': item.active }"
                :tooltip="item.title" 
              >
                <a :href="item.url" class="menu-link">
                  <!-- 메뉴 아이콘 -->
                  <component 
                    :is="item.icon" 
                    class="menu-icon" 
                    :class="{ 'icon-active': item.active }" 
                  />
                  
                  <!-- 메뉴 텍스트 (사이드바가 펼쳐졌을 때만 보임) -->
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

    <!-- 하단 푸터 영역 (알림, 설정, 도움말) -->
    <SidebarFooter class="footer-container">
      <div class="footer-buttons" :class="{ 'footer-collapsed': !isSidebarExpanded }">
        
        <!-- 알림 버튼 -->
        <SidebarMenuButton size="sm" class="footer-button" tooltip="알림">
          <div class="footer-button-content">
            <Bell class="footer-icon" />
          </div>
        </SidebarMenuButton>
        
        <!-- 설정 버튼 -->
        <SidebarMenuButton size="sm" class="footer-button" tooltip="설정">
          <Settings class="footer-icon" />
        </SidebarMenuButton>
        
        <!-- 도움말 버튼 -->
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

/* 헤더 섹션 */
.header-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #e8e6e3;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* 로고 원형 스타일 */
.logo-circle {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: linear-gradient(to bottom right, #f5a962, #e89550);
  color: white;
  font-weight: bold;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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

/* 접기 버튼 */
.collapse-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: #999;
}

/* 메뉴 카테고리 제목 */
.menu-category {
  padding: 0.75rem 1rem 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 메뉴 링크 */
.menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
}

/* 메뉴 버튼 스타일 */
.menu-button {
  margin: 0 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.menu-button:hover {
  background-color: #f0eeeb;
}

/* 활성화된 메뉴 스타일 */
.menu-active {
  background-color: #e8aa6f !important;
}

.menu-active:hover {
  background-color: #e8aa6f !important;
}

/* 메뉴 아이콘 */
.menu-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #666;
}

.icon-active {
  color: white !important;
}

/* 메뉴 텍스트 */
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

/* 푸터 컨테이너 */
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

.footer-button {
  position: relative;
  padding: 0.5rem;
  transition: background-color 0.2s;
}

.footer-button:hover {
  background-color: #f0eeeb;
}

.footer-button-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-icon {
  width: 20px;
  height: 20px;
  color: #666;
}
</style>