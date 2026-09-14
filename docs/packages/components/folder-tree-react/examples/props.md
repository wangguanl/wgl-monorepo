# Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `fileTree` | `FolderTreeItem[] \| null` | `[]` | 扁平文件列表（`{ path, name?, ... }`）或已组装的树 |
| `onNodeClick` | `(node: FolderTreeNode) => void` | — | 节点点击回调（目录同时触发展开/收起） |
| `renderIcon` | `(iconName: string, size: number) => ReactNode` | — | 自定义文件图标渲染 |

## 自定义图标

`renderIcon` 接收 `getFileIconName` 的返回值，可注入真实图标：

```tsx
<FolderTree fileTree={fileTree} renderIcon={(iconName, size) => <DevIcon name={iconName} size={size} />} />
```
