## 安装

::: code-group

```bash [npm]
npm install @wgl-m/folder-tree-vue -S
```

```bash [cnpm]
cnpm install @wgl-m/folder-tree-vue -S
```

```bash [pnpm]
pnpm add @wgl-m/folder-tree-vue
```

```bash [yarn]
yarn add @wgl-m/folder-tree-vue
```

:::

## 注意

- `@wgl-m/folder-tree-vue` 仅适用于 **Vue 3**（>= 3.3）项目
- 组件依赖 `@wgl-m/folder-tree` 核心包，安装时自动携带
- 自绘渲染，不依赖 element-plus 等第三方 UI 库

```vue
<!-- 全量引入 -->
<script setup>
import { FolderTree } from '@wgl-m/folder-tree-vue';
</script>

<template>
  <FolderTree :file-tree="fileTree" @node-click="handleNodeClick" />
</template>
```

```vue
<!-- 按需引入（仅引入组件，附带核心工具） -->
<script setup>
import FolderTree from '@wgl-m/folder-tree-vue';
import { buildTreeFromPaths } from '@wgl-m/folder-tree-vue';
</script>
```
