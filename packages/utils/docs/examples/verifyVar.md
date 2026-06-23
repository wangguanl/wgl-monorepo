# 检测类型

## Example
```js
/*
  检测类型
  variable, 返回当前variable参数类型
  [, isType], 判断variable参数类型
  来自用户传输的内容都必须验证类型
 */
verifyVar(1); // number
verifyVar('string'); // string
verifyVar([]); // array
verifyVar([], 'array'); // true
verifyVar({}); // object
verifyVar({}, 'object'); // true

```

## Framework
::: code-group
```js  [ESModule]
import { verifyVar } from 'wgl-utils';
// import verifyVar from 'wgl-utils/es/verifyVar.mjs';
```
```js  [CommonJs]
const Wgl = require('wgl-utils/main.cjs');
Wgl.verifyVar();
```
:::


## Browser
::: code-group

```html  [ESModule]
<script type="module">
  import { verifyVar } from 'wgl-utils/main.mjs';
  // import verifyVar from 'wgl-utils/es/verifyVar.mjs';
</script>
```
```html  [ES5]
<!-- 全量引入 -->
<script src="wgl-utils/main.js"></script>
<script>
  Wgl.verifyVar();
</script>
```
:::


## Code
::: code-group

```js  [源码]
// src/verifyVar.js
<!-- @include: ../../src/verifyVar.js -->
```

```js  [ESModule]
// dist/es/verifyVar.mjs
<!-- @include: ../../dist/es/verifyVar.mjs -->
```
:::



