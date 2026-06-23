## 全量引入

```js
import {
  copyToClipboard,
  clickOutside,
  checkCapsLock,
} from '@wgl/plugins';
```

## 按需引入

```js
import copyToClipboard from '@wgl/plugins/copyToClipboard';
import clickOutside from '@wgl/plugins/clickOutside';
```

## Browser

```html
<script type="module">
  import { copyToClipboard } from '@wgl/plugins';
  copyToClipboard('hello');
</script>
```
