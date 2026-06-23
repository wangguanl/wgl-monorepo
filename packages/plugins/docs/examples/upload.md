# upload

文件上传（XHR / axios 两种方式）。

## Example

```js
import { uploadFile, uploadFile2 } from '@wgl/plugins';

uploadFile(file).then(res => console.log(res));

// uploadFile2 需要安装 axios
uploadFile2(file).then(data => console.log(data));
```

## 依赖

`uploadFile2` 使用 `axios`，需额外安装：

```bash
pnpm add axios
```

## Code

```js
<!-- @include: ../../src/upload.js -->
```
