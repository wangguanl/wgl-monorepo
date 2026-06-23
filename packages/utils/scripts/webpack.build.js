const FS = require('fs'),
  Path = require('path'),
  Webpack = require('webpack'),
  { merge } = require('webpack-merge'),
  commonConfig = require('./config/webpack.common'),
  webpackES5Config = require('./config/webpack.es5.conf'),
  webpackCommonjsConfig = require('./config/webpack.commonjs.conf'),
  webpackESModuleConfig = require('./config/webpack.esmodule.conf');

Webpack(merge(commonConfig, webpackCommonjsConfig), () => {
  Webpack(merge(commonConfig, webpackES5Config), () => {
    Webpack(webpackESModuleConfig, () => {
      FS.cpSync(
        Path.resolve(__dirname, '../README.md'),
        Path.resolve(__dirname, '../dist/README.md')
      );
    });
  });
});
