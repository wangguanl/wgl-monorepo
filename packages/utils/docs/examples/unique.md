# 创建唯一值

## Example
```js
const uid = unique()
```

## Framework
::: code-group
```js  [ESModule]
import { unique } from 'wgl-utils';
// import unique from 'wgl-utils/es/unique.mjs';
```
```js  [CommonJs]
const Wgl = require('wgl-utils/main.cjs');
Wgl.unique();
```
:::


## Browser
::: code-group

```html  [ESModule]
<script type="module">
  import { unique } from 'wgl-utils/main.mjs';
  // import unique from 'wgl-utils/es/unique.mjs';
</script>
```
```html  [ES5]
<!-- 全量引入 -->
<script src="wgl-utils/main.js"></script>
<script>
  Wgl.unique();
</script>
```
:::


## Code
::: code-group

```js  [源码]
// src/unique.js
<!-- @include: ../../src/unique.js -->
```

```js  [ESModule]
// dist/es/unique.mjs
<!-- @include: ../../dist/es/unique.mjs -->
```
:::