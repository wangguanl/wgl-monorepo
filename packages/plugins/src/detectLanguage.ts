// 检查当前用户的首选语言
export default (defaultLang = 'en-US'): string =>
  navigator.language ||
  (Array.isArray(navigator.languages) && navigator.languages[0]) ||
  defaultLang;
