<div align="center">
  <img src="./.github/contents/icon.png" width="150" />

# CROFFLE

> 필요한 모든 기능을 하나로 묶는, 확장 가능한 데스크톱 생산성 플랫폼

[![to_en_readme](https://img.shields.io/badge/ENG-README-018EF5?style=for-the-badge&logo=readme&logoColor=white)](./README.md)

![License](https://img.shields.io/badge/license-MIT-green) ![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&style=flat&logoColor=white) ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

</div>

**Croffle**은 단순한 일정 관리를 넘어, 필요한 기능을 직접 추가하고 업무 흐름을 자동화할 수 있는 **오픈소스 데스크톱 애플리케이션**입니다.

**확장(extension) 시스템**으로 캘린더·할 일(To-Do)을 기반으로 자신만의 생산성 환경을 만들 수 있습니다. Electron 기반이며 Windows, macOS, Linux에서 동일하게 동작합니다.

---

## 주요 기능

### 올인원 라이프 매니지먼트

- **통합 뷰**: 일정과 할 일을 하나의 타임라인에서 관리
- **태그**: 작업을 분류·필터링
- **데스크톱 최적화**: 넓은 화면과 단축키에 맞춘 UX

### 확장

- **간편 설치**: GitHub URL 또는 로컬 `.zip`
- **필요한 것만**: 타이머, 습관 추적, 메모 등
- **켜고 끄기**: 설치 후 언제든 활성화/비활성화

### 워크플로우 자동화

- 단순 알림을 넘어 앱 이벤트에 반응하는 자동화·연동

---

## 시작하기

### 설치

[Releases](https://github.com/team-croffle/croffle/releases/latest)에서 OS에 맞는 파일을 받으세요.

| 플랫폼  | 산출물                              |
| ------- | ----------------------------------- |
| Windows | `.exe` 설치 파일 (x64)              |
| macOS   | `.dmg` / `.zip` (arm64)             |
| Linux   | `.AppImage` / `.deb` / `.rpm` (x64) |

> 파일명에는 버전·아키텍처가 포함됩니다 (예: `croffle-1.0.2-arm64.dmg`).

### 확장 사용

1. **설정 → 확장**으로 이동
2. **확장 설치** 선택
3. **GitHub 저장소 URL** 입력 또는 `.zip` 선택
4. 설치 후 활성화

---

## 개발자

이 저장소는 **pnpm 모노레포**입니다.

```text
apps/desktop          Electron 앱 (main / preload / renderer)
packages/types        @croffledev/croffle-types (배포)
packages/cli          @croffledev/croffle-cli (배포)
```

```bash
git clone https://github.com/team-croffle/croffle.git
cd croffle
pnpm install
pnpm dev
```

요구 사항: **Node.js ≥ 24**, **pnpm** (Corepack 권장).

- 확장 스캐폴딩: [`@croffledev/croffle-cli`](./packages/cli/README.md)
- 확장 타입: [`@croffledev/croffle-types`](./packages/types/README.md)
- 기여 가이드: **[CONTRIBUTING.ko.md](./CONTRIBUTING.ko.md)** · [English](./CONTRIBUTING.md)

---

## 기술 스택

- **앱:** Electron, Vue 3, Vite, Tailwind CSS, TypeScript
- **데이터:** SQLite (`better-sqlite3`), TypeORM
- **모노레포:** pnpm workspaces, Changesets
- **품질:** oxlint, oxfmt, husky

---

## 기여하기

버그 제보, 아이디어, PR을 환영합니다. 자세한 내용은 **[CONTRIBUTING.ko.md](./CONTRIBUTING.ko.md)**를 참고하세요.

---

## 라이선스

MIT — `LICENSE` 참고.

Copyright (c) 2026 Croffle Dev. & Croffle Contributors
