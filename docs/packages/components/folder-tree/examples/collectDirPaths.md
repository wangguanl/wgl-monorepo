# collectDirPaths

收集树中所有目录节点的 `path`，用于初始化默认全展开状态。

## Example

```js
import { buildTreeFromPaths, collectDirPaths } from '@wgl-m/folder-tree';

const tree = buildTreeFromPaths([{ path: 'src/utils/a.js' }]);
collectDirPaths(tree);
// Set { '/src', '/src/utils' }
```

## Code

```ts
<!-- @include: ../../../../../packages/components/folder-tree/src/collectDirPaths.ts -->
```
