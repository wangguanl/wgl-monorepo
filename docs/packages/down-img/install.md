# 安装

## 环境要求

- Node.js >= 18.17（原生 fetch）

::: code-group

```bash [npm]
npm install @wgl-m/down-img -S
```

```bash [pnpm]
pnpm add @wgl-m/down-img
```

```bash [yarn]
yarn add @wgl-m/down-img
```

:::

## 未发版时本地引用

包尚未发布 npm 前，消费方（如 tool__compress-img）按[本地引用指南](/local-usage)以 `workspace:*` 协议链接 monorepo 内的包：

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/down-img": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml —— 把包纳入 workspace globs
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/down-img'
```

## CLI

包内置 `down-img` 命令（bin），也可直接 `node dist/cli.js`：

```bash
down-img <url...> [选项]
down-img --file urls.json [选项]
```

| 选项 | 说明 |
|------|------|
| `-o, --out <目录>` | 输出目录，默认 `./dist` |
| `--file <json文件>` | 从 JSON 数组文件读取链接（与命令行 url 可混用） |
| `--prefix <前缀>` | 文件名前缀 |
| `--overwrite` | 覆盖已存在文件（默认跳过） |
| `--timeout <毫秒>` | 单次请求超时，默认 30000 |
| `--retries <次数>` | 失败重试次数，默认 2 |
| `--concurrency <1-64>` | 并发数，默认 4 |

## 实际案例

[tool__compress-img](https://github.com/wangguanl/wgl-monorepo) 以 `workspace:*` 消费本包，实现远程图片"下载 → 压缩"一条命令：

```bash
compress-img https://example.com/photo.jpg -q 80
```

## 源码

```ts
<!-- @include: ../../../packages/down-img/src/download.ts -->
```
