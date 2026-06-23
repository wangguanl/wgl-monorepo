# TypeScript 迁移方案

> **状态：已完成** — TypeScript 迁移已按默认方案执行完毕。

## 文档索引

| 文档 | 内容 |
|------|------|
| [01-现状分析.md](./01-现状分析.md) | 当前技术栈、文件规模、痛点 |
| [02-目标与原则.md](./02-目标与原则.md) | 迁移目标、约束、不做的事 |
| [03-技术选型.md](./03-技术选型.md) | TS 配置、打包工具、类型导出策略 |
| [04-分阶段计划.md](./04-分阶段计划.md) | Phase 1～4 执行顺序与工期估算 |
| [05-分包方案.md](./05-分包方案.md) | 四个包各自的迁移细节 |
| [06-目录结构.md](./06-目录结构.md) | 迁移后的 monorepo 目录预览 |
| [07-Breaking-Changes.md](./07-Breaking-Changes.md) | 对外 API 影响与版本策略 |
| [08-确认清单.md](./08-确认清单.md) | **请你勾选确认后再开工** |

## 一句话总结

将 `packages/utils`、`packages/plugins`、`packages/node-utils` 的源码从 JavaScript 迁移为 TypeScript；统一用 **tsup** 打包并输出 `.d.ts`；`packages/css` 保持现状（纯样式，不迁移）。

## 推荐执行顺序

```
Phase 1  基础设施（根 tsconfig、共享配置）
   ↓
Phase 2  node-utils（最小，验证流水线）
   ↓
Phase 3  plugins（已有 tsup，改动最小）
   ↓
Phase 4  utils（最大，Webpack → tsup）
   ↓
Phase 5  文档与 CI 更新
```

## 确认方式

请打开 [08-确认清单.md](./08-确认清单.md)，在文末回复你的选择（或在对话中说明），例如：

> 确认执行，Phase 1～4 全部做，strict 模式先不开

确认后我再按方案动手改代码。
