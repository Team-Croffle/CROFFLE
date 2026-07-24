import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
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
      fileName: () => 'index.js'
    },
    rollupOptions: {
      // Do NOT externalize 'vue' — the plugin:// protocol cannot resolve bare imports.
      // Vue must be fully bundled into the plugin's index.js.
    }
  }
});
