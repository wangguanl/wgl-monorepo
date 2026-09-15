# @wgl-m/down-img

网络图片批量下载工具包（API + CLI），**零依赖**（Node 18+ 原生 fetch）。

由本地工具 `tool__down-img` 迁移而来（迁移说明见 [MIGRATION.md](../../MIGRATION.md)）。

## 功能

- 单张 / 批量下载，并发池（默认 4，可调 1-64）
- 文件名取自 URL 路径；无扩展名时按响应 content-type 自动补全（.jpg/.png/.webp/...）
- 幂等：已存在同名文件默认跳过，可反复执行；`overwrite` 强制覆盖
- 超时控制 + 失败自动重试（默认 2 次，退避递增）
- 先落临时文件再原子改名，失败不产生半截文件
- 规整 `xx.jpg@759w_140h` 这类带处理参数的 URL 文件名

## API

```ts
import { downloadImage, downloadImages, urlFileName } from '@wgl-m/down-img';

// 单张
const r = await downloadImage('https://example.com/photo.jpg', {
  output: './dist', // 输出目录
  prefix: 'cover', // 文件名前缀
  overwrite: false, // 已存在跳过（默认）
  timeout: 30000, // 超时 ms
  retries: 2, // 重试次数
});
// → { url, path, bytes, skipped, contentType? }

// 批量（并发池 + 逐张回调，结果保持传入顺序）
const results = await downloadImages(
  ['https://a.com/1.jpg', 'https://a.com/2.jpg'],
  { output: './dist' },
  { concurrency: 4, onProgress: (err, r) => {} }
);
// → [{ ok: true, url, path, bytes, skipped }, { ok: false, url, error }]
```

## CLI

```bash
node dist/cli.js <url...> [选项]
# 或 npm 包安装后
down-img <url...> [选项]
```

| 选项 | 说明 |
|---|---|
| `-o, --out <目录>` | 输出目录，默认 `./dist` |
| `--file <json文件>` | 从 JSON 数组文件读取链接（与命令行 url 可混用） |
| `--prefix <前缀>` | 文件名前缀 |
| `--overwrite` | 覆盖已存在文件（默认跳过） |
| `--timeout <毫秒>` | 单次请求超时，默认 30000 |
| `--retries <次数>` | 失败重试次数，默认 2 |
| `--concurrency <1-64>` | 并发数，默认 4 |
| `-h, --help` | 帮助 |

## 被 compress-img / down-img 工具使用

- `tool__compress-img` 通过 `workspace:*` 协议引用本包，实现远程图片直接压缩：

```bash
compress-img https://example.com/photo.jpg -q 80   # 下载 → 压缩 → 只保留压缩结果
```

- `tool__down-img`（专职下载工具壳工程）的 `bin/cli.js` 调用本包 `./cli` 子路径导出的 `run(argv)`，工具行为与包内 CLI 完全一致：

```js
import { run } from '@wgl-m/down-img/cli'; // 仅当直接执行时才自动运行（入口守卫）
```

发版后均可切换为 `npm install @wgl-m/down-img`。

## 开发

```bash
pnpm --filter @wgl-m/down-img build    # 构建 dist（消费方引用的是产物，改源码后需重建）
pnpm --filter @wgl-m/down-img test     # 构建 + 12 项测试（本地 HTTP 服务，无外网依赖）
```

## 目录结构

```
src/download.ts    核心 API（downloadImage / downloadImages / urlFileName）
src/cli.ts         CLI（构建为 dist/cli.js，含 shebang）
src/index.ts       包导出入口
test/              单元测试 + CLI 测试（test/index.json 为 --file 示例）
```
