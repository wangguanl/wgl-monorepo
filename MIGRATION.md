# 包名迁移指南

自 monorepo 整合起，所有 npm 包统一迁移至 `@wgl/*` scope。

## 包名对照

| 旧包名 | 新包名 | 运行环境 |
|--------|--------|----------|
| `wgl-utils` | `@wgl/utils` | Node + Browser |
| `wgl-node-utils` | `@wgl/node-utils` | Node only |
| `wgl-css` | `@wgl/css` | 样式资源 |
| （无独立 npm 包） | `@wgl/plugins` | Browser only |

## 安装命令

```bash
# 旧
npm install wgl-utils wgl-css wgl-node-utils

# 新
pnpm add @wgl/utils @wgl/css @wgl/node-utils @wgl/plugins
```

## 导入方式

```js
// 旧
import { deepCopy } from 'wgl-utils'

// 新
import { deepCopy } from '@wgl/utils'
```

```js
// 浏览器插件（新包，独立发布）
import { copyToClipboard } from '@wgl/plugins'
import copyToClipboard from '@wgl/plugins/copyToClipboard'
```

```js
// 旧
const utils = require('wgl-node-utils')

// 新
const utils = require('@wgl/node-utils')
```

```js
// 旧
import 'wgl-css/reset.css'

// 新
import '@wgl/css/reset'
```

## Breaking Changes

### `@wgl/utils` 2.0.0

- 包名从 `wgl-utils` 改为 `@wgl/utils`
- 浏览器插件已迁移至 `@wgl/plugins`，不再包含在 utils 中

### `@wgl/css` 2.0.0

- 包名从 `wgl-css` 改为 `@wgl/css`
- 推荐使用 `exports` 子路径：`@wgl/css/reset`、`@wgl/css/mixin`

### `@wgl/node-utils` 2.0.0

- 包名从 `wgl-node-utils` 改为 `@wgl/node-utils`

## 旧包 Deprecation（发布时操作）

在 npm 上对旧包发布一个 patch 版本，添加 deprecation 说明：

```bash
npm deprecate wgl-utils "已迁移至 @wgl/utils，请升级"
npm deprecate wgl-css "已迁移至 @wgl/css，请升级"
npm deprecate wgl-node-utils "已迁移至 @wgl/node-utils，请升级"
```

## npm Scope 权限

发布 `@wgl/*` 前，需确保 npm 账号已创建 `@wgl` organization 或 user scope：

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 创建 organization `@wgl`（或使用 user scope）
3. 本地登录：`npm login`
4. 首次发布：`pnpm release`

## 文档地址

| 包 | 文档 |
|----|------|
| `@wgl/utils` | https://wangguanl.github.io/page__package-utils/ |
| `@wgl/plugins` | https://wangguanl.github.io/page__package-plugins/ |
| `@wgl/css` | https://wangguanl.github.io/page__package-css/ |

文档部署：

```bash
# utils 文档
cd packages/utils/docs && sh deploy.sh

# plugins 文档
cd packages/plugins/docs && sh deploy.sh
```
