/**
 * FolderTree - React 壳组件
 *
 * 依赖 @wgl-m/folder-tree 的框架无关核心：
 * - buildTreeFromPaths（路径列表 → 树）
 * - getFileIconName（文件名 → 图标名契约）
 * - collectDirPaths（收集目录，用于默认全展开）
 *
 * 事件契约：onNodeClick(node) 外抛统一节点 { name, path, children }，
 * 与 @wgl-m/folder-tree-vue 对齐，使用方在两端拿到同一份数据。
 *
 * 依赖：仅 react（peer），无第三方 UI 库。
 */
// 样式以 TS 常量交付，运行时幂等注入 <style>，消费者无需手动引入 CSS，不依赖打包器 CSS 处理
import { folderTreeStyles } from './styles';

const STYLE_ID = 'wgl-m-folder-tree-styles';

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = folderTreeStyles;
  document.head.appendChild(style);
}

injectStyles();

import { useMemo, useState, type ReactNode } from 'react';
import {
  buildTreeFromPaths,
  collectDirPaths,
  getFileIconName,
  type FolderTreeItem,
  type FolderTreeNode,
} from '@wgl-m/folder-tree';

// re-export 核心工具与类型，与 @wgl-m/folder-tree-vue 的 API 面对齐
export { buildTreeFromPaths, collectDirPaths, getFileIconName } from '@wgl-m/folder-tree';
export type { FolderTreeNode, FolderTreeItem } from '@wgl-m/folder-tree';

export interface FolderTreeProps {
  /** 扁平文件列表或已组装的树 */
  fileTree?: FolderTreeItem[] | null;
  /** 节点点击回调（目录同时触发展开/收起） */
  onNodeClick?: (node: FolderTreeNode) => void;
  /** 自定义文件图标渲染，入参为 getFileIconName 的返回值 */
  renderIcon?: (iconName: string, size: number) => ReactNode;
}

const folderIconPath =
  'M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z';

/** 展开箭头：收起 ▸ 展开 ▾（旋转 90°，与 Vue 壳一致） */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5l11 7-11 7z" />
    </svg>
  );
}

function FolderIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={folderIconPath} />
    </svg>
  );
}

/** 文件图标：契约 symbol-*（svg use）/ icon-*（iconfont）/ devicon 名 */
function FileIcon({ name, size }: { name: string; size: number }) {
  if (!name) return null;
  const style = { width: size, height: size, fontSize: size };
  if (name.startsWith('symbol-')) {
    return (
      <svg
        className={['symbol-icon', name].join(' ')}
        width={size}
        height={size}
        aria-hidden="true"
      >
        <use href={`#${name.replace('symbol-', '')}`} />
      </svg>
    );
  }
  if (name.startsWith('icon-')) {
    return <i className={['iconfont', name].join(' ')} style={style} />;
  }
  // devicon 等字体图标名：默认渲染带名占位，消费方可经 renderIcon 注入真实图标
  return <span className={['file-icon', `devicon-${name}`].join(' ')} style={style} />;
}

interface TreeNodeProps {
  node: FolderTreeNode;
  depth: number;
  expanded: Set<string>;
  onToggle: (node: FolderTreeNode) => void;
  onSelect: (node: FolderTreeNode) => void;
  renderIcon?: FolderTreeProps['renderIcon'];
}

function TreeNode({ node, depth, expanded, onToggle, onSelect, renderIcon }: TreeNodeProps) {
  const children = Array.isArray(node.children) ? node.children : [];
  const isDir = children.length > 0;
  const iconSize = 18;
  const icon = isDir ? (
    <FolderIcon size={iconSize} />
  ) : renderIcon ? (
    renderIcon(getFileIconName(node.name), iconSize)
  ) : (
    <FileIcon name={getFileIconName(node.name)} size={iconSize} />
  );

  const handleClick = () => {
    if (isDir) {
      onToggle(node);
    }
    onSelect(node);
  };

  return (
    <li>
      <div
        className="file-node"
        style={{ paddingLeft: depth * 16 }}
        role="treeitem"
        aria-expanded={isDir ? expanded.has(node.path) : undefined}
        onClick={handleClick}
      >
        <span className={isDir ? `file-arrow${expanded.has(node.path) ? ' is-open' : ''}` : 'file-arrow'}>
          {isDir && <ArrowIcon />}
        </span>
        <span className="file-icon">{icon}</span>
        <span className="file-name">{node.name}</span>
      </div>
      {isDir && expanded.has(node.path) && (
        <ul role="group">
          {children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              renderIcon={renderIcon}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FolderTree({ fileTree = [], onNodeClick, renderIcon }: FolderTreeProps) {
  const treeData = useMemo(() => buildTreeFromPaths(fileTree), [fileTree]);
  const [expanded, setExpanded] = useState<Set<string>>(() => collectDirPaths(treeData));

  const toggle = (node: FolderTreeNode) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.path)) {
        next.delete(node.path);
      } else {
        next.add(node.path);
      }
      return next;
    });
  };

  const select = (node: FolderTreeNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <ul className="folder-tree" role="tree">
      {treeData.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          expanded={expanded}
          onToggle={toggle}
          onSelect={select}
          renderIcon={renderIcon}
        />
      ))}
    </ul>
  );
}
