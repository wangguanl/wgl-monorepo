# wgl-monorepo

@wgl-m/* 系列 npm 包的 monorepo 仓库。

## 包列表

| 包名 | 目录 | 运行环境 | 说明 |
|------|------|----------|------|
| `@wgl-m/utils` | `packages/utils` | Node + Browser | 通用工具函数 |
| `@wgl-m/plugins` | `packages/plugins` | Browser only | 浏览器业务插件 |
| `@wgl-m/node-utils` | `packages/node-utils` | Node only | Node 文件系统工具 |
| `@wgl-m/css` | `packages/css` | — | CSS/SCSS 样式资源 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 启动文档
pnpm docs
```

## 发版

**完整步骤见 [RELEASE.md](./RELEASE.md)**（建议收藏，忘了就看这个）。

```bash
pnpm changeset    # ① 选包、写说明
git push          # ② 推送后去 GitHub 合并 Version PR → 自动发布
```

## 文档与方案

| 主题 | 文档 | 状态 |
|------|------|------|
| 文档索引 | [docs/](./docs/README.md) | — |
| TypeScript 迁移 | [docs/typescript-migration/](./docs/typescript-migration/README.md) | 已完成 |
| 统一文档站点 | [docs/documentation-site/](./docs/documentation-site/README.md) | 待确认 |

## 从旧包迁移

若你之前使用 `wgl-utils`、`wgl-css` 等旧包名，请参阅 [MIGRATION.md](./MIGRATION.md)。

## 技术栈

- **pnpm workspaces** — 包管理
- **Turborepo** — 任务编排与构建缓存
- **Changesets** — 版本管理与发布
