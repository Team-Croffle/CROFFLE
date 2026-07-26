<div align="center">
  <img src="./.github/contents/icon.png" width="150" />

# CROFFLE

> An extensible desktop productivity platform that unifies everything you need

[![to_ko_readme](<https://img.shields.io/badge/KOR(%ED%95%9C%EA%B5%AD%EC%96%B4)-README-018EF5?style=for-the-badge&logo=readme&logoColor=white>)](./README.ko.md)

![License](https://img.shields.io/badge/license-MIT-green) ![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&style=flat&logoColor=white) ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

</div>

**Croffle** is an open-source **desktop application** designed to go beyond simple schedule management. It empowers users to add custom features and automate workflows directly within the app.

We provide a **powerful plugin system** that lets you build your own productivity environment. Starting with Calendar and To-Do management, you can extend Croffle to fit your workflow. Built on Electron, it runs on Windows, macOS, and Linux.

---

## Key Features

### All-in-One Life Management

- **Unified View**: Manage **Schedules** and **To-dos** on a single timeline.
- **Flexible Tagging**: Categorize and filter work with tags.
- **Desktop Optimized**: Built for large screens and keyboard-driven use.

### Plugin System

- **Easy Installation**: Install plugins from **GitHub** or a local `.zip`.
- **Your Own Toolkit**: Add only what you need (timers, habit trackers, notes, …).
- **Full Control**: Enable or disable plugins anytime.

### Workflow Automation

- Go beyond reminders—hook into app events to drive automations and integrations.

---

## Getting Started

### Installation

Download the latest build from the [Releases](https://github.com/team-croffle/croffle/releases/latest) page.

| Platform | Artifacts                           |
| -------- | ----------------------------------- |
| Windows  | `.exe` installer (x64)              |
| macOS    | `.dmg` / `.zip` (arm64)             |
| Linux    | `.AppImage` / `.deb` / `.rpm` (x64) |

> Exact filenames include the version and architecture (for example `croffle-1.0.2-arm64.dmg`).

### Using plugins

1. Open **Settings → Plugins**.
2. Choose **Install Plugin**.
3. Paste a **GitHub repository URL**, or pick a built plugin `.zip`.
4. Enable the plugin after install.

---

## For Developers

This repository is a **pnpm monorepo**.

```text
apps/desktop          Electron app (main / preload / renderer)
packages/types        @croffledev/croffle-types (publishable)
packages/cli          @croffledev/croffle-cli (publishable)
```

```bash
git clone https://github.com/team-croffle/croffle.git
cd croffle
pnpm install
pnpm dev
```

Requirements: **Node.js ≥ 24**, **pnpm** (via Corepack).

- Plugin scaffolding: [`@croffledev/croffle-cli`](./packages/cli/README.md)
- Types for plugins: [`@croffledev/croffle-types`](./packages/types/README.md)
- Full contribution guide: **[CONTRIBUTING.md](./CONTRIBUTING.md)** · [한국어](./CONTRIBUTING.ko.md)

---

## Tech Stack

- **App:** Electron, Vue 3, Vite, Tailwind CSS, TypeScript
- **Data:** SQLite (`better-sqlite3`), TypeORM
- **Monorepo:** pnpm workspaces, Changesets
- **Quality:** oxlint, oxfmt, husky

---

## Contributing

Bug reports, ideas, and PRs are welcome. See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for setup, PR templates, labels, and release notes.

---

## License

MIT — see `LICENSE`.

Copyright (c) 2026 Croffle Dev. & Croffle Contributors
