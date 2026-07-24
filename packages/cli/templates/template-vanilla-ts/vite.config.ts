import { copyFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
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
  },
});
