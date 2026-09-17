# wgl-monorepo

@wgl-m/* 系列 npm 包的 monorepo 仓库。

## 包列表

| 包名 | 目录 | 运行环境 | 说明 |
|------|------|----------|------|
| `@wgl-m/utils` | `packages/utils` | Node + Browser | 通用工具函数 |
| `@wgl-m/plugins` | `packages/plugins` | Browser only | 浏览器业务插件 |
| `@wgl-m/node-utils` | `packages/node-utils` | Node only | Node 文件系统工具 |
| `@wgl-m/down-img` | `packages/down-img` | Node only | 网络图片批量下载（零依赖，API + CLI） |
| `@wgl-m/compress` | `packages/compress` | Node only | 图片压缩 / 转格式 / 缩放 / 裁剪 / 水印（API + CLI） |
| `@wgl-m/html2md` | `packages/html2md` | Node only | HTML 页面 / 文件转 Markdown（图片本地化） |
| `@wgl-m/down-m3u8` | `packages/down-m3u8` | Node only | M3U8 流下载并转封装 mp4（ffmpeg） |
| `@wgl-m/trans-bilibili` | `packages/trans-bilibili` | Node only | B 站缓存目录合成 mp4（ffmpeg） |
| `@wgl-m/down-repository` | `packages/down-repository` | Node only | 克隆仓库并移除 .git（脚手架） |
| `@wgl-m/web-kit` | `packages/web-kit` | Node only | 零依赖 http 服务件（JSON/会话/ZIP/下载） |
| `@wgl-m/css` | `packages/css` | — | CSS/SCSS 样式资源 |
| `@wgl-m/folder-tree` | `packages/components/folder-tree` | 通用 | 文件夹树框架无关核心（路径转树 + 图标契约） |
| `@wgl-m/folder-tree-vue` | `packages/components/folder-tree-vue` | Vue 3 | 文件夹树 Vue 组件（依赖核心包） |
| `@wgl-m/folder-tree-react` | `packages/components/folder-tree-react` | React 17+ | 文件夹树 React 组件（依赖核心包） |

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
| 统一文档站点 | [docs/documentation-site/](./docs/documentation-site/README.md) | 已完成 |
| 组件/工具本地引用 | [docs/local-usage.md](./docs/local-usage.md) | 当前方案 |
| 六工具 CLI 用法 | [docs/cli-usage.md](./docs/cli-usage.md) | 已整理 |
| 本地门户（整合所有工具） | [tool__wgl-toolkit](../tool__wgl-toolkit/) | 已实现 |

## 从旧包迁移

若你之前使用 `wgl-utils`、`wgl-css` 等旧包名，请参阅 [MIGRATION.md](./MIGRATION.md)。

## 技术栈

- **pnpm workspaces** — 包管理
- **Turborepo** — 任务编排与构建缓存
- **Changesets** — 版本管理与发布
