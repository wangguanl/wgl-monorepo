# 首次发布指南

按顺序执行，不要跳步。

## 第一步：创建 @wgl Organization（网页操作）

1. 打开：**https://www.npmjs.com/org/create**
2. **Organization name** 填写：`wgl`
3. 套餐选择：**Unlimited public packages**（免费公开包）
4. 点击创建，按提示完成

创建成功后，访问 **https://www.npmjs.com/settings/wgl/members**，确认你的账号是 **Owner**。

> 若 `wgl` 名称已被占用，可改用其他名称（如 `wgl-libs`），但需同步修改各包的 `@wgl/*` 包名。

---

## 第二步：在终端登录 npm（必做）

**在 npmjs.com 网页登录 ≠ 终端已登录。** 必须在本地终端执行：

```bash
npm login
```

按提示输入：
- Username（npm 用户名）
- Password
- Email
- OTP（若开启了两步验证）

验证是否成功：

```bash
npm whoami
# 应输出你的 npm 用户名
```

---

## 第三步：创建 Changeset（记录本次发布）

在项目根目录：

```bash
cd /Applications/My/Public/wgl-monorepo
pnpm changeset
```

交互式选择：
1. 空格选中要发布的包（首次建议全选：`@wgl/utils`、`@wgl/plugins`、`@wgl/node-utils`、`@wgl/css`）
2. 回车确认
3. 每个包选择版本类型（首次发布选 **major** 或保持当前版本选 **patch**）
4. 输入变更说明，如：`init monorepo release`

会在 `.changeset/` 下生成一个 `.md` 文件。

---

## 第四步：更新版本号

```bash
pnpm version
```

这会：
- 更新各包 `package.json` 的 version
- 生成 `CHANGELOG.md`
- 删除已消费的 changeset 文件

然后提交并推送：

```bash
git add -A
git commit -m "chore: version packages"
git push
```

---

## 第五步：构建并发布

```bash
pnpm release
```

等价于 `pnpm build && changeset publish`，会把包发布到 npm。

---

## 常见报错

### `ENEEDAUTH` / `need auth`

终端未登录，执行 `npm login`。

### `402 Payment Required` 或 `scope must be paid`

scoped 包未设为 public。项目根目录已有 `.npmrc`（`access=public`），各包也有 `publishConfig.access: "public"`。若仍报错：

```bash
npm publish --access public
```

### `403 Forbidden` — package name too similar

`@wgl/utils` 可能与已有包冲突，或你没有 `@wgl` org 权限。先完成 Organization 创建，并确认你是 Owner。

### `404 Not Found` — PUT @wgl/xxx

Organization `@wgl` 不存在，或你无权向该 scope 发布。回到第一步创建 org。

### `changeset` 没有生成文件

需交互式运行 `pnpm changeset` 并选中至少一个包，不能只做 `pnpm version`（没有 changeset 文件时 version 不会改版本）。

---

## 发布后：废弃旧包（可选）

```bash
npm deprecate wgl-utils "已迁移至 @wgl/utils，请升级"
npm deprecate wgl-css "已迁移至 @wgl/css，请升级"
npm deprecate wgl-node-utils "已迁移至 @wgl/node-utils，请升级"
```

---

## 快速检查清单

- [ ] https://www.npmjs.com/org/create 已创建 `wgl` org
- [ ] `npm whoami` 有输出
- [ ] `pnpm changeset` 已生成 `.changeset/*.md`
- [ ] `pnpm version` 已更新版本并 commit
- [ ] `pnpm release` 成功
