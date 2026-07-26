import { copyFileSync, existsSync } from 'node:fs';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-plugin-json',
      closeBundle() {
        if (existsSync('plugin.json')) {
          copyFileSync('plugin.json', 'dist/plugin.json');
        }
      },
    },
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'Plugin',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // Do NOT externalize 'vue' — the extension:// protocol cannot resolve bare imports.
      // Vue must be fully bundled into the plugin's index.js.
    },
  },
});
