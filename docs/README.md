# 文档索引

本目录为 monorepo 统一文档站点（VitePress）。

## 启动

```bash
pnpm docs        # 本地预览
pnpm docs:build  # 构建
```

## 规划方案

| 方案 | 状态 | 说明 |
|------|------|------|
| [TypeScript 迁移](./typescript-migration/README.md) | 已完成 | 源码 TS 化、tsup 统一打包 |
| [统一文档站点](./documentation-site/README.md) | 已完成 | 合并分散的 VitePress 站点 |

## 使用指南

| 文档 | 说明 |
|------|------|
| [本地引用指南](./local-usage.md) | 未发版时跨仓库消费组件包（workspace:* 协议、踩坑记录） |
| [六工具 CLI 用法说明](./cli-usage.md) | wgl-compress / down-img / html2md / down-m3u8 / trans-bilibili / down-repository 命令速查 |

## 下载/转换工具包

每个工具包在文档站点有独立页（安装 + 用例），也一并被本地门户 `tool__wgl-toolkit` 消费：

| 包 | 站点（/packages/tools/...） | 一句话 |
|----|------------------------------|--------|
| `@wgl-m/compress` | [compress](packages/tools/compress/) | 图片压缩 / 转格式 / 缩放 / 裁剪 / 水印 |
| `@wgl-m/down-img` | [down-img](packages/tools/down-img/) | 网络图片批量下载 |
| `@wgl-m/html2md` | [html2md](packages/tools/html2md/) | HTML 页面/文件转 Markdown |
| `@wgl-m/down-m3u8` | [down-m3u8](packages/tools/down-m3u8/) | M3U8 流下载转封装 mp4 |
| `@wgl-m/trans-bilibili` | [trans-bilibili](packages/tools/trans-bilibili/) | B 站缓存目录合成 mp4 |
| `@wgl-m/down-repository` | [down-repository](packages/tools/down-repository/) | 克隆仓库并移除 .git |
