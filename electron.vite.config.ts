import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import swc from 'unplugin-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  main: {
    build: {
      externalizeDeps: true,
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
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
      },
    },
    plugins: [vue(), tailwindcss()],
  },
});
