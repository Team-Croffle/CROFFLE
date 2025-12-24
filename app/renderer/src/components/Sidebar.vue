<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }"> <!--collapsed 상태변수 사용: 사이드바의 펼쳐짐/접힘 상태-->
    <!-- 상단 로고 영역 -->
    <div class="sidebar-header">
      <!-- 펼쳐진 상태: 로고 + 텍스트 -->
      <div class="logo" v-if="!isCollapsed">
        <div class="logo-icon">C</div>
        <span class="logo-text">CROFFLE<br>할일 달력</span>
      </div>
      <!-- 접힌 상태: 로고만 -->
      <div class="logo-icon-only" v-else>C</div>
      <!-- 사이드바 토글 버튼 -->
      <button class="toggle-btn" @click="toggleSidebar">
        {{ isCollapsed ? '›' : '‹' }}
      </button>
    </div>
    
    <!-- 메뉴 리스트 -->
    <nav class="menu-list">
      <!-- 캘린더 메뉴 -->
      <a href="#" class="menu-item" :title="isCollapsed ? '캘린더' : ''">
        <span class="calendar-icon"><CalendarDays /></span>
        <span class="menu-text" v-if="!isCollapsed">
          <div class="menu-title">캘린더</div>
          <div class="menu-subtitle">Calendar</div>
        </span>
      </a>
      <!-- 대시보드 메뉴 -->
      <a href="#" class="menu-item" :title="isCollapsed ? '대시보드' : ''">
        <span class="menu-icon"><ChartLine /></span>
        <span class="menu-text" v-if="!isCollapsed">
          <div class="menu-title">대시보드</div>
          <div class="menu-subtitle">Dashboard</div>
        </span>
      </a>
      <!-- 리포트 메뉴 -->
      <a href="#" class="menu-item" :title="isCollapsed ? '리포트' : ''">
        <span class="menu-icon"><Pencil /></span>
        <span class="menu-text" v-if="!isCollapsed">
          <div class="menu-title">리포트</div>
          <div class="menu-subtitle">Report</div>
        </span>
      </a>
      <!-- 팀 관리 메뉴 -->
      <a href="#" class="menu-item" :title="isCollapsed ? '팀 관리' : ''">
        <span class="menu-icon"><Users /></span>
        <span class="menu-text" v-if="!isCollapsed">
          <div class="menu-title">팀 관리</div>
          <div class="menu-subtitle">Team</div>
        </span>
      </a>
    </nav>

    <!-- 하단 아이콘들 -->
    <div class="sidebar-footer">
      <button class="footer-icon" :title="isCollapsed ? '알림' : ''"><Bell /></button>
      <button class="footer-icon" :title="isCollapsed ? '설정' : ''"><Settings /></button>
      <button class="footer-icon" :title="isCollapsed ? '도움말' : ''"><CircleQuestionMark /></button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Bell, CalendarDays, ChartLine, CircleQuestionMark, Pencil, Settings, Users } from 'lucide-vue-next';
import { ref } from 'vue'; //Vue의 반응형 상태를 만들기 위해 ref 함수를 가져옵

// 사이드바 접힘 상태 관리
const isCollapsed = ref<boolean>(false);

// 사이드바 토글 함수
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
/* 사이드바 기본 스타일 (펼쳐진 상태) */
.sidebar {
  width: 200px;
  min-width: 200px;
  background-color: #faf9f7;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem 0.75rem;
  border-right: 1px solid #e8e6e3;
  overflow-y: auto;
  transition: width 0.3s ease, min-width 0.3s ease;
}

/* 접힌 상태 사이드바 */
.sidebar.collapsed {
  width: 70px;
  min-width: 70px;
  padding: 1rem 0.5rem;
}

/* 상단 로고 영역 컨테이너 */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

/* 접힌 상태: 로고 영역 세로 배치 */
.sidebar.collapsed .sidebar-header {
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* 로고 + 텍스트 컨테이너 */
.logo {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* 로고 원형 아이콘 (펼침/접힘 공통) */
.logo-icon,
.logo-icon-only {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f5a962 0%, #e89550 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

/* 로고 옆 텍스트 (CROFFLE 할일 달력) */
.logo-text {
  font-size: 0.7rem;
  color: #666;
  line-height: 1.3;
  font-weight: 500;
}

/* 사이드바 토글 버튼 (‹ › 버튼) */
.toggle-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

/* 토글 버튼 호버 효과 */
.toggle-btn:hover {
  background-color: #f0eeeb;
  border-radius: 4px;
}

/* 접힌 상태 캘린더 버튼 */
.sidebar.collapsed .calendar-btn {
  padding: 0.6rem;
}

/* 캘린더 아이콘 */
.calendar-icon {
  font-size: 1.3rem;
}

/* 캘린더 버튼 호버 효과 */
.calendar-btn:hover {
  background: linear-gradient(135deg, #e89550 0%, #d68440 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(229, 149, 80, 0.3);
}

/* 메뉴 리스트 컨테이너 */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1; /* 남은 공간 차지 */
}

/* 각 메뉴 아이템 */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  transition: background-color 0.2s ease;
}

/* 접힌 상태: 메뉴 아이템 중앙 정렬 */
.sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 0.75rem 0.25rem;
}

/* 메뉴 아이템 호버 효과 */
.menu-item:hover {
  background-color: #f0eeeb;
}

/* 메뉴 아이콘 */
.menu-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* 메뉴 텍스트 컨테이너 (제목 + 부제목) */
.menu-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

/* 메뉴 제목 (캘린더, 대시보드 등) */
.menu-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

/* 메뉴 부제목 (Calendar, Dashboard 등) */
.menu-subtitle {
  font-size: 0.7rem;
  color: #999;
}

/* 하단 아이콘 영역 */
.sidebar-footer {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #e8e6e3;
  margin-top: auto; /* 하단에 고정 */
}

/* 접힌 상태: 하단 아이콘 세로 배치 */
.sidebar.collapsed .sidebar-footer {
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* 하단 아이콘 버튼 (알림, 설정, 도움말) */
.footer-icon {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 접힌 상태: 하단 아이콘 크기 조정 */
.sidebar.collapsed .footer-icon {
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
}

/* 하단 아이콘 호버 효과 */
.footer-icon:hover {
  background-color: #f0eeeb;
}
</style>