/**
 * 组件基础样式（与 Vue 壳观感一致，el-tree 风格）。
 *
 * 以 TS 字符串常量交付：由 index.tsx 运行时幂等注入 <style>，
 * 消费者 import 组件即自动带上样式，无需手动引入 CSS 文件，
 * 且不依赖打包器的 CSS 处理行为（tsup/vite/webpack 通吃）。
 */
export const folderTreeStyles = `
.folder-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.folder-tree ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.folder-tree .file-node {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding-right: 8px;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
  line-height: 26px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.folder-tree .file-node:hover {
  background-color: #f5f7fa;
}

.folder-tree .file-arrow {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: #8a919f;
  transition: transform 0.15s ease-in-out;
}

.folder-tree .file-arrow.is-open {
  transform: rotate(90deg);
}

.folder-tree .file-arrow svg {
  width: 10px;
  height: 10px;
}

.folder-tree .file-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  color: #8a919f;
}

.folder-tree .file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;
