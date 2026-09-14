/** 树节点：目录与叶子统一结构（叶子无 children 字段，消费方据此区分目录与文件） */
export interface FolderTreeNode {
  name: string;
  path: string;
  children?: FolderTreeNode[];
  [key: string]: unknown;
}

/** buildTreeFromPaths 输入：扁平文件项 */
export interface FolderTreeItem {
  path?: string;
  name?: string;
  children?: FolderTreeNode[];
  [key: string]: unknown;
}
