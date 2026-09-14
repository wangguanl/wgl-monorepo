## 安装

::: code-group

```bash [npm]
npm install @wgl-m/folder-tree-react -S
```

```bash [cnpm]
cnpm install @wgl-m/folder-tree-react -S
```

```bash [pnpm]
pnpm add @wgl-m/folder-tree-react
```

```bash [yarn]
yarn add @wgl-m/folder-tree-react
```

:::

## 注意

- `@wgl-m/folder-tree-react` 仅适用于 **React**（>= 17）项目
- 组件依赖 `@wgl-m/folder-tree` 核心包，安装时自动携带
- 自绘渲染，不依赖第三方 UI 库

```tsx
// 全量引入
import { FolderTree } from '@wgl-m/folder-tree-react';

<FolderTree fileTree={fileTree} onNodeClick={handleNodeClick} />;
```

```tsx
// 核心工具可从壳包直接引入（re-export 自 @wgl-m/folder-tree）
import { buildTreeFromPaths } from '@wgl-m/folder-tree-vue';
```
