# 安装

## 环境要求

- Node.js >= 18.17

::: code-group

```bash [npm]
npm install @wgl-m/down-repository -S
```

```bash [pnpm]
pnpm add @wgl-m/down-repository
```

```bash [yarn]
yarn add @wgl-m/down-repository
```

:::

> 命中仓库需为公开仓库；私仓会挂起。底层使用 `download-git-repo`（`clone: true`）。

## 未发版时本地引用

```jsonc
// 消费方 package.json
{
  "dependencies": {
    "@wgl-m/down-repository": "workspace:*"
  }
}
```

```yaml
# 消费方 pnpm-workspace.yaml
packages:
  - '.'
  - '<相对路径>/wgl-monorepo/packages/down-repository'
```

## CLI

纯位置参数：

```bash
down-repository <目标目录> <git远程地址>
# 示例
down-repository myapp https://github.com/wangzhongquan/uk.git
down-repository myapp wangguanl/special
```

| 参数 | 说明 |
|------|------|
| 参数 1 | 目标目录（自动创建） |
| 参数 2 | 远程地址：完整 URL 或 `owner/repo` 缩写 |

## 源码

```ts
<!-- @include: ../../../../packages/down-repository/src/index.ts -->
```