# 校验数据

## Example
```js
/**
 * @method 验证类型
 * @param { Object | required } rules - 校验规则.
 * @param { Array | required } data - 数据.
 * @return { Boolean | rules[key] } 返回值描述: 如果校验成功则返回 true, 校验失败返回校验的规则
 **/
var flag = validation(
  {
    price: [
      {
        type: 'empty',
      },
      {
        type: 'money',
      },
    ],
    name: {
      type: 'empty',
    },
    custom: {
      validation: data => /123456/.test(data),
    },
  },
  { price: '123', name: 456 }
)

if (flag === true) {
  // 校验成功
} else {
  // 校验失败
  console.log(flag)
}
```

## Framework
::: code-group
```js  [ESModule]
import { validation } from 'wgl-utils';
// import validation from 'wgl-utils/es/validation.mjs';
```
```js  [CommonJs]
const Wgl = require('wgl-utils/main.cjs');
Wgl.validation();
```
:::


## Browser
::: code-group

```html  [ESModule]
<script type="module">
  import { validation } from 'wgl-utils/main.mjs';
  // import validation from 'wgl-utils/es/validation.mjs';
</script>
```
```html  [ES5]
<!-- 全量引入 -->
<script src="wgl-utils/main.js"></script>
<script>
  Wgl.validation();
</script>
```
:::


## Code
::: code-group

```js  [源码]
// src/validation.js
<!-- @include: ../../src/validation.js -->
```

```js  [ESModule]
// dist/es/validation.mjs
<!-- @include: ../../dist/es/validation.mjs -->
```
:::

