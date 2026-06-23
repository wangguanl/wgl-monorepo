# 首次发布指南

按顺序执行，不要跳步。

当前 monorepo 使用的 npm scope 为 **`@wgl-m/*`**，对应 Organization 名称 **`wgl-m`**。

---

## 第一步：确认 Organization 已创建

你应已创建 Organization：**wgl-m**

管理地址：**https://www.npmjs.com/settings/wgl-m/members**

确认你的账号（`wgl1119`）是 **Owner**。

> 包名 `@wgl-m/utils` 中的 `wgl-m` 必须与 Organization 名称完全一致。

---

## 第二步：开启双因素认证 2FA（发布必须）

你遇到的 `403 Forbidden - Two-factor authentication ... is required to publish` 即此问题。

npm **发布包** 要求账号开启 2FA：

1. 打开：**https://www.npmjs.com/settings/wgl1119/tfa**
2. 启用 **Authorization and publishing**（授权和发布）级别的 2FA
3. 用手机 Authenticator App（Google Authenticator 等）绑定

开启后，**重新登录终端**：

```bash
npm logout
npm login
# 输入用户名、密码、邮箱、以及 Authenticator 的 6 位 OTP
npm whoami
# 应输出：wgl1119
```

---

## 第三步：在终端登录 npm

**网页登录 ≠ 终端已登录。**

```bash
npm login
```

---

## 第四步：创建 Changeset

```bash
cd /Applications/My/Public/wgl-monorepo
pnpm changeset
```

交互式选择要发布的包，输入变更说明。

> 若之前已执行过 `pnpm version` 且没有新的 changeset 文件，需重新 `pnpm changeset` 才能再次发布新版本；或首次发布可直接 `pnpm release`（版本号已在 package.json 中）。

---

## 第五步：更新版本号（有 changeset 时）

```bash
pnpm version
git add -A
git commit -m "chore: version packages"
git push
```

---

## 第六步：构建并发布

```bash
pnpm release
```

---

## 常见报错

### `403` — Two-factor authentication ... is required

**原因：** 未开启 2FA，或 `npm login` 时未输入 OTP。

**解决：** 见第二步，开启 2FA 后 `npm logout` → `npm login`。

### `403` — You do not have permission to publish

**原因：** Organization 名称与包 scope 不一致（例如 org 是 `wgl-m` 但包名是 `@wgl/utils`）。

**解决：** 包名必须是 `@wgl-m/*`。

### `ENEEDAUTH` / `need auth`

终端未登录，执行 `npm login`。

### `402 Payment Required`

scoped 包需 public。根目录 `.npmrc` 已配置 `access=public`。

---

## 发布后：废弃旧包（可选）

```bash
npm deprecate wgl-utils "已迁移至 @wgl-m/utils，请升级"
npm deprecate wgl-css "已迁移至 @wgl-m/css，请升级"
npm deprecate wgl-node-utils "已迁移至 @wgl-m/node-utils，请升级"
```

---

## 快速检查清单

- [ ] Organization `wgl-m` 已创建，你是 Owner
- [ ] 已开启 2FA（Authorization and publishing）
- [ ] `npm logout` → `npm login` 并输入 OTP
- [ ] `npm whoami` 输出 `wgl1119`
- [ ] 包名为 `@wgl-m/*`（不是 `@wgl/*`）
- [ ] `pnpm release` 成功
