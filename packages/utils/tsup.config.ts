import { defineConfig } from 'tsup';
import { globSync } from 'glob';

const entries = globSync('src/**/*.ts').reduce(
  (acc, file) => {
    const name = file.replace(/^src\//, '').replace(/\.ts$/, '');
    acc[name === 'index' ? 'index' : `es/${name}`] = file;
    return acc;
  },
  {} as Record<string, string>
);

export default defineConfig({
  entry: entries,
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
