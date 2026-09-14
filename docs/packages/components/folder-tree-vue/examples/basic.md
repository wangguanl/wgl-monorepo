# 基本用法

传入扁平文件列表，点击节点时拿到 `{ name, path, children }`。

## Example

```vue
<script setup>
import { FolderTree } from '@wgl-m/folder-tree-vue';

const fileTree = [
  { path: 'src/index.js' },
  { path: 'src/utils/formatDate.js' },
  { path: 'docs/guide.md' },
  { path: 'assets/logo.png' },
];

function handleNodeClick(node) {
  console.log(node.name, node.path);
}
</script>

<template>
  <FolderTree :file-tree="fileTree" @node-click="handleNodeClick" />
</template>
```

## 自定义图标（#icon 插槽）

通过 `#icon` 作用域插槽注入自己的图标组件，插槽作用域为 `{ icon, size, isDir }`（`icon` 为 `getFileIconName` 返回的契约名）：

```vue
<template>
  <FolderTree :file-tree="fileTree">
    <template #icon="{ icon, size, isDir }">
      <MyFolderIcon v-if="isDir" :size="20" />
      <MyFileIcon v-else :name="icon" :size="size" />
    </template>
  </FolderTree>
</template>
```

## Code

```vue
<!-- @include: ../../../../../packages/components/folder-tree-vue/src/FolderTree.vue -->
```
