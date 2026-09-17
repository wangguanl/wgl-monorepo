# 安装

## 环境要求

- Node.js >= 18.17

::: code-group

```bash [npm]
npm install @wgl-m/html2md -S
```

```bash [pnpm]
pnpm add @wgl-m/html2md
```

```bash [yarn]
yarn add @wgl-m/html2md
```

:::

> 转换依赖 TurndownService，抓取用原生 fetch。

## 未发版时本地引用

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/html2md": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/html2md'
```

## CLI

```bash
html2md <url|html文件> [选项]
```

| 选项 | 说明 |
|------|------|
| `-o, --out <目录>` | 输出根目录，默认 `./dist` |
| `--name <名字>` | 产物文件夹名，默认 `index` |
| `--selector <host=CSS>` | 只捕获该 host 的指定 CSS 元素 |
| `--no-images` | 不下载图片 |

## 源码

```ts
<!-- @include: ../../../../packages/html2md/src/index.ts -->
```