import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ['react', 'react/jsx-runtime'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    // CSS 以文本形式打进 JS，由组件运行时注入 <style>（消费者无需手动引入样式文件）
    options.loader = {
      ...options.loader,
      '.css': 'text',
    };
  },
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
