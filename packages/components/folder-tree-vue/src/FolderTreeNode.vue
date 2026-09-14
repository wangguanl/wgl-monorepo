<template>
  <li>
    <div
      class="file-node"
      :style="{ paddingLeft: `${depth * 16 + 4}px` }"
      role="treeitem"
      :aria-expanded="isDir ? expanded.has(node.path) : undefined"
      @click="handleClick"
    >
      <span class="file-arrow" :class="{ 'is-open': isDir && expanded.has(node.path) }">
        <svg v-if="isDir" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5l11 7-11 7z" />
        </svg>
      </span>
      <span class="file-icon">
        <slot name="icon" :icon="iconName" :size="18" :is-dir="isDir">
          <!-- 兜底渲染：可被 #icon 插槽替换 -->
          <!-- 注意：插槽 prop 不能用 name —— <slot> 的 name 是特殊属性（动态插槽名） -->
          <svg
            v-if="isDir"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
          </svg>
          <svg
            v-else-if="iconName.startsWith('symbol-')"
            :class="['symbol-icon', iconName]"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <use :href="`#${iconName.replace('symbol-', '')}`" />
          </svg>
          <i
            v-else-if="iconName.startsWith('icon-')"
            :class="['iconfont', iconName]"
            :style="iconStyle"
          />
          <span v-else :class="['file-icon-placeholder', `devicon-${iconName}`]" :style="iconStyle" />
        </slot>
      </span>
      <span class="file-name">{{ node.name }}</span>
    </div>
    <ul v-if="isDir && expanded.has(node.path)" role="group">
      <FolderTreeNode
        v-for="child in children"
        :key="child.path"
        :node="child"
        :expanded="expanded"
        :depth="depth + 1"
        @node-click="emit('nodeClick', $event)"
        @toggle="emit('toggle', $event)"
      >
        <template #icon="scope">
          <slot name="icon" v-bind="scope" />
        </template>
      </FolderTreeNode>
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getFileIconName, type FolderTreeNode as FolderTreeNodeType } from '@wgl-m/folder-tree';
// 显式自引用：保证打包（vite lib）与 SSR 环境下递归组件可解析
import FolderTreeNode from './FolderTreeNode.vue';

defineOptions({ name: 'FolderTreeNode' });

const props = defineProps<{
  node: FolderTreeNodeType;
  expanded: Set<string>;
  depth: number;
}>();

const emit = defineEmits<{
  (e: 'nodeClick', node: FolderTreeNodeType): void;
  (e: 'toggle', node: FolderTreeNodeType): void;
}>();

const children = computed(() => (Array.isArray(props.node.children) ? props.node.children : []));
const isDir = computed(() => children.value.length > 0);
const iconName = computed(() => getFileIconName(props.node.name));
const iconStyle = { width: '18px', height: '18px', fontSize: '18px' };

function handleClick() {
  if (isDir.value) {
    emit('toggle', props.node);
  }
  emit('nodeClick', props.node);
}
</script>

<style scoped>
.file-node {
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

.file-node:hover {
  background-color: #f5f7fa;
}

.file-arrow {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: #8a919f;
  transition: transform 0.15s ease-in-out;
}

.file-arrow.is-open {
  transform: rotate(90deg);
}

.file-arrow svg {
  width: 10px;
  height: 10px;
}

.file-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  color: #8a919f;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
