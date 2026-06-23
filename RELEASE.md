# 发版指南

> 忘了怎么发版？只看本文即可。  
> 仓库：https://github.com/wangguanl/wgl-monorepo  
> npm scope：`@wgl-m/*`

---

## 一、日常发版（推荐 · GitHub Actions 自动）

**你只需做 3 步，发布由 GitHub 自动完成。**

### 第 1 步：创建 changeset

在项目根目录执行：

```bash
cd /Applications/My/Public/wgl-monorepo
pnpm changeset
```

按提示操作：

1. **空格**选中改动的包，**回车**确认  
2. 选择版本类型（见下方「版本怎么选」）  
3. 输入变更说明（会写入 CHANGELOG），如：`fix: 修复 debounce 边界问题`

### 第 2 步：提交并推送

```bash
git add -A
git commit -m "chore: add changeset"
git push
```

### 第 3 步：合并 Version PR

1. 打开 Actions 页面：  
   **https://github.com/wangguanl/wgl-monorepo/actions**
2. 等待 **Release** workflow 跑完（约 1～2 分钟）
3. 仓库会出现 PR，标题为 **`chore: version packages`**
4. **合并该 PR**
5. 合并后 Actions 会再次运行，自动 `build` + 发布到 npm

### 第 4 步：验证（可选）

```bash
npm view @wgl-m/utils version
npm view @wgl-m/plugins version
npm view @wgl-m/node-utils version
npm view @wgl-m/css version
```

或在浏览器打开：https://www.npmjs.com/org/wgl-m

---

## 二、版本怎么选

| 类型 | 何时用 | 示例 |
|------|--------|------|
| **patch** | Bug 修复、小改动 | `1.0.0 → 1.0.1` |
| **minor** | 新功能、向后兼容 | `1.0.0 → 1.1.0` |
| **major** | 破坏性变更 | `1.0.0 → 2.0.0` |

只改了某一个包，**只选那个包**即可，不必四个全选。

---

## 三、命令速查

```bash
# 进入项目
cd /Applications/My/Public/wgl-monorepo

# 安装依赖（换机器或 clone 后）
pnpm install

# 本地构建（发版前自测）
pnpm build

# 创建 changeset（发版第 1 步）
pnpm changeset

# 本地预览文档
pnpm docs:utils
pnpm docs:plugins
```

**以下命令由 GitHub Actions 自动执行，一般不需要手跑：**

```bash
pnpm version    # 更新版本号 + CHANGELOG
pnpm release    # build + 发布到 npm
```

---

## 四、发版流程图

```
改代码
  │
  ▼
pnpm changeset          ← 你本地执行
  │
  ▼
git commit && git push    ← 你本地执行
  │
  ▼
GitHub Actions 创建 PR    ← 自动（chore: version packages）
  │
  ▼
你合并 PR                 ← 你在 GitHub 网页操作
  │
  ▼
GitHub Actions 发布 npm   ← 自动（用 NPM_TOKEN）
  │
  ▼
完成 ✅
```

---

## 五、手动发版（备用）

Actions 失败或急需发布时使用。

```bash
cd /Applications/My/Public/wgl-monorepo

# 1. 创建 changeset
pnpm changeset

# 2. 更新版本
pnpm version

# 3. 提交
git add -A
git commit -m "chore: version packages"
git push

# 4. 本机发布（需要 npm OTP 验证码）
pnpm release
```

若提示 `EOTP`，在 Authenticator 获取 6 位码后：

```bash
NPM_CONFIG_OTP=123456 pnpm release
```

或逐个包发布：

```bash
pnpm build
cd packages/utils && npm publish --access public
cd ../plugins && npm publish --access public
cd ../node-utils && npm publish --access public
cd ../css && npm publish --access public
```

---

## 六、包与目录对照

| npm 包名 | 源码目录 | 安装命令 |
|----------|----------|----------|
| `@wgl-m/utils` | `packages/utils` | `pnpm add @wgl-m/utils` |
| `@wgl-m/plugins` | `packages/plugins` | `pnpm add @wgl-m/plugins` |
| `@wgl-m/node-utils` | `packages/node-utils` | `pnpm add @wgl-m/node-utils` |
| `@wgl-m/css` | `packages/css` | `pnpm add @wgl-m/css` |

---

## 七、常见问题

### Actions 没创建 Version PR？

- 确认 push 里包含 `.changeset/*.md` 文件  
- 到 Actions 页看 **Release** 是否报错  
- 确认分支是 `master`

### 发布失败 `403` / `EOTP`？

- GitHub Actions：检查 Secret **`NPM_TOKEN`** 是否有效  
- Token 需有 **wgl-m** 组织的写权限，并勾选 **Bypass 2FA for automation**  
- 本机发布：需 `npm login` 并输入 OTP

### 只发成功了一部分包？

并行发布时 OTP 可能只够第一个包。用手动发版「逐个包 publish」补发即可。

### npm 上看不到新版本？

- 官方 npm 一般 1～2 分钟  
- 淘宝镜像（npmmirror）可能延迟数小时，以 https://www.npmjs.com 为准

---

## 八、相关链接

| 用途 | 地址 |
|------|------|
| GitHub 仓库 | https://github.com/wangguanl/wgl-monorepo |
| GitHub Actions | https://github.com/wangguanl/wgl-monorepo/actions |
| npm 组织 | https://www.npmjs.com/org/wgl-m |
| npm Token 管理 | https://www.npmjs.com/settings/wgl1119/tokens |
| utils 文档 | https://wangguanl.github.io/page__package-utils/ |
| plugins 文档 | https://wangguanl.github.io/page__package-plugins/ |

更多细节见 [PUBLISHING.md](./PUBLISHING.md)（首次配置）、[MIGRATION.md](./MIGRATION.md)（旧包名迁移）。
