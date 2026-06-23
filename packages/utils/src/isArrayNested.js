/* 判断是一个多维数组 */
export default tree =>
  Array.isArray(tree) && tree.length && tree.every(val => Array.isArray(val));
