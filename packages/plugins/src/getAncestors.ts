// 获取元素的所有祖先元素
export default (el: Node | null): Node[] => {
  const ancestors: Node[] = [];
  while (el) {
    ancestors.unshift(el);
    el = el.parentNode;
  }
  return ancestors;
};
