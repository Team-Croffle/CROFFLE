import type { Component } from 'vue';

export interface MenuItem {
  id: string;            // 각 메뉴를 식별할 고유 ID (플러그인별 고유값)
  title: string;         // 사용자에게 보여줄 한글 제목
  subtitle: string;      // 디자인을 위한 영문 부제목
  icon: Component;       // 표시할 아이콘 컴포넌트
  url: string;           // 클릭 시 이동할 경로
  active?: boolean;      // 현재 활성화 상태 여부 (선택적)
  pluginName?: string;   // 해당 메뉴를 제공하는 플러그인 이름 (관리용)
}