const Path = require('path'),
  glob = require('glob'),
  BaseSrc = Path.join(__dirname, '../../src/');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  experiments: {
    outputModule: true,
  },
  entry: (() => {
    const entry = {};
    glob.sync('**/*.js', { cwd: BaseSrc }).forEach(filename => {
      const name = filename.replace(/\.js$/, '');
      entry[name === 'index' ? 'main' : 'es/' + name] = {
        import: Path.join(BaseSrc, filename),
        library: {
          type: 'module',
        },
      };
    });
    return entry;
  })(),
  output: {
    path: Path.resolve(__dirname, '../../dist/'),
    filename: '[name].mjs',
    clean: false,
  },
};
