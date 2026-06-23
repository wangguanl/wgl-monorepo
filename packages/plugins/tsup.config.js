import { defineConfig } from 'tsup';
import { globSync } from 'glob';

const entries = globSync('src/*.js').reduce((acc, file) => {
  acc[file.replace(/^src\//, '').replace(/\.js$/, '')] = file;
  return acc;
}, {});

export default defineConfig({
  entry: entries,
  format: ['esm', 'cjs'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
  external: ['axios'],
  splitting: false,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
});
