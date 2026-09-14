import FolderTree from './FolderTree.vue';

export { FolderTree };
export type { FolderTreeProps } from './FolderTree.vue';
export type { FolderTreeNode, FolderTreeItem } from '@wgl-m/folder-tree';
export { buildTreeFromPaths, getFileIconName, collectDirPaths } from '@wgl-m/folder-tree';
export default FolderTree;
