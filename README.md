<div align="center">
  <img src="./icons/Logo2Only.png" width="150" />

# CROFFLE

> An extensible desktop productivity platform that unifies everything you need

[![to_ko_readme](<https://img.shields.io/badge/KOR(%ED%95%9C%EA%B5%AD%EC%96%B4)-README-018EF5?style=for-the-badge&logo=readme&logoColor=white>)](./README.ko.md)

![License](https://img.shields.io/badge/license-MIT-green) ![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&style=flat&logoColor=white) ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

</div>

**Croffle** is an open-source **desktop application** designed to go beyond simple schedule management. It empowers users to add custom features and automate workflows directly within the app.

We provide a **powerful plugin system** that allows you to build your own productivity environment. Starting with robust Calendar and To-Do management, you can extend Croffle infinitely according to your imagination. Built on Electron, it offers a consistent and powerful experience across Windows, macOS, and Linux.

---

## ✨ Key Features

### 📅 All-in-One Life Management

- **Unified View**: Manage your **Schedules** and **To-dos** intuitively on a single timeline.
- **Flexible Tagging**: Efficiently categorize and filter all your tasks with a versatile tagging system.
- **Desktop Optimized**: Enjoy a seamless desktop experience optimized for large screens and keyboard shortcuts.

### 📦 Infinite Extensibility (Plugin System)

- **Easy Installation**: Install new features instantly **via GitHub** without complex file transfers.
- **Your Own Toolkit**: Install only the plugins you need—such as timers, habit trackers, or memo pads—to keep the app lightweight yet powerful.
- **Full Control**: Enable or disable installed plugins at any time with a single click.

### 🤖 Workflow Automation

- Go beyond simple notifications. Create personalized automation routines, such as launching specific applications or calling external services when an event starts.

---

## 🚀 Getting Started

### Installation

Download the installer for your operating system from the [Latest Release Page](#).

- [Windows Download (.exe)](#)
- [macOS Download (.dmg)](#)
- [Linux Download (.AppImage)](#)

### How to Use Plugins

1. Open Croffle and navigate to **Settings > Plugins**.
2. Click the **'Install Plugin'** button.
3. Enter the **GitHub Repository URL** of the plugin you wish to install.
   - Example: `https://github.com/username/my-croffle-plugin`
   - Alternatively, select a `.zip` file containing the downloaded or built plugin files.
4. Once installed, activate the plugin to use it immediately.

---

## 👩‍💻 For Developers

### Build and Run

This project is managed using `npm` and `TurboRepo`.

```bash
# 1. Clone the repository
git clone [https://github.com/croffledev/croffle.git](https://github.com/croffledev/croffle.git)
cd croffle

# 2. Install dependencies
npm install

# 3. Build 'common' workspace to define types for development
npm run build --workspace=@croffledev/croffle-common

# 4. Run in development mode
npm run dev

# (4. Alternatively, run renderer and main processes separately)
# Terminal 1
cd ./app/renderer
npm run dev
# Terminal 2
cd ./app/main
npm run dev
```

### Plugin Development

Croffle plugins can be developed using standard web technologies. Once you push your developed plugin to a public GitHub repository, users worldwide can install and use it.

---

## 🛠️ Tech Stack

- **Runtime:** Electron
- **Renderer(Frontend):** Vue.js 3, Vite, TailwindCSS
- **Language:** TypeScript
- **Database:** SQLite, TypeORM

---

### 🤝 Contributing

Croffle is an open-source project. Bug reports, feature suggestions, and Pull Requests are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the **MIT License**. You are free to use, modify, and distribute it. See the `LICENSE` file for details.

Copyright (c) 2026 Croffle Dev. & Croffle Contributors
