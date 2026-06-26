# 使用指南

## 安装

::: code-group

```bash [npm]
npm install @wgl-m/css -S
```

```bash [pnpm]
pnpm add @wgl-m/css
```

```bash [yarn]
yarn add @wgl-m/css
```

:::

## 引入方式

### CSS Reset

```js
// 全量引入
import '@wgl-m/css';

// 或指定导出路径
import '@wgl-m/css/reset';
```

### SCSS Mixin

```scss
@use '@wgl-m/css/mixin';
```

### BEM

```scss
@use '@wgl-m/css/bem';
```

## 导出

| 导出路径 | 内容 | 说明 |
|----------|------|------|
| `@wgl-m/css` | `reset.css` | 默认导出，CSS Reset |
| `@wgl-m/css/reset` | `reset.css` | 同上 |
| `@wgl-m/css/mixin` | `mixin.scss` | SCSS Mixin 工具集 |
| `@wgl-m/css/bem` | `BEM.scss` | BEM 命名工具 |