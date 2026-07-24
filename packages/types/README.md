# @croffledev/croffle-types

<div align="center">
<img src="./.github/content/Logo2Only.png" width="120" />

# Croffle Types

> Official TypeScript definitions for CROFFLE plugin development

</div>

**@croffledev/croffle-types** provides the essential type definitions and interfaces required to build, extend, and integrate plugins for the [CROFFLE](https://www.google.com/search?q=https://github.com/croffledev/croffle) ecosystem.

By using this package, developers can ensure type safety and leverage IntelliSense when interacting with the Croffle Core API, IPC events, and the plugin lifecycle.

---

## 📦 Installation

This package should be installed as a **development dependency** in your plugin project.

```bash
# Using npm
npm install -D @croffledev/croffle-types

# Using yarn
yarn add -D @croffledev/croffle-types

# Using pnpm
pnpm add -D @croffledev/croffle-types
```

---

## 🛠️ Usage

### Basic Plugin Definition

Import the types to define your plugin structure. This ensures your plugin correctly implements the required lifecycle hooks and metadata.

```typescript
import type { ICrofflePlugin, PluginContext } from "@croffledev/croffle-types";

const myPlugin: ICrofflePlugin = {
  name: "MyAwesomePlugin",
  version: "1.0.0",

  onLoad(context: PluginContext) {
    console.log("Croffle Plugin Loaded!", context.appVersion);
  },

  onUnload() {
    console.log("Cleaning up...");
  },
};

export default myPlugin;
```

### Type Augmentation (Optional)

If your plugin extends the global `window` object or adds custom IPC channels, you can use these types to maintain a robust development environment.

---

## 📖 Key Definitions

| Type / Interface | Description                                                                    |
| :--------------- | :----------------------------------------------------------------------------- |
| `ICrofflePlugin` | The base interface for every Croffle plugin.                                   |
| `PluginContext`  | Provides access to Croffle's internal APIs (Database, Storage, Notifications). |
| `BridgeAPI`      | Types for IPC communication between the Renderer and Main process.             |
| `ThemeConfig`    | Interfaces for accessing Croffle's CSS variables and theme state.              |

---

## 👩‍💻 For Contributors

If you want to contribute to the type definitions or add support for new Core APIs:

1.  Fork the [Croffle Main Repository](https://www.google.com/search?q=https://github.com/croffledev/croffle).
2.  Navigate to the types workspace (or this standalone repo).
3.  Update `index.d.ts`.
4.  Submit a Pull Request with a clear description of the changes.

---

## 📄 License

This package is distributed under the **MIT License**.

Copyright (c) 2026 **Croffle Dev.** & Croffle Contributors
