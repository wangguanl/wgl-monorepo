// 将驼峰使拼接字符分割
export const humpToSplit = (str, mark = '-') =>
  str.replace(/([A-Z])/g, `${mark}$1`).toLowerCase();

// 将拼接字符串转成驼峰
export const splitToHump = str =>
  str.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase());
