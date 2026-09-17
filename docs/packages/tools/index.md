---
layout: home

hero:
  name: "@wgl-m/tools"
  text: "Tools"
  tagline: 下载 / 转换命令行工具箱 — 每款均可 CLI 独立使用，也被本地门户统一消费

  actions:
    - theme: brand
      text: Down Img
      link: /packages/tools/down-img/
    - theme: alt
      text: Html2Md
      link: /packages/tools/html2md/
    - theme: alt
      text: Compress
      link: /packages/tools/compress/
    - theme: alt
      text: Down M3U8
      link: /packages/tools/down-m3u8/
    - theme: alt
      text: Trans Bili
      link: /packages/tools/trans-bilibili/
    - theme: alt
      text: Down Repo
      link: /packages/tools/down-repository/
---

## 工具箱

| 工具 | 包名 | 说明 |
|------|------|------|
| 图片批量下载 | `@wgl-m/down-img` | 网络图片批量下载，零依赖 Node 原生 fetch |
| HTML → Markdown | `@wgl-m/html2md` | 页面 / 本地文件转 Markdown，图片本地化 |
| 图片压缩 | `@wgl-m/compress` | sharp 管线：压缩 / 转格式 / 缩放 / 裁剪 / 水印 |
| M3U8 下载 | `@wgl-m/down-m3u8` | 流下载并转封装 mp4（ffmpeg） |
| B 站转译 | `@wgl-m/trans-bilibili` | B 站缓存目录合成 mp4（ffmpeg） |
| 仓库脚手架 | `@wgl-m/down-repository` | 克隆仓库并移除 .git |

统一 CLI 速查见[六工具 CLI 用法说明](/cli-usage)。本地门户 `tool__wgl-toolkit` 把以上全部工具 + `@wgl-m/web-kit` 整合为一个 Web 界面，免去记忆命令参数。