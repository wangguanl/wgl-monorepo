const Path = require('path'),
  BaseSrc = Path.join(__dirname, '../../src/');

module.exports = {
  mode: 'production',
  entry: {
    main: {
      import: Path.resolve(BaseSrc, 'index.js'),
      library: {
        type: 'commonjs',
      },
    },
  },
  output: {
    path: Path.resolve(__dirname, '../../dist/'),
    filename: '[name].cjs',
    clean: true,
  },
};
