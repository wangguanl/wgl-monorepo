# 合成

## 读取缓存目录合成

```ts
import { convertBilibiliCache } from '@wgl-m/trans-bilibili';

const r = await convertBilibiliCache(
  '/path/to/download', // B 站客户端缓存 download 目录
  './dist', // 输出目录（按合集分层建子目录）
  {
    onProgress: (msg) => console.log(msg), // 逐条进度文本
  }
);
// → { outputDir, total, merged, errors: [{ pro, video, error }] }
console.log(`${r.merged}/${r.total} 个合成完成，失败 ${r.errors.length}`);
```

## 认知

- 缓存结构需含 `entry.json`（提供标题/分P信息）以及 `video.m4s` / `audio.m4s` 或 `.blv` 片断。
- 同名输出已存在会跳过（幂等重跑）；失败单集隔离，不影响整批。
- 合集目录名经非法字符清理后作为子目录名，重名自动带后缀保证唯一。