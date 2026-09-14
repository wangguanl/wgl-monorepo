import type { FolderTreeNode } from './types';

/** 收集树中所有目录节点的 path（用于默认全展开）。 */
export function collectDirPaths(nodes: FolderTreeNode[]): Set<string> {
  const paths = new Set<string>();
  const walk = (list: FolderTreeNode[]): void => {
    list.forEach((node) => {
      if (Array.isArray(node.children) && node.children.length > 0) {
        paths.add(node.path);
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return paths;
}
