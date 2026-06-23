// 检查当前用户的首选颜色方案
export default () =>
  window?.matchMedia?.('(prefers-color-scheme: dark)').matches;
