const Path = require('path'),
  BaseSrc = Path.join(__dirname, '../../src/');

const libraryName = 'Wgl';
module.exports = {
  mode: 'production',
  entry: {
    main: {
      import: Path.resolve(BaseSrc, 'index.js'),
      library: {
        name: libraryName,
        type: 'var',
      },
    },
  },
  output: {
    path: Path.resolve(__dirname, '../../dist/'),
    filename: '[name].js',
    clean: false,
  },
};
