# wgl-m 工具包 CLI 用法说明

> 六款工具库包（图片来源 `wgl-monorepo/packages/*`）均提供 CLI 入口，也是本地 Web 门户
> `tool__wgl-toolkit` 的底层能力。本文档覆盖每个工具的纯命令用法，适合脚本化 / 自动化场景。

## 前置准备

```bash
cd /Applications/My/Public/wgl-monorepo
pnpm install
pnpm --filter "@wgl-m/*" build        # 编译各包到 dist/
pnpm --filter "@wgl-m/*" --parallel typecheck
```

CLI 的 bin 名与各包同名（见下表）。两种调用方式任选其一：

- **全局**：`pnpm --filter "@wgl-m/*" --global add` 或直接 `npm i -g` 各包
- **本地 node_modules/.bin**：在任意 workspace 项目里 `npx 工具名 …`，或把
  `wgl-monorepo/node_modules/.bin` 加入 `PATH`

| 工具包 | bin 命令 | 一句话用途 |
|--------|----------|-----------|
| `@wgl-m/compress` | `wgl-compress` | 图片压缩 / 转格式 / 缩放 / 裁剪 / 加水印 |
| `@wgl-m/down-img` | `down-img` | 网络图片批量下载 |
| `@wgl-m/html2md` | `html2md` | HTML 页面 / 文件转 Markdown |
| `@wgl-m/down-m3u8` | `down-m3u8` | M3U8 流下载并转封装为 mp4 |
| `@wgl-m/trans-bilibili` | `trans-bilibili` | B 站缓存目录合成 mp4 |
| `@wgl-m/down-repository` | `down-repository` | 克隆仓库并移除 .git |

> `down-m3u8` 与 `trans-bilibili` 依赖本机 `ffmpeg`，需要先安装（如 `brew install ffmpeg`）。

---

## 1. wgl-compress — 图片压缩

基于 sharp，支持单文件或目录批量；目录模式输出到 `<原目录>/compressed/` 同构子目录。

```bash
wgl-compress <文件|目录> [选项]

# 示例
wgl-compress shot.png                          # 默认质量 75，输出 shot.png 旁 compressed/
wgl-compress photo.jpg -q 60 -f webp           # 转 webp，质量 60
wgl-compress pics/ -q 70 --resize 800x600      # 批量等比缩放到 800x600 以内
wgl-compress banner.png --crop 1200x400        # 居中裁剪到 1200x400
wgl-compress logo.svg --wm-text "© Mr.Wang"    # 加文字水印
```

| 选项 | 说明 | 默认 |
|------|------|------|
| `-q, --quality <1-100>` | 压缩质量 | `75` |
| `-f, --format <格式>` | 转换格式 `jpg/png/webp/avif/tiff/gif` | 保持原样 |
| `--resize <WxH>` | 等比缩放（不放大） | 关 |
| `--crop <WxH>` | 居中裁剪 | 关 |
| `--rotate <90\|180\|270>` | 旋转角度 | `0` |
| `--wm-text <文字>` | 文字水印 | 关 |
| `-h, --help` | 帮助 | — |

输出目录固定为输入旁的 `compressed/`（支持 `--out` 的另一形态见 Web 门户）。

---

## 2. down-img — 图片批量下载

零依赖，Node 18+ 原生 fetch。文件名取自 URL 末段，无扩展名时按响应 `content-type`
补全；`xx.jpg@759w_140h` 这种带处理参数的名字会规整为 `xx.jpg`。

```bash
down-img <url...> [选项]           # 或
down-img --file <urls.json> [选项]

# 示例
down-img https://a.com/1.png https://a.com/2.png -o ./images --prefix cover
down-img --file list.json --concurrency 8
down-img https://a.com/1.png --overwrite --timeout 15000
```

| 选项 | 说明 | 默认 |
|------|------|------|
| `-o, --out <目录>` | 输出目录 | `./dist` |
| `--file <json文件>` | 从 JSON 数组文件读链接（可与命令行 url 混用） | — |
| `--prefix <前缀>` | 文件名前缀 | 空 |
| `--overwrite` | 覆盖已存在文件（否则跳过） | 跳过 |
| `--timeout <毫秒>` | 单次请求超时 | `30000` |
| `--retries <次数>` | 失败重试 | `2` |
| `--concurrency <1-64>` | 并发数 | `4` |
| `-h, --help` | 帮助 | — |

已存在同名文件默认跳过，命令可重复执行（幂等）。失败时退出码为 `1`。

---

## 3. html2md — HTML 转 Markdown

抓取页面（POST 版走服务器）或本地 HTML 文件，抽取正文转 Markdown，并下载图片到
`<out>/<name>/images/`。

```bash
html2md <url|html文件> [选项]

# 示例
html2md https://example.com/article            # 产物在 ./dist/index/
html2md https://example.com/a -o ./notes --name post
html2md ./local.html --name saved --no-images  # 只转文本不下载图片
html2md https://localhost:3000/page --selector localhost=body  # 只抓指定元素
```

| 选项 | 说明 | 默认 |
|------|------|------|
| `-o, --out <目录>` | 输出根目录 | `./dist` |
| `--name <名字>` | 产物文件夹名 | `index` |
| `--selector <host=CSS>` | 只捕获该 host 的指定 CSS 元素 | 不限定 |
| `--no-images` | 不下载图片 | 下载 |
| `-h, --help` | 帮助 | — |

---

## 4. down-m3u8 — M3U8 下载

抓取 m3u8 分片并用 ffmpeg 转封装为单文件 mp4。

```bash
down-m3u8 <m3u8-url> [选项]

# 示例
down-m3u8 https://example.com/index.m3u8
down-m3u8 https://example.com/stream.m3u8 -o ./videos --name movie
```

| 选项 | 说明 | 默认 |
|------|------|------|
| `-o, --out <目录>` | 输出目录 | `./dist` |
| `--name <名字>` | 输出文件名（不含扩展名） | 依 URL 推导 |
| `-h, --help` | 帮助 | — |

> 单包 CLI 每次处理一条流；Web 门户提供带进度轮询的多任务形态。
> 需要本机 `ffmpeg`。

---

## 5. trans-bilibili — B 站缓存转译

读取客户端缓存的 `download/` 目录（含 `entry.json`、`video.m4s`/`audio.m4s`/`.blv`），
用 ffmpeg 按视频分层合成 mp4。纯位置参数，无选项。

```bash
trans-bilibili <缓存目录download> [输出目录]
# 示例
trans-bilibili ./download ./dist
trans-bilibili /path/to/cache /path/to/out
```

| 参数 | 说明 | 默认 |
|------|------|------|
| 参数 1 | B 站缓存 `download` 目录 | 必填 |
| 参数 2 | 输出目录（按合集分层建子目录） | `./dist` |

失败视频在结束时汇总列出，并置退出码 `1`。需要本机 `ffmpeg`。

---

## 6. down-repository — 仓库脚手架

克隆 Git 仓库并移除原 `.git`，得到可二次修改的模板工程。纯位置参数。

```bash
down-repository <目标目录> <git远程地址>
# 示例
down-repository myapp https://github.com/wangzhongquan/uk.git
down-repository myapp wangguanl/special          # 亦可缩写 owner/repo
```

> 远程地址可写完整 URL 或 `owner/repo` 缩写。命令在目标目录落盘并清理 `.git`，
> 适合换皮 / 造脚手架。此能力在 Web 门户中仅支持本地路径（CLI 为主）。

---

## 进阶：在代码里调用（库 API）

所有包的库 API 与 CLI 等价，可在脚本中直接 import：

```ts
import { compressImage } from '@wgl-m/compress';
import { downloadImages } from '@wgl-m/down-img';
import { pageToMarkdown } from '@wgl-m/html2md';
import { downloadM3u8 } from '@wgl-m/down-m3u8';
import { convertBilibiliCache } from '@wgl-m/trans-bilibili';
import { scaffold } from '@wgl-m/down-repository';
```

也提供通用 http 服务件 `@wgl-m/web-kit`（JSON API、会话目录、ZIP 打包、文件下载等），
本地门户 `tool__wgl-toolkit` 正是全部工具 + web-kit 的整合形态：

```bash
cd /Applications/My/Public/tool__wgl-toolkit
pnpm install
node bin/server.js        # 打开 http://127.0.0.1:7788，免去记忆 CLI 参数
```