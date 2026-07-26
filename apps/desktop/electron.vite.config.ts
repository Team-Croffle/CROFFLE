import { resolve } from 'node:path';
import { defineConfig } from 'electron-vite';
import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import swc from 'unplugin-swc';
import tailwindcss from '@tailwindcss/vite';

const sharedEntry = resolve(__dirname, '../../packages/shared/src/index.ts');

/** types-only package — provide an empty module so Rolldown can resolve it */
function croffleTypesStub(): Plugin {
  const id = '@croffledev/croffle-types';
  return {
    name: 'croffle-types-stub',
    enforce: 'pre',
    resolveId(source) {
      if (source === id) {
        return id;
      }
      return null;
    },
    load(source) {
      if (source === id) {
        return 'export {}';
      }
      return null;
    },
  };
}

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ['@croffledev/shared'],
      },
    },
    resolve: {
      alias: {
        '@croffledev/shared': sharedEntry,
      },
    },
    plugins: [
      swc.vite({
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            decoratorMetadata: true,
          },
        },
      }),
    ],
  },
  preload: {
    build: {
      externalizeDeps: false,
    },
    resolve: {
      alias: {
        '@croffledev/shared': sharedEntry,
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        '@croffledev/shared': sharedEntry,
      },
    },
    plugins: [croffleTypesStub(), vue(), tailwindcss()],
  },
});
