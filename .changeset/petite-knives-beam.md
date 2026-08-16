---
'@croffledev/croffle-cli': patch
'@croffledev/croffle-types': patch
---

Address Dependabot/npm advisories in CLI templates and shared type package deps.

- Plugin templates (vanilla / Vue / React): upgrade Vite to `^8.2.1` (and matching plugins), TypeScript to `6.0.3`, and pin `@croffledev/croffle-types` to `^1.4.1` instead of `latest`
- `@croffledev/croffle-types`: bump `@types/node` to `^26.2.0`

---
