# 基本用法

传入扁平文件列表，点击节点时拿到 `{ name, path, children }`。

## Example

```tsx
import { FolderTree } from '@wgl-m/folder-tree-react';
import type { FolderTreeNode } from '@wgl-m/folder-tree';

const fileTree = [
  { path: 'src/index.js' },
  { path: 'src/utils/formatDate.js' },
  { path: 'docs/guide.md' },
  { path: 'assets/logo.png' },
];

function App() {
  const handleNodeClick = (node: FolderTreeNode) => {
    console.log(node.name, node.path);
  };

  return <FolderTree fileTree={fileTree} onNodeClick={handleNodeClick} />;
}
```

## Code

```tsx
<!-- @include: ../../../../../packages/components/folder-tree-react/src/index.tsx -->
```
