## Summary

<!-- 1–3 bullets: what changed and why (not a file list). -->

-

## Type of change

- [ ] Bug fix
- [ ] Feature
- [ ] Refactor / cleanup
- [ ] Chore (tooling, CI, deps)
- [ ] Docs
- [ ] Breaking change (explain below)

## Package scope

<!-- Check all that apply. Prefer small, package-focused PRs when possible. -->

- [ ] `apps/desktop` — Electron app
- [ ] `packages/types` — `@croffledev/croffle-types` (publishable)
- [ ] `packages/cli` — `@croffledev/croffle-cli` (publishable)
- [ ] Root / workspace (`package.json`, pnpm, Changesets, CI)

## Electron surface

<!-- Skip if this PR does not touch the desktop app. -->

- [ ] Main
- [ ] Preload / host API (`window.croffle`, `window.electron`)
- [ ] Renderer
- [ ] Native / IPC / packaging (`electron-builder`, native modules)

## Related issues

<!-- e.g. Fixes #123 / Relates to #456 — or "N/A" -->

-

## Changes

-

## Breaking changes & migration

<!-- Required if API shape, package exports, or plugin contracts change. Else write "None". -->

-

## Test plan

- [ ] `pnpm typecheck` (or package-filtered equivalent) passes
- [ ] `pnpm lint` / format clean for touched files
- [ ] Built and smoke-tested locally (`pnpm build` / `pnpm dev` as relevant)
- [ ] Desktop: verified on _[ Windows / macOS / Linux ]_ _(if UI or Electron behavior changed)_
- [ ] Publishable package: Changeset added (`pnpm changeset`) _(if `types` / `cli` public API changed)_
- [ ] Screenshots / recording attached _(if UI changed)_

### Manual steps

1.
2.

## Release notes

<!-- For app users / plugin authors. Past tense. Use "none" if not user-facing. -->

Notes:

## Additional notes for reviewers

-
