# clickOutside

监听点击元素外部的事件。

## Example

```js
import { clickOutside } from '@wgl-m/plugins';

clickOutside(dropdownEl, () => {
  dropdownEl.classList.remove('open');
});
```

## Code

```js
<!-- @include: ../../../packages/plugins/src/clickOutside.ts -->
```
