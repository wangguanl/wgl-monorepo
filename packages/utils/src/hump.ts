// 将驼峰使拼接字符分割
export const humpToSplit = (str: string, mark = '-'): string =>
  str.replace(/([A-Z])/g, `${mark}$1`).toLowerCase();

// 将拼接字符串转成驼峰
export const splitToHump = (str: string): string =>
  str.replace(/-(\w)/g, (_$0, $1: string) => $1.toUpperCase());
