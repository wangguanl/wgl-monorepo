---
layout: home
hero:
  name: "@wgl-m/down-img"
  text: "Down Img"
  tagline: 网络图片批量下载工具包 — 零依赖（Node 18+ 原生 fetch），API + CLI

  actions:
    - theme: brand
      text: 安装
      link: /packages/down-img/install
    - theme: alt
      text: 用例
      link: /packages/down-img/examples/download
---

features:
  - title: 并发批量下载
    details: 内置并发池（默认 4，可调 1-64），批量 URL 一次拉齐，失败不中断整批
  - title: 幂等可重跑
    details: 已存在同名文件默认跳过，可反复执行；overwrite 强制覆盖
  - title: 智能文件名
    details: 取自 URL 路径；无扩展名按响应 content-type 补全；规整 xx.jpg@759w 式处理参数
  - title: 稳健传输
    details: 超时控制 + 自动重试（退避递增），先落临时文件再原子改名，不留半截文件
---
