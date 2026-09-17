# 安装

## 环境要求

- Node.js >= 18.17

::: code-group

```bash [npm]
npm install @wgl-m/compress -S
```

```bash [pnpm]
pnpm add @wgl-m/compress
```

```bash [yarn]
yarn add @wgl-m/compress
```

:::

> 压缩底层依赖 `sharp`（二进制），安装时由 npm/pnpm 自动拉取平台预编译产物。

## 未发版时本地引用

包尚未发布 npm 前，消费方按[本地引用指南](/local-usage)以 `workspace:*` 协议链接 monorepo 内的包：

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/compress": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/compress'
```

## CLI

包内置 `wgl-compress` 命令（bin），也可直接 `node dist/cli.js`：

```bash
wgl-compress <文件|目录> [选项]
```

| 选项 | 说明 |
|------|------|
| `-q, --quality <1-100>` | 压缩质量，默认 75 |
| `-f, --format <格式>` | 转换格式 `jpg/png/webp/avif/tiff/gif` |
| `--resize <WxH>` | 等比缩放（不放大） |
| `--crop <WxH>` | 居中裁剪 |
| `--rotate <90\|180\|270>` | 旋转角度 |
| `--wm-text <文字>` | 文字水印 |

目录模式输出到输入旁的 `compressed/`，单文件同理。缺省参数时打印帮助。

## 源码

```ts
<!-- @include: ../../../../packages/compress/src/compress.ts -->
```