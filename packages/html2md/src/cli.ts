#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageToMarkdown } from './index.ts';

type OptValue = string | boolean;

export async function run(argv: string[]): Promise<void> {
  const { args, opts } = parseArgs(argv);
  if (opts.help === true || args.length === 0) {
    printHelp();
    return;
  }
  const target = args[0];
  const isUrl = /^(http|https):/i.test(target);
  const hosts: Record<string, string> = {};
  if (opts.selector) {
    const [selHost, selCss] = String(opts.selector).split('=', 2);
    hosts[selHost || '*'] = selCss || 'body';
  }

  const result = await pageToMarkdown({
    url: isUrl ? target : undefined,
    file: isUrl ? undefined : path.resolve(target),
    output: opts.out ? String(opts.out) : './dist',
    name: opts.name ? String(opts.name) : 'index',
    hosts,
    downloadImages: opts['no-images'] !== true,
  });

  console.log(`▸ 输出：${result.indexFile}`);
  console.log(`▸ 图片：${result.images.length} 张（\`${path.join(result.outputDir, 'images')}\`）`);
  if (result.title) console.log(`▸ 标题：${result.title}`);
}

function parseArgs(argv: string[]): { args: string[]; opts: Record<string, OptValue> } {
  const args: string[] = [];
  const opts: Record<string, OptValue> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq === -1) {
        const key = camelize(a.slice(2));
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('-')) {
          opts[key] = next;
          i++;
        } else {
          opts[key] = true;
        }
      } else {
        opts[camelize(a.slice(2, eq))] = a.slice(eq + 1);
      }
    } else if (a === '-h') {
      opts.help = true;
    } else if (a === '-o') {
      opts.out = argv[++i];
    } else {
      args.push(a);
    }
  }
  return { args, opts };
}

function camelize(k: string): string {
  return k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function printHelp(): void {
  console.log(`html2md — HTML 页面转 Markdown

用法
  html2md <url|html文件> [选项]

选项
  -o, --out <目录>      输出根目录，默认 ./dist（产物在 ./<name>/）
      --name <名字>     产物文件夹名，默认 index
      --selector <host=CSS>  捕获指定元素，如 localhost=body
      --no-images       不下载图片
  -h, --help            显示本帮助
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