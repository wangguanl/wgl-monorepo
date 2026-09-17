---
layout: home
hero:
  name: "@wgl-m/trans-bilibili"
  text: "Trans Bilibili"
  tagline: B 站客户端缓存目录合成 mp4（ffmpeg），按合集分层输出，API + CLI

  actions:
    - theme: brand
      text: 安装
      link: /packages/tools/trans-bilibili/install
    - theme: alt
      text: 用例
      link: /packages/tools/trans-bilibili/examples/convert
---

features:
  - title: 缓存转视频
    details: 读取 download 目录，把 video/audio m4s 与 .blv 片断合成 mp4
  - title: 合集分层
    details: 按合集目录建子目录输出，保序命名，重名带后缀不覆盖
  - title: 异常隔离
    details: 单集失败不中断整批，结尾汇总失败清单；已存在则跳过
  - title: 进度反馈
    details: onProgress 逐条回调「正在合成 / 片段进度 / 转译 %」
---