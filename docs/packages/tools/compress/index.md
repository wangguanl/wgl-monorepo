---
layout: home
hero:
  name: "@wgl-m/compress"
  text: "Compress"
  tagline: 图片压缩管线（sharp）— 压缩 / 转格式 / 缩放 / 裁剪 / 水印，API + CLI

  actions:
    - theme: brand
      text: 安装
      link: /packages/tools/compress/install
    - theme: alt
      text: 用例
      link: /packages/tools/compress/examples/compress
---

features:
  - title: 核心管线
    details: 单文件 input → 输出 Buffer 或写盘；quality 质量 + lossless 无损控制
  - title: 转换与裁剪
    details: 目标格式 jpg/png/webp/avif/tiff/gif；等比缩放、居中或绝对坐标裁剪
  - title: 图像处理
    details: rotate 旋转、stripMeta 去元数据、文字/图片水印合成
  - title: 目录批量
    details: "CLI 支持目录递归批量，输出到 &lt;原目录&gt;/compressed/ 同构子目录"
---