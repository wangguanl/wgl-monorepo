# 图片压缩

## 基础压缩

```ts
import { compressImage } from '@wgl-m/compress';

const r = await compressImage('photo.jpg', {
  quality: 70, // 质量，默认 75
  format: 'webp', // 目标格式
  output: './compressed/photo.jpg', // 写盘；不传则返回 Buffer
  overwrite: true,
});
// → { data, info: { width,height,format,size }, bytesSaved, beforeBytes }
console.log(`${r.info.width}×${r.info.height}  ${r.beforeBytes} → ${r.info.size} 字节`);
```

## 缩放与裁剪

```ts
await compressImage('img.png', { resize: { width: 800, height: 600 }, output: 'a.png' }); // 等比放到 800×600 以内
await compressImage('img.png', { crop: { width: 1200, height: 400 }, output: 'b.png' }); // 居中裁剪
await compressImage('img.png', {
  crop: { width: 400, height: 300, left: 10, top: 20 }, // 绝对坐标裁剪
  output: 'c.png',
});
```

## 旋转与去元数据

```ts
await compressImage('t.jpg', { rotate: 90, stripMeta: true, output: 't-90.jpg' });
```

## 文字水印

```ts
await compressImage('shot.jpg', {
  watermark: { text: '© Mr.Wang', position: 'southeast', opacity: 0.6, fontSize: 28, color: '#ffffff', margin: 16 },
  output: 'wm.jpg',
});
```

不传 `output` 时以 `data: Buffer` 返回，适合后续内存级处理；传 `output` 则写盘并返回该文件信息。