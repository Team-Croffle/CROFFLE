import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
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
    }
  }
});
