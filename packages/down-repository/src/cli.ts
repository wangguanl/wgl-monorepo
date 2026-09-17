#!/usr/bin/env node

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { scaffold } from './index.ts';

export async function run(argv: string[]): Promise<void> {
  const target = argv[0];
  const gitRepo = argv[1];
  if (!target || !gitRepo) {
    console.log(`down-repository — 拉取代码仓库

用法
  down-repository <目标目录> <git远程地址>

示例
  down-repository myapp https://github.com/wangzhongquan/uk.git
  down-repository myapp wangguanl/special
`);
    return;
  }
  const r = await scaffold(gitRepo, { target, removeGit: true });
  console.log(`✓ 已克隆到：${r.target}`);
}

let invokedDirectly = false;
try {
  invokedDirectly =
    !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch {
  /* not direct */
}

if (invokedDirectly) {
  run(process.argv.slice(2)).catch((err: Error) => {
    console.error(`\n✗ ${err.message || err}`);
    process.exit(1);
  });
}