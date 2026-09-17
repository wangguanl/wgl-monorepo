---
layout: home
hero:
  name: "@wgl-m/html2md"
  text: "HTML2MD"
  tagline: HTML 页面 / 本地文件转 Markdown（图片本地化），API + CLI

  actions:
    - theme: brand
      text: 安装
      link: /packages/tools/html2md/install
    - theme: alt
      text: 用例
      link: /packages/tools/html2md/examples/htmlemd
---

features:
  - title: 三来源
    details: 支持在线 URL、本地 HTML 文件、CSS 选择器定点捕获三种抓取方式
  - title: 图片本地化
    details: 正文图片自动下载到 images/ 并相对引用；可 --no-images 关闭
  - title: Host 级定位
    details: hosts 映射按 hostname 指定要捕获的选择器，应对多样页面
  - title: 命名产物
    details: "产物落在 &lt;output&gt;/&lt;name&gt;/，默认 ./dist/index/"
---