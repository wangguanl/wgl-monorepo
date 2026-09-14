# Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fileTree` | `FolderTreeItem[] \| null` | `[]` | 扁平文件列表（`{ path, name?, ... }`）或已组装的树 |

## Emits

| 事件 | 载荷 | 说明 |
|------|------|------|
| `nodeClick` | `FolderTreeNode` | 节点点击（目录同时触发展开/收起），节点结构为 `{ name, path, children?, ... }` |
| `handleNodeClick` | `FolderTreeNode` | 同 `nodeClick`（兼容旧组件的事件名） |

## Slots

| 插槽 | 作用域 | 说明 |
|------|--------|------|
| `icon` | `{ icon: string, size: number, isDir: boolean }` | 自定义节点图标；`icon` 为 `getFileIconName` 返回的契约名 |
