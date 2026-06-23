// 检查一个元素是否包含另一个元素
export default (parent: Node, child: Node): boolean =>
  parent !== child && parent.contains(child);
