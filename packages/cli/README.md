# @croffledev/croffle-cli

CLI for scaffolding, building, and packaging Croffle **extensions**.

```bash
pnpm dlx @croffledev/croffle-cli create my-extension
# or
pnpm dlx create-croffle-plugin my-extension
```

```bash
pnpm dlx @croffledev/croffle-cli build
pnpm dlx @croffledev/croffle-cli pack
```

Extension types live in `@croffledev/croffle-types` (`ExtensionContext`, `ExtensionInfo`, …).  
Manifest file is still named `plugin.json` until the manifest redesign.
