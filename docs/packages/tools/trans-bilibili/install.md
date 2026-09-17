# 安装

## 环境要求

- Node.js >= 18.17
- 本机安装 ffmpeg（`brew install ffmpeg`）

::: code-group

```bash [npm]
npm install @wgl-m/trans-bilibili -S
```

```bash [pnpm]
pnpm add @wgl-m/trans-bilibili
```

```bash [yarn]
yarn add @wgl-m/trans-bilibili
```

:::

## 未发版时本地引用

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/trans-bilibili": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/trans-bilibili'
```

## CLI

纯位置参数，无选项：

```bash
trans-bilibili <缓存目录download> [输出目录]
```

| 参数 | 说明 |
|------|------|
| 参数 1 | B 站缓存 `download` 目录（含 `entry.json`、m4s/.blv） |
| 参数 2 | 输出目录（按合集分层建子目录），默认 `./dist` |

失败影片在结束时汇总列出，并置退出码 `1`。

## 源码

```ts
<!-- @include: ../../../../packages/trans-bilibili/src/index.ts -->
```