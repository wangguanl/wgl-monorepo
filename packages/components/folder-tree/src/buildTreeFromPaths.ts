import type { FolderTreeItem, FolderTreeNode } from './types';

/**
 * 将扁平路径列表组装为树形结构。
 *
 * 输入已是树结构（任一节点含 children）或没有任何 path 字段时，原样返回输入。
 * 目录节点由路径推导（name 取最后一段），叶子节点保留原 item 的全部字段且不携带 children。
 */
export function buildTreeFromPaths(files: FolderTreeItem[] | null | undefined): FolderTreeNode[] {
  const list = Array.isArray(files) ? files : [];
  const hasPaths = list.some((item) => item && typeof item.path === 'string');
  const hasChildren = list.some((item) => item && Array.isArray(item.children));

  if (!hasPaths || hasChildren) {
    return list as unknown as FolderTreeNode[];
  }

  const nodes = new Map<string, FolderTreeNode>();

  function normalizePath(rawPath: string): string {
    if (!rawPath) return '/';
    let path = rawPath.replace(/^\.\//, '');
    path = path.startsWith('/') ? path : '/' + path;
    return path.replace(/\\/g, '/').replace(/\/\/+/g, '/');
  }

  /** 目录节点升级：叶子/游离节点被后续条目作为前缀目录命中时，原地补 children 并登记 */
  function upgradeToDir(node: FolderTreeNode): FolderTreeNode {
    if (!Array.isArray(node.children)) {
      node.children = [];
    }
    return node;
  }

  function ensureDir(dirPath: string): FolderTreeNode {
    const path = normalizePath(dirPath);
    const existing = nodes.get(path);
    if (existing) {
      return upgradeToDir(existing);
    }
    const name = path === '/' ? '/' : path.substring(path.lastIndexOf('/') + 1);
    const dirNode: FolderTreeNode = { name, path, children: [] };
    nodes.set(path, dirNode);
    if (path !== '/') {
      const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
      const parent = ensureDir(parentPath);
      if (!parent.children.some((child) => child.path === path)) {
        parent.children.push(dirNode);
      }
    }
    return dirNode;
  }

  list.forEach((item) => {
    if (!item || typeof item.path !== 'string') {
      return;
    }
    const path = normalizePath(item.path);
    const name = item.name || path.substring(path.lastIndexOf('/') + 1) || path;
    const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
    const parent = ensureDir(parentPath);
    // 条目终点可能与已有目录节点重合（如先有 client/src/api 条目，后有 client/src/api/client.ts）：
    // 复用登记节点并保留扩展字段，避免产生游离节点导致后续子项丢失
    let leaf = nodes.get(path);
    if (leaf) {
      Object.assign(leaf, { ...item, name: leaf.name || name, path });
    } else {
      leaf = {
        ...item,
        name,
        path,
      };
      nodes.set(path, leaf);
      parent.children.push(leaf);
    }
    // 注意：不在此处补 children —— 叶子保持无 children 契约；
    // 若后续条目以该路径为前缀目录，ensureDir 会经 upgradeToDir 原地补上
  });

  return nodes.has('/') ? nodes.get('/')!.children : [];
}
