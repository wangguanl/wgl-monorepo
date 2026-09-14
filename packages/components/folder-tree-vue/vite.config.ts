import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
  plugins: [vue(), libInjectCss()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'FolderTreeVue',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', '@wgl-m/folder-tree'],
      output: {
        exports: 'named',
        // libInjectCss 会把 CSS 以 import 方式注入 JS，消费者 import JS 即自动带上样式
        assetFileNames: 'folder-tree-vue.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
