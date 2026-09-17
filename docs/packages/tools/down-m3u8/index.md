---
layout: home
hero:
  name: "@wgl-m/down-m3u8"
  text: "Down M3U8"
  tagline: M3U8 视频流下载，ffmpeg 转封装为 mp4，API + CLI

  actions:
    - theme: brand
      text: 安装
      link: /packages/tools/down-m3u8/install
    - theme: alt
      text: 用例
      link: /packages/tools/down-m3u8/examples/download
---

features:
  - title: 单文件下载
    details: 抓取流并转封装为单一 mp4，产出即用；输出名可指定
  - title: 幂等跳过
    details: 已存在同名输出默认跳过，可反复执行
  - title: 进度回传
    details: onProgress 回调百分比，适合进度条 / 任务栏展示
  - title: 文件名规整
    details: 依 URL 末段取安全文件名，非法字符自动替换
---