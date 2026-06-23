const path = require('path');
const BaseSrc = path.join(__dirname, '../../src/');
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules目录
        include: BaseSrc,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': BaseSrc,
    },
    extensions: ['.js', '.cjs'],
    modules: [BaseSrc],
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [
      ...(() => {
        let plugins = [];
        const TerserWebpackPlugin = require('terser-webpack-plugin');
        plugins = [
          new TerserWebpackPlugin({
            terserOptions: {
              compress: {
                warnings: true,
                drop_console: true,
                drop_debugger: true,
              },
            },
          }),
        ];
        return plugins;
      })(),
    ],
  },
};
