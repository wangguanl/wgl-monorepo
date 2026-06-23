import { defineConfig } from 'tsup';
import { globSync } from 'glob';

const entries = globSync('src/*.ts').reduce(
  (acc, file) => {
    acc[file.replace(/^src\//, '').replace(/\.ts$/, '')] = file;
    return acc;
  },
  {} as Record<string, string>
);

export default defineConfig({
  entry: entries,
  format: ['esm', 'cjs'],
  dts: true,
  external: ['axios'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
  clean: true,
  sourcemap: true,
  outDir: 'dist',
});
