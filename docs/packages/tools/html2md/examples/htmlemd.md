# HTML → Markdown

## 在线 URL 转 Markdown

```ts
import { pageToMarkdown } from '@wgl-m/html2md';

const r = await pageToMarkdown({
  url: 'https://example.com/article',
  output: './dist', // 产物在 ./dist/<name>
  name: 'post', // 文件夹名
});
// → { outputDir, indexFile, images: [], markdown, title?, sourceUrl? }
console.log(`输出：${r.indexFile}`);
console.log(`标题：${r.title}`);
```

## 本地 HTML 文件

```ts
const r = await pageToMarkdown({
  file: './saved/page.html',
  name: 'archived',
});
```

## 定点捕获（仅抓指定元素）

`hosts` 以 `hostname → CSS 选择器` 映射；不匹配的 host 回退到 `body`。也适合多个不同页面共用一个抓取配置：

```ts
const r = await pageToMarkdown({
  url: 'https://localhost:3000/page',
  hosts: { localhost: 'body', 'example.com': '.article-body' },
  downloadImages: false, // 不下载图片，只取文本
});
```

## 产物结构

```
<output>/<name>/
├─ index.md
└─ images/          # 本地化的正文图片（downloadImages 开启时）
```

返回的 `markdown` 为全文文本，`images` 为已下载图片的绝对路径列表。