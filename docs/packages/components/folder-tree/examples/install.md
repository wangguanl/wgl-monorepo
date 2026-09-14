## 安装

::: code-group

```bash [npm]
npm install @wgl-m/folder-tree -S
```

```bash [cnpm]
cnpm install @wgl-m/folder-tree -S
```

```bash [pnpm]
pnpm add @wgl-m/folder-tree
```

```bash [yarn]
yarn add @wgl-m/folder-tree
```

:::

## 引入

```js
import { buildTreeFromPaths, getFileIconName, collectDirPaths } from '@wgl-m/folder-tree';
```

## 注意

- 框架无关，Node / 浏览器均可使用
- 若使用 Vue / React 组件，请直接安装 `@wgl-m/folder-tree-vue` / `@wgl-m/folder-tree-react`，核心包会自动携带
