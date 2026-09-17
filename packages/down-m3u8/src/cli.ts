#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { downloadM3u8 } from './single.ts';

export async function run(argv: string[]): Promise<void> {
  const { args, opts } = parseArgs(argv);
  if (opts.help === true || args.length === 0) {
    printHelp();
    return;
  }
  const url = args[0];
  if (!/^https?:\/\//i.test(url)) throw new Error(`需要 http/https 的 m3u8 链接：${url}`);

  const output = opts.out ? String(opts.out) : './dist';
  const name = opts.name ? String(opts.name) : undefined;

  const r = await downloadM3u8(url, {
    output,
    name,
    onProgress: (p) => {
      if (p.percent != null) process.stdout.write(`\r▸ 下载中 ${p.percent.toFixed(1)}%`);
    },
  });

  if (r.skipped) {
    console.log(`\n⏭ 已存在：${r.file}`);
  } else {
    console.log(`\n✓ ${r.file}`);
  }
}

function parseArgs(argv: string[]): { args: string[]; opts: Record<string, string | boolean> } {
  const args: string[] = [];
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h') opts.help = true;
    else if (a === '-o') opts.out = argv[++i];
    else if (a === '--name') opts.name = argv[++i];
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        opts[key] = next;
        i++;
      } else {
        opts[key] = true;
      }
    } else {
      args.push(a);
    }
  }
  return { args, opts };
}

function printHelp(): void {
  console.log(`down-m3u8 — M3U8 视频下载（ffmpeg 转封装）

用法
  down-m3u8 <m3u8-url> [选项]

选项
  -o, --out <目录>   输出目录，默认 ./dist
      --name <名字>  输出文件名（不含扩展名）
  -h, --help         显示本帮助
`);
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