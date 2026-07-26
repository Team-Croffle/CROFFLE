import { copyFileSync, existsSync } from 'node:fs';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'copy-croffle-manifest',
      closeBundle() {
        if (existsSync('croffle-manifest.json')) {
          copyFileSync('croffle-manifest.json', 'dist/croffle-manifest.json');
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
      name: 'Extension',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
});
