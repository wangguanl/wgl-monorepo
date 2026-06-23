# wgl-monorepo

@wgl/* 系列 npm 包的 monorepo 仓库。

## 包列表

| 包名 | 目录 | 运行环境 | 说明 |
|------|------|----------|------|
| `@wgl/utils` | `packages/utils` | Node + Browser | 通用工具函数 |
| `@wgl/plugins` | `packages/plugins` | Browser only | 浏览器业务插件 |
| `@wgl/node-utils` | `packages/node-utils` | Node only | Node 文件系统工具 |
| `@wgl/css` | `packages/css` | — | CSS/SCSS 样式资源 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 启动文档
pnpm docs:utils
pnpm docs:plugins
```

## 发布

```bash
pnpm changeset          # 选择变更的包与版本
pnpm version            # 生成 CHANGELOG 并更新版本号
pnpm release            # 构建并发布到 npm
```

发布前请确保 npm 账号拥有 `@wgl` scope 权限，详见 [PUBLISHING.md](./PUBLISHING.md)（逐步操作）与 [MIGRATION.md](./MIGRATION.md)（包名迁移）。

## 从旧包迁移

若你之前使用 `wgl-utils`、`wgl-css` 等旧包名，请参阅 [MIGRATION.md](./MIGRATION.md)。

## 技术栈

- **pnpm workspaces** — 包管理
- **Turborepo** — 任务编排与构建缓存
- **Changesets** — 版本管理与发布
