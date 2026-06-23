# clickOutside

监听点击元素外部的事件。

## Example

```js
import { clickOutside } from '@wgl/plugins';

clickOutside(dropdownEl, () => {
  dropdownEl.classList.remove('open');
});
```

## Code

```js
<!-- @include: ../../src/clickOutside.js -->
```
