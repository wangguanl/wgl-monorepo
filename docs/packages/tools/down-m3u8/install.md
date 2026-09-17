# 安装

## 环境要求

- Node.js >= 18.17
- 本机安装 ffmpeg（`brew install ffmpeg`），下载/转码依赖系统 ffmpeg

::: code-group

```bash [npm]
npm install @wgl-m/down-m3u8 -S
```

```bash [pnpm]
pnpm add @wgl-m/down-m3u8
```

```bash [yarn]
yarn add @wgl-m/down-m3u8
```

:::

## 未发版时本地引用

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/down-m3u8": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/down-m3u8'
```

## CLI

```bash
down-m3u8 <m3u8-url> [选项]
```

| 选项 | 说明 |
|------|------|
| `-o, --out <目录>` | 输出目录，默认 `./dist` |
| `--name <名字>` | 输出文件名（不含扩展名） |

输入非 http/https 链接时报错；无 `--name` 时按 URL 推导文件名。

## 源码

```ts
<!-- @include: ../../../../packages/down-m3u8/src/single.ts -->
```