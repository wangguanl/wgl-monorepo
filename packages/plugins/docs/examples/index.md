## 全量引入

```js
import {
  copyToClipboard,
  clickOutside,
  checkCapsLock,
} from '@wgl-m/plugins';
```

## 按需引入

```js
import copyToClipboard from '@wgl-m/plugins/copyToClipboard';
import clickOutside from '@wgl-m/plugins/clickOutside';
```

## Browser

```html
<script type="module">
  import { copyToClipboard } from '@wgl-m/plugins';
  copyToClipboard('hello');
</script>
```
