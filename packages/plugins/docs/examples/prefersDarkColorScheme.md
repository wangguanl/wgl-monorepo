# prefersDarkColorScheme

检测用户是否偏好深色模式。

## Example

```js
import { prefersDarkColorScheme } from '@wgl-m/plugins';

if (prefersDarkColorScheme()) {
  document.body.classList.add('dark');
}
```

## Code

```js
<!-- @include: ../../src/prefersDarkColorScheme.ts -->
```
