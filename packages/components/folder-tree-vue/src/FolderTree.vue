<template>
  <ul class="folder-tree" role="tree">
    <FolderTreeNode
      v-for="node in treeData"
      :key="node.path"
      :node="node"
      :expanded="expanded"
      :depth="0"
      @node-click="handleNodeClick"
      @toggle="toggle"
    >
      <template #icon="scope">
        <slot name="icon" v-bind="scope" />
      </template>
    </FolderTreeNode>
  </ul>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import {
  buildTreeFromPaths,
  collectDirPaths,
  type FolderTreeItem,
  type FolderTreeNode as FolderTreeNodeType,
} from '@wgl-m/folder-tree';
import FolderTreeNode from './FolderTreeNode.vue';

export interface FolderTreeProps {
  /** 扁平文件列表或已组装的树 */
  fileTree?: FolderTreeItem[] | null;
}

const props = defineProps<FolderTreeProps>();

const emit = defineEmits<{
  (e: 'nodeClick', node: FolderTreeNodeType): void;
  /** 兼容旧组件的事件名（lego 的 onHandleNodeClick 消费形式） */
  (e: 'handleNodeClick', node: FolderTreeNodeType): void;
}>();

const treeData = computed(() => buildTreeFromPaths(props.fileTree));

/** 默认全展开：初始化时收集所有目录 path */
const expanded = reactive(new Set<string>(collectDirPaths(treeData.value)));

function toggle(node: FolderTreeNodeType) {
  if (expanded.has(node.path)) {
    expanded.delete(node.path);
  } else {
    expanded.add(node.path);
  }
}

function handleNodeClick(node: FolderTreeNodeType) {
  emit('nodeClick', node);
  emit('handleNodeClick', node);
}
</script>

<style scoped>
.folder-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.folder-tree :deep(ul) {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
