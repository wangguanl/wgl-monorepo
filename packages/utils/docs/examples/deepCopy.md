# 对象深拷贝

## Example
```js
const obj = {
  a: 1,
  b: 2,
  c: [3, 4, {a: 1, b: 2}]
}
const copyObj = deepCopy(obj);
```

## Framework
::: code-group
```js  [ESModule]
import { deepCopy } from 'wgl-utils';
// import deepCopy from 'wgl-utils/es/deepCopy.mjs';
```
```js  [CommonJs]
const Wgl = require('wgl-utils/main.cjs');
Wgl.deepCopy();
```
:::


## Browser
::: code-group

```html  [ESModule]
<script type="module">
  import { deepCopy } from 'wgl-utils/main.mjs';
  // import deepCopy from 'wgl-utils/es/deepCopy.mjs';
</script>
```
```html  [ES5]
<!-- 全量引入 -->
<script src="wgl-utils/main.js"></script>
<script>
  Wgl.deepCopy();
</script>
```
:::


## Code
::: code-group

```js  [源码]
// src/deepCopy.js
<!-- @include: ../../src/deepCopy.js -->
```

```js  [ESModule]
// dist/es/deepCopy.mjs
<!-- @include: ../../dist/es/deepCopy.mjs -->
```
:::
