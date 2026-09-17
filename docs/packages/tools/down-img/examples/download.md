# 批量下载

## 单张下载

```ts
import { downloadImage } from '@wgl-m/down-img';

const r = await downloadImage('https://example.com/photo.jpg', {
  output: './dist', // 输出目录（不存在自动创建），默认 "./dist"
  prefix: 'cover', // 文件名前缀
  overwrite: false, // 已存在跳过（默认），true 强制覆盖
  timeout: 30000, // 单次请求超时 ms
  retries: 2, // 失败重试次数
});
// → { url, path, bytes, skipped, contentType? }
```

## 批量下载（并发池）

```ts
import { downloadImages } from '@wgl-m/down-img';

const results = await downloadImages(
  ['https://a.com/1.jpg', 'https://a.com/2.jpg', 'https://a.com/3.png'],
  { output: './dist' },
  {
    concurrency: 4, // 并发数，默认 4
    onProgress: (err, r) => {
      // 每张完成的回调（err 为 null 表示成功）
    },
  }
);
// → [{ ok: true, url, path, bytes, skipped }, { ok: false, url, error }]
// 结果保持传入顺序；单张失败不中断整批
```

## URL 文件名解析

```ts
import { urlFileName } from '@wgl-m/down-img';

urlFileName('https://a.com/b/photo.jpg?v=2'); // → "photo.jpg"（去 query）
urlFileName('https://a.com/b/photo.jpg@759w_140h'); // → "photo.jpg"（截掉处理参数）
```

无扩展名的 URL（如 `/img/12345`）下载时按响应 `content-type` 自动补全为 `.jpg` / `.png` / `.webp` 等。
