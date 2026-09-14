# buildTreeFromPaths

将扁平文件路径列表组装为树形结构。输入已是树（含 `children`）或无 `path` 字段时原样返回。

## Example

```js
import { buildTreeFromPaths } from '@wgl-m/folder-tree';

const tree = buildTreeFromPaths([
  { path: 'src/utils/a.js', size: 1 },
  { path: 'docs/guide.md' },
]);
// [
//   { name: 'src', path: '/src', children: [
//       { name: 'utils', path: '/src/utils', children: [
//           { name: 'a.js', path: '/src/utils/a.js', size: 1 }
//       ]}
//   ]},
//   { name: 'docs', path: '/docs', children: [...] }
// ]
```

## Code

```ts
<!-- @include: ../../../../../packages/components/folder-tree/src/buildTreeFromPaths.ts -->
```
