// https://babeljs.io/repl
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        /**
         * @useBuiltIns
         * false: 此时不对 polyfill 做操作。如果引入 @babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill。
         *
         * 全量加载：在js中使用
         * require("es6-promise").polyfill();
         * import 'babel-polyfill';
         * entry: 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 import '@babel/polyfill'，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill。这里需要指定 core-js 的版本, 如果 "corejs": 3, 则 import '@babel/polyfill' 需要改成
         *
         * 按需加载
         * usage: 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。
         *
         *
         * @corejs
         * 使用 @babel/polyfill 做垫片时候我们需要使用哪个版本的corejs
         * 1,2,core-js@3
         */
        useBuiltIns: 'usage', // true,
        corejs: '3.19.3',
      },
    ],
    // '@babel/preset-env'
  ],
  /* plugins: [
    "@babel/plugin-transform-runtime"
    [
      "@babel/plugin-transform-runtime", {
        // "corejs": 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
      }
    ]
  ] */
};
