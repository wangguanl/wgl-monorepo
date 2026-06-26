## Framework
::: code-group
```ts  [ESModule]
import { unique } from '@wgl-m/utils';
unique();
```
```ts  [CommonJs]
const { unique } = require('@wgl-m/utils');
unique();
```
:::

## Browser
::: code-group
```html  [ESModule]
<script type="module">
  import { unique } from '@wgl-m/utils';
  unique();
</script>
```
:::


## Code
::: code-group

```ts  [源码]
// src/index.ts
<!-- @include: ../../../packages/utils/src/index.ts -->
```

```js  [ESModule]
// dist/index.js
<!-- @include: ../../../packages/utils/dist/index.js -->
```

```js  [Commonjs]
// dist/index.cjs
<!-- @include: ../../../packages/utils/dist/index.cjs -->
```
:::
