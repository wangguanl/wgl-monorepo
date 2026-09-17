# 下载

## 单个流下载

```ts
import { downloadM3u8 } from '@wgl-m/down-m3u8';

const r = await downloadM3u8('https://example.com/stream.m3u8', {
  output: './dist', // 输出目录（自动创建）
  name: 'movie', // 输出名（不含扩展名）
  skipIfExists: true, // 已存在同名跳过，默认 true
});
// → { url, file: '.../movie.mp4', skipped: false }
```

## 进度回调

```ts
const r = await downloadM3u8(url, {
  output: './videos',
  onProgress: ({ percent }) => {
    if (percent != null) console.log(`下载 ${percent.toFixed(1)}%`);
  },
});
```

## 其它导出

`safeName(url)` 从 URL 推导安全文件名（去 `.m3u8` 后缀、转义非法字符）；`ffmpegDownload(url, file, cb)` 提供底层 ffmpeg 调用。