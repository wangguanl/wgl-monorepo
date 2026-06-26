# 统一文档站点方案

> **状态：已完成** — 统一文档站点已迁移执行完毕。

## 文档索引

| 文档 | 内容 |
|------|------|
| [01-现状分析.md](./01-现状分析.md) | 当前文档分散情况、痛点与约束 |
| [02-目标与原则.md](./02-目标与原则.md) | 统一后的目标、边界、不做的事 |
| [03-技术选型.md](./03-技术选型.md) | VitePress 配置、导航、依赖归属 |
| [04-目录结构.md](./04-目录结构.md) | 迁移后的 `docs/` 目录预览 |
| [05-迁移计划.md](./05-迁移计划.md) | 分阶段执行步骤与 `@include` 路径调整 |
| [06-部署与CI.md](./06-部署与CI.md) | GitHub Pages、域名、旧链接兼容 |
| [07-确认清单.md](./07-确认清单.md) | **请你勾选确认后再开工** |

## 一句话总结

将 `packages/utils/docs`、`packages/plugins/docs` 两个独立 VitePress 站点合并为 **根目录 `docs/` 下的单一文档站**；共用一份配置与依赖，按包分栏导航，统一部署到 GitHub Pages。

## 推荐执行顺序

```
Phase 1  根目录 VitePress 脚手架（config、scripts、srcExclude）
   ↓
Phase 2  迁移 utils / plugins 文档内容与 @include 路径
   ↓
Phase 3  补充 node-utils、css 基础文档页
   ↓
Phase 4  统一部署脚本与 CI docs:build
   ↓
Phase 5  清理 packages/*/docs、更新 homepage 与旧 URL 重定向
```

## 确认方式

请打开 [07-确认清单.md](./07-确认清单.md)，在文末回复你的选择（或在对话中说明），例如：

> 确认执行，部署到 monorepo 的 GitHub Pages，旧独立仓库做 301 重定向

确认后我再按方案动手改代码。
