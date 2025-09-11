import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',
  root: 'src/renderer',
  build: {
    outDir: '../../dist/renderer',
  },
});
