#!/usr/bin/env node

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { convertBilibiliCache } from './index.ts';

export async function run(argv: string[]): Promise<void> {
  const input = argv[0];
  const output = argv[1] || './dist';
  if (!input) {
    console.log('用法：trans-bilibili <缓存目录download> [输出目录]\n示例：trans-bilibili ./download ./dist');
    return;
  }
  const r = await convertBilibiliCache(input, output, {
    onProgress: (msg) => console.log(msg),
  });
  console.log(`\nΣ ${r.merged}/${r.total} 个视频合成完成（输出：${r.outputDir}）`);
  if (r.errors.length) {
    console.log(`失败 ${r.errors.length} 个，共 ${r.errors.map((e) => e.video).join('、')}`);
    process.exitCode = 1;
  }
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