# 07 - Breaking Changes

## 版本策略

| 包 | 当前版本 | 建议迁移后版本 | 级别 | 原因 |
|----|----------|----------------|------|------|
| `@wgl-m/node-utils` | 2.0.0 | **2.1.0** | minor | 仅新增类型，API 不变 |
| `@wgl-m/plugins` | 1.0.0 | **1.1.0** | minor | 仅新增类型，API 不变 |
| `@wgl-m/utils` | 2.0.0 | **3.0.0** | major | 产物路径变更 + 移除 ES5 |
| `@wgl-m/css` | 2.0.0 | 不变 | — | 不迁移 |

---

## @wgl-m/utils  Breaking Changes（major）

### 1. 移除 ES5 UMD 产物

| 移除 | 替代 |
|------|------|
| `dist/main.js` | `dist/index.js` (ESM) 或 `dist/index.cjs` (CJS) |
| 全局变量 `Wgl` | 模块化 import |

**影响：** 使用 `<script src=".../main.js">` + `Wgl.xxx()` 的老项目需改为 ESM。

### 2. 产物文件名变更

| 旧路径 | 新路径 |
|--------|--------|
| `dist/main.mjs` | `dist/index.js` |
| `dist/main.cjs` | `dist/index.cjs` |
| `dist/es/debounce.mjs` | `dist/es/debounce.js` |

**影响：** 直接引用 dist 文件路径的使用者需更新。

### 3. package.json exports 变更

旧：

```json
"exports": {
  ".": {
    "import": "./dist/main.mjs",
    "require": "./dist/main.cjs"
  },
  "./es/*": "./dist/es/*.mjs"
}
```

新：

```json
"exports": {
  ".": {
    "import": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    }
  },
  "./es/*": {
    "import": {
      "types": "./dist/es/*.d.ts",
      "default": "./dist/es/*.js"
    }
  }
}
```

**影响：** 通过 `import from '@wgl-m/utils'` 的标准用法**不受影响**；直接写 dist 路径的需更新。

---

## @wgl-m/node-utils Breaking Changes

### 产物从源码直发改为 dist

| 旧 | 新 |
|----|-----|
| `"main": "./index.js"` | `"main": "./dist/index.cjs"` |
| `"files": ["index.js"]` | `"files": ["dist"]` |

**影响：** 若有使用者直接 `require('@wgl-m/node-utils/index.js')` 需改；标准 import 不受影响。

---

## @wgl-m/plugins Breaking Changes

**无 API breaking change。** 仅新增 `.d.ts`。

产物路径不变（已是 `dist/index.js` / `dist/index.cjs`）。

---

## 迁移公告模板（发版时可贴到 CHANGELOG）

```markdown
## @wgl-m/utils 3.0.0

### Breaking Changes

- 移除 ES5 UMD 产物（`main.js` / 全局变量 `Wgl`）
- 产物文件名从 `main.mjs` / `main.cjs` 改为 `index.js` / `index.cjs`
- ESM 分包从 `*.mjs` 改为 `*.js`

### Features

- 全面 TypeScript 重写
- 发布 `.d.ts` 类型声明

### Migration

// 旧
import { deepCopy } from '@wgl-m/utils'           // 仍可用 ✅
import { debounce } from '@wgl-m/utils/es/debounce.mjs'  // 需改 ❌

// 新
import { debounce } from '@wgl-m/utils/es/debounce'      // ✅
```

---

## 是否需要保留 ES5 产物？

| 选项 | 说明 |
|------|------|
| **A. 不保留（推荐）** | 发 major，简化维护 |
| **B. 保留** | tsup 加 `format: ['iife']` 额外输出，增加配置复杂度 |

请在 [08-确认清单.md](./08-确认清单.md) 中选择。
