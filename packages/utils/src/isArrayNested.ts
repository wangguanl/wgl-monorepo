/* 判断是一个多维数组 */
export default (tree: unknown): boolean =>
  Array.isArray(tree) && tree.length > 0 && tree.every(val => Array.isArray(val));
