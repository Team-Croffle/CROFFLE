# @croffledev/croffle-types

## 1.4.2

### Patch Changes

- c5a0fcd: Address Dependabot/npm advisories in CLI templates and shared type package deps.

  - Plugin templates (vanilla / Vue / React): upgrade Vite to `^8.2.1` (and matching plugins), TypeScript to `6.0.3`, and pin `@croffledev/croffle-types` to `^1.4.1` instead of `latest`
  - `@croffledev/croffle-types`: bump `@types/node` to `^26.2.0`

  ***

## 1.4.1

### Patch Changes

- 076d5aa: Add an attribute to Schedule for features to develeoped later

## 1.4.0

### Minor Changes

- 9e6331c: Add priority column in schedule

## 1.3.0

### Minor Changes

- f7dcae4: Schedule dates use Date instead of ISO strings, and host-only UI types are no longer exported from croffle-types.

## 1.2.0

### Minor Changes

- 64c01d2: Introduce CroffleManifest with contributes and extension-scoped storage APIs.

  Replace features with contributes, trim AppEventType to domain mutations, and bind storage/session/configuration on ExtensionContext.

## 1.1.3

### Patch Changes

- 250dac6: integrated monorepo
