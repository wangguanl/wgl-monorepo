---
layout: home
hero:
  name: "@wgl-m/down-repository"
  text: "Down Repository"
  tagline: 克隆 Git 仓库并移除 .git，得到可二次修改的模板工程（脚手架）

  actions:
    - theme: brand
      text: 安装
      link: /packages/tools/down-repository/install
    - theme: alt
      text: 用例
      link: /packages/tools/down-repository/examples/scaffold
---

features:
  - title: 一键脚手架
    details: 克隆任意仓库 → 剥离 .git，立即获得可重新初始化的工程骨架
  - title: 双地址格式
    details: 支持完整 URL 与 owner/repo 缩写两种远程写法
  - title: 目录自建
    details: 目标目录不存在时自动创建（含多级）
  - title: 默认脱 git
    details: removeGit 默认开启，避免把上游历史误当自己的提交基线
---