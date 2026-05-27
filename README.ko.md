<div align="center">
  <img src="./.github/contents/icon.png" width="150" />

# CROFFLE

> 필요한 모든 기능을 하나로 묶는, 확장 가능한 데스크톱 생산성 플랫폼

[![to_en_readme](https://img.shields.io/badge/ENG-README-018EF5?style=for-the-badge&logo=readme&logoColor=white)](./README.md)

![License](https://img.shields.io/badge/license-MIT-green) ![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&style=flat&logoColor=white) ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

</div>

**Croffle**은 단순한 일정 관리 도구를 넘어, 사용자가 직접 필요한 기능을 추가하고, 업무 흐름을 자동화할 수 있는 **오픈소스 데스크톱 애플리케이션**입니다.

우리는 사용자가 자신만의 생산성 환경을 구축할 수 있도록 **강력한 플러그인 시스템**을 제공합니다. 캘린더와 할 일 관리(To-Do)를 기본으로, 여러분의 상상력에 따라 무한히 확장해 보세요. Electron을 기반으로 Windows, macOS, Linux 어디서나 동일하고 강력한 경험을 제공합니다.

---

## ✨ 주요 기능 (Key Features)

### 📅 올인원 라이프 매니지먼트 (All-in-One Management)

- **통합 뷰**: 일정(Schedule)과 해야 할 일(To-do)을 하나의 타임라인에서 직관적으로 관리하세요.
- **유연한 태그 시스템**: 태그를 통해 모든 작업을 효율적으로 분류하고 필터링할 수 있습니다.
- **데스크톱 최적화**: 넓은 화면과 단축키를 활용한 쾌적한 데스크톱 경험을 제공합니다.

### 📦 무한한 확장성 (Plugin System)

- **간편한 설치**: 복잡한 파일 이동 없이, **GitHub를 통해** 새로운 기능을 즉시 설치할 수 있습니다.
- **나만의 도구**: 타이머, 습관 추적기, 메모장 등 필요한 기능만 골라 설치하여 앱을 가볍고 강력하게 유지하세요.
- **완벽한 제어**: 설치된 플러그인은 클릭 한 번으로 언제든 켜고 끌 수 있습니다.

### 🤖 워크플로우 자동화 (Automation)

- 단순한 알림을 넘어, 일정이 시작될 때 특정 애플리케이션을 실행하거나 외부 서비스를 호출하는 등 나만의 자동화 루틴을 구축할 수 있습니다.

---

## 🚀 시작하기 (Getting Started)

### 설치 (Installation)

최신 릴리즈 페이지([Latest Release Page](https://github.com/team-croffle/croffle/releases/latest))에서 운영체제에 맞는 설치 파일을 다운로드하세요.

- [Windows 다운로드 (.exe)](https://github.com/team-croffle/croffle/releases/download/v1.0.0/croffle-1.0.0-setup.exe)
- [macOS 다운로드 (.dmg)](https://github.com/team-croffle/croffle/releases/download/v1.0.0/croffle-1.0.0.dmg)
- [Linux 다운로드 (.AppImage)](https://github.com/team-croffle/croffle/releases/download/v1.0.0/croffle-1.0.0.AppImage)

### 플러그인 사용 방법

1. Croffle을 실행하고 **설정 > 플러그인** 메뉴로 이동합니다.
2. '플러그인 설치' 버튼을 클릭합니다.
3. 설치하고 싶은 플러그인의 **GitHub Repository URL**을 입력합니다.
   - 예: `https://github.com/username/my-croffle-plugin`
   - 또는, 다운로드/빌드된 파일들의 `.zip` 파일을 선택합니다.
4. 설치가 완료되면 플러그인을 활성화하여 바로 사용합니다.

---

## 👩‍💻 개발자 가이드 (For Developers)

### 프로젝트 빌드 및 실행

이 프로젝트는 Yarn을 사용하여 관리됩니다. 진행하기 전에 Yarn이 설치되어 있는지 확인하세요.

```bash
# 1. 저장소 클론
git clone https://github.com/team-croffle/croffle.git
cd croffle

# 2. 의존성 설치
yarn install --immutable

# 3. 개발 모드 실행
yarn dev
```

### 플러그인 개발

Croffle의 플러그인은 표준 웹 기술을 사용하여 개발할 수 있습니다. 개발한 플러그인을 공개 GitHub 저장소에 올리기만 하면, 전 세계 사용자가 설치하여 사용할 수도 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Runtime:** Electron
- **Renderer(Frontend):** Vue.js 3, Vite, TailwindCSS
- **Language:** TypeScript
- **Database:** SQLite, TypeORM

---

### 🤝 기여하기 (Contributing)

Croffle은 오픈소스 프로젝트입니다. 버그 제보, 기능 제안, PR은 언제나 환영합니다!

1. 이 저장소를 Fork 합니다.
2. 새로운 Feature 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`).
3. 변경 사항을 Commit 합니다 (`git commit -m 'Add some AmazingFeature'`).
4. Branch에 Push 합니다 (`git push origin feature/AmazingFeature`).
5. Pull Request를 요청합니다.

---

## 📄 라이선스 (License)

이 프로젝트는 **MIT License**에 따라 배포됩니다. 누구나 자유롭게 사용, 수정, 배포할 수 있습니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

Copyright (c) 2026 Croffle Dev. & Croffle Contributors
