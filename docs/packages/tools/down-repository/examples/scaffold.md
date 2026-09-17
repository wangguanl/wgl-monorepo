# 脚手架

## 克隆并脱 git

```ts
import { scaffold } from '@wgl-m/down-repository';

const r = await scaffold('https://github.com/wangzhongquan/uk.git', {
  target: './myapp', // 目标目录（自动创建）
  removeGit: true, // 移除 .git，默认 true
});
// → { target: '/abs/path/myapp', gitRepo }
```

`scaffold(gitRepo, { target, removeGit })` 先克隆到目标目录，默认再删除其 `.git/`。
传 `removeGit: false` 可保留上游 git 历史。

## 常见用途

- 换皮：把开源模板克隆下来改造成自己的项目
- 多语言脚手架：保留仓库文件、重开 git 历史，方便后续提交自己的改动

> 私有仓库可能挂起且失败；请确认远程地址公开可访问。