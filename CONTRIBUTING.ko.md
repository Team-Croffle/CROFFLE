# Croffle에 기여하기

기여해 주셔서 감사합니다. 이 문서는 모노레포 기준으로 로컬 개발, PR, 릴리스 방법을 정리합니다.

English: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 준비물

- **Node.js ≥ 24**
- **pnpm** (`corepack enable` 권장)
- 데스크톱 앱 빌드 시 네이티브 모듈(`better-sqlite3`)용 OS 툴체인

---

## 저장소 구조

| 경로             | 패키지                      | 설명                  |
| ---------------- | --------------------------- | --------------------- |
| `apps/desktop`   | `@croffledev/desktop`       | Electron 앱 (private) |
| `packages/types` | `@croffledev/croffle-types` | 배포용 타입 정의      |
| `packages/cli`   | `@croffledev/croffle-cli`   | 배포용 확장 CLI       |

데스크톱 호스트 API(preload)는 **도메인 단위 flat** 형태입니다.

```ts
croffle.window;
croffle.calendar.schedules;
croffle.extensions.info;
croffle.extensions.configuration;
croffle.event;
// …
```

용어: 설치 단위는 **extension**. 확장 옵션은 **configuration**, 앱 전역은 **settings**(`croffle.settings`)입니다. 확장 패키지 매니페스트는 `croffle-manifest.json`입니다.

타입은 `@croffledev/croffle-types`, 앱 런타임 enum은 `apps/desktop/src/common` (`@croffledev/common` alias)입니다.

---

## 시작하기

```bash
git clone https://github.com/team-croffle/croffle.git
cd croffle
pnpm install
pnpm dev                 # 데스크톱 개발 모드
```

루트 주요 스크립트:

| 스크립트                      | 용도                          |
| ----------------------------- | ----------------------------- |
| `pnpm dev`                    | 데스크톱 개발 실행            |
| `pnpm build`                  | 데스크톱 빌드 (electron-vite) |
| `pnpm typecheck`              | 워크스페이스 타입체크         |
| `pnpm lint` / `pnpm lint:fix` | oxlint                        |
| `pnpm format`                 | oxfmt                         |
| `pnpm changeset`              | 배포 패키지용 Changeset 추가  |

필터 예시:

```bash
pnpm --filter @croffledev/desktop typecheck
pnpm --filter @croffledev/croffle-cli build
```

---

## Pull Request

1. `master`에서 브랜치를 만듭니다 (`feat/…`, `fix/…`, `refactor/…` 등).
2. 변경 범위를 좁게 유지하고, 가능하면 패키지 단위로 PR을 나눕니다.
3. [`.github/pull_request_template.md`](./.github/pull_request_template.md)에서 템플릿을 선택합니다.
   - Default / refactor / chore
   - Bug fix
   - Feature
4. **package scope**(`desktop` / `types` / `cli`)와 **Electron surface**(main / preload / renderer)를 해당 시 체크합니다.
5. 리뷰 요청 전 `pnpm typecheck`(및 변경 파일 lint)를 통과시킵니다.

### 라벨

[`.github/labeler.yaml`](./.github/labeler.yaml)이 경로·브랜치 prefix에 따라 라벨을 붙입니다. 없는 라벨은 워크플로가 생성할 수 있습니다.

### 커밋 메시지

저장소에서 쓰는 짧은 conventional 스타일을 권장합니다.

- `feat: …`
- `fix: …`
- `refactor: …`
- `chore: …`

---

## npm 패키지 배포

`@croffledev/croffle-types`, `@croffledev/croffle-cli`는 **Changesets**로 배포합니다.

1. 공개 API/동작 변경 후: `pnpm changeset`
2. 머지 후 `master`의 **Publish Packages** 워크플로가 버전 PR을 열거나 publish합니다.

데스크톱(`@croffledev/desktop`)은 npm에 올리지 않습니다.

---

## 데스크톱 앱 릴리스 (GitHub Releases)

설치 파일은 **Croffle Release** 워크플로(`workflow_dispatch`)로만 만듭니다.

1. Actions → **Croffle Release** → **Run workflow**
2. `release_type`: `patch` | `minor` | `major` | `rc`
3. 필요 시 `version`, `version_suffix`(예: `rc.1`) 지정
4. GitHub Releases에 업로드 (코드 서명 없음): Windows `.exe`, macOS arm64 `.dmg`/`.zip`, Linux `.AppImage`/`.deb`/`.rpm`

태그·배포 없이 빌드만 하려면 `dry_run`을 사용하세요.

---

## 플러그인 개발

```bash
pnpm dlx @croffledev/croffle-cli create my-plugin
# 또는
pnpm dlx create-croffle-plugin my-plugin
```

자세한 내용은 [`packages/cli/README.md`](./packages/cli/README.md), 타입은 `@croffledev/croffle-types`(`CroffleAPI`, `PluginContext` 등)를 참고하세요.

---

## 라이선스

**MIT License** (`LICENSE`). 이슈·리뷰에서는 서로 존중해 주세요.
