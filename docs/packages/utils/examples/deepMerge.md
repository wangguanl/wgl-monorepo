# 对象深合并

## Example
```js
const obj = {
  a: 1,
  b: 2,
  c: [3, 4, { a: 1, b: 2 }],
  d: {
    s: 1,
    d: 2,
    a: 22,
  },
},
obj2 = {
  a: 3,
  b: 4,
  c: [5, 6, 7],
  d: {
    s: 4,
    d: 6,
    q: 2,
  },
};
const mergeObj = deepMerge(obj, obj2);
```


## Framework
::: code-group
```js  [ESModule]
import { deepMerge } from '@wgl-m/utils';
// import deepMerge from '@wgl-m/utils/es/deepMerge.mjs';
```
```js  [CommonJs]
const Wgl = require('@wgl-m/utils/main.cjs');
Wgl.deepMerge();
```
:::

## Browser
::: code-group

```html  [ESModule]
<script type="module">
  import { deepMerge } from '@wgl-m/utils/main.mjs';
  // import deepMerge from '@wgl-m/utils/es/deepMerge.mjs';
  const mergeObj = deepMerge(obj,obj2);
</script>
```
```html  [ES5]
<!-- 全量引入 -->
<script src="@wgl-m/utils/main.js"></script>
<script>
  const mergeObj = Wgl.deepMerge(obj, obj2);
</script>
```
:::



## Code
::: code-group

```js  [源码]
// src/deepMerge.js
<!-- @include: ../../../packages/utils/src/deepMerge.ts -->
```

```js  [ESModule]
// dist/es/deepMerge.mjs
<!-- @include: ../../../packages/utils/dist/es/deepMerge.mjs -->
```
:::

