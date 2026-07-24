import { copyFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
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
      entry: 'src/index.tsx',
      name: 'Plugin',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
});
