# getFileIconName

根据文件名后缀返回图标名（跨框架图标契约）。`symbol-` 前缀走 SVG symbol，`icon-` 前缀走 iconfont，其余为 devicon 名。

## Example

```js
import { getFileIconName } from '@wgl-m/folder-tree';

getFileIconName('a.js');          // 'Javascript'
getFileIconName('a.ts');          // 'Typescript'
getFileIconName('logo.png');      // 'symbol-icon-tupian'
getFileIconName('data.json');     // 'symbol-icon-JSON'
getFileIconName('unknown.xyz');   // 'File'
```

## Code

```ts
<!-- @include: ../../../../../packages/components/folder-tree/src/getFileIconName.ts -->
```
