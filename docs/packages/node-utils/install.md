# 安装

## 环境要求

- Node.js >= 16

::: code-group

```bash [npm]
npm install @wgl-m/node-utils -S
```

```bash [pnpm]
pnpm add @wgl-m/node-utils
```

```bash [yarn]
yarn add @wgl-m/node-utils
```

:::

## API 概览

```ts
import { readdirAsync, readFileAsync, writeFileAsync, statAsync, mkdirAsync, accessAsync, isFile } from '@wgl-m/node-utils';
```

| 函数 | 说明 |
|------|------|
| `readdirAsync(path)` | 读取文件夹 |
| `readFileAsync(path)` | 读取文件 |
| `writeFileAsync(path, data)` | 写入文件 |
| `statAsync(path)` | 检查文件/文件夹状态 |
| `mkdirAsync(path)` | 创建文件夹 |
| `accessAsync(path)` | 检查文件是否存在 |
| `isFile(path)` | 判断是否为文件 |

## 源码

```ts
<!-- @include: ../../../packages/node-utils/src/index.ts -->
```