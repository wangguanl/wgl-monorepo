# 本地引用指南（未发版时跨仓库消费组件包）

> 三组件包尚未发布 npm。发版后本页大部分内容可跳过——直接 `pnpm add @wgl-m/folder-tree-vue` 即可，workspace 声明也会被 changesets 自动替换为真实版本号。

## 消费方式选型

| 场景 | 用什么 | 说明 |
|------|--------|------|
| Vue 项目要现成组件 | `@wgl-m/folder-tree-vue` | 自绘树 + `#icon` 插槽注入自己的图标体系 |
| React 项目要现成组件 | `@wgl-m/folder-tree-react` | 自绘树 + `renderIcon` 注入图标 |
| 只要"路径转树"逻辑，UI 自己画 | `@wgl-m/folder-tree`（core） | 纯函数，零依赖，任何渲染器可用 |

判断依据：**要组件**（壳 + 核心两层）还是**只要逻辑**（仅核心一层）。

## 推荐：workspace:* 协议（当前两个消费方在用）

`pnpm link` 的缺陷：被 link 的包脱离消费方 workspace 语境，其内部的 `workspace:*` 传递依赖失效，消费方被迫手动声明每一条。**正确姿势是把组件包纳入消费方的 workspace globs**，依赖声明只用一条：

### 消费方配置

```yaml
# <消费方>/pnpm-workspace.yaml
packages:
  - '.'                      # 或原有的 client/server 等
  - '<相对路径>/wgl-monorepo/packages/components/*'   # 纳入全部组件包
```

```jsonc
// <消费方>/package.json（只声明直接消费的那一个）
{
  "dependencies": {
    "@wgl-m/folder-tree-vue": "workspace:*"
    // core 是它的传递依赖，无需声明 —— workspace 链接自动解析
  }
}
```

然后 `pnpm install --no-frozen-lockfile` 重装。

### 依赖解析链

```
消费方 ──workspace 链接──> folder-tree-vue ──workspace:*──> folder-tree
                            （由 monorepo 侧 node_modules 解析，消费方零感知）
```

### 实际案例

| 消费方 | 声明 | 消费内容 |
|--------|------|---------|
| lego（Vue） | `@wgl-m/folder-tree-vue: workspace:*` 一条 | Vue 壳组件 + `#icon` 插槽接 TagIcon |
| work shop（React） | `@wgl-m/folder-tree: workspace:*` 一条 | 仅 core 逻辑，UI 用自己的 antd Tree |
| compress-img（CLI 工具，npm→pnpm 迁移） | `@wgl-m/down-img: workspace:*` 一条 | 图片下载 API（URL 输入 → 下载 → sharp 压缩） |
| down-img（专职下载工具 · 壳工程） | `@wgl-m/down-img: workspace:*` 一条 | CLI 入口（bin 调包的 `./cli` run，仓库只留清单与入口） |
| monorepo 内部 | 同上 | workspace 内天然支持 |

## 注意事项（踩过的坑）

### 1. Vue 壳改源码要重建 dist

workspace 链接指向包目录，运行时加载的是 `dist/` 产物，不是 `src/`：

```bash
cd /Applications/My/Public/wgl-monorepo
pnpm --filter @wgl-m/folder-tree-vue build    # 改完源码执行
```

高频迭代可加 watch 脚本（`vite build --watch` / `tsup --watch`）。

### 2. Vue 消费方需 dedupe vue

壳的 dist 里 `import 'vue'` 默认会解析到 monorepo 自己的 node_modules，与消费方的 vue 形成双实例（症状：`renderSlot` 报 `Cannot read properties of null`）。消费方 vite 配置需强制单实例：

```ts
// vite.config.<ts|js>
export default {
  resolve: {
    dedupe: ['vue'],  // 组件 dist 与应用共用同一份 vue runtime
  },
}
```

### 3. React 壳 / core 无此问题

core 是纯逻辑零依赖；React 壳的样式以 TS 常量内置（运行时注入 `<style>`），CSS 也不需要消费方手动引入。Vue 壳样式由 `vite-plugin-lib-inject-css` 自动注入（import JS 即带样式），同样零配置。

### 4. 类型解析需要 dist 先构建

`package.json` 的 `exports` 指向 `dist/`，消费方 IDE / tsc 解析类型前，组件包至少要跑过一次 build（clone 后先 `pnpm install && pnpm build`）。

### 5. work shop 式精确纳入

只用 core 时，workspace globs 可以精确到单包（`'.../components/folder-tree'`）而不必 `components/*`；以后要用 vue/react 壳再扩成通配。

## 发版后的终态

```bash
# 消费方切换为正式依赖（替换 workspace:*）
pnpm add @wgl-m/folder-tree-vue     # lego
pnpm add @wgl-m/folder-tree         # work shop

# 并从 pnpm-workspace.yaml 的 packages 里移除 monorepo 路径
```

版本锁定进 lockfile、CI 可复现，与本地开发彻底解耦。
