#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { downloadImages } from './download.ts';
/** CLI 选项：字符串值或布尔 flag */
type OptValue = string | boolean;
interface ParsedArgs {
  args: string[];
  opts: Record<string, OptValue>;
}

export async function run(argv: string[]): Promise<void> {
  const { args, opts } = parseArgs(argv);

  // 无参数 / --help：打印帮助
  if (opts.help === true || (args.length === 0 && !opts.file)) {
    printHelp();
    return;
  }

  // 汇总链接：命令行参数 + --file JSON 数组
  const urls = [...args];
  if (opts.file) {
    const filePath = path.resolve(String(opts.file));
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown[];
    if (!Array.isArray(list)) throw new Error(`--file 需要一个 JSON 数组文件：${filePath}`);
    urls.push(...(list as string[]));
  }

  const invalid = urls.filter((u) => !/^https?:\/\//i.test(String(u)));
  if (invalid.length) throw new Error(`仅支持 http/https 链接：${invalid.join('、')}`);

  if (opts.concurrency != null && (!(Number(opts.concurrency) >= 1) || Number(opts.concurrency) > 64))
    throw new Error('并发数范围 1-64');

  const dlOpts = {
    output: opts.out ? String(opts.out) : './dist',
    prefix: opts.prefix ? String(opts.prefix) : '',
    overwrite: opts.overwrite === true,
    timeout: opts.timeout ? Number(opts.timeout) : 30_000,
    retries: opts.retries != null ? Number(opts.retries) : 2,
  };

  console.log(`▸ 输出：${path.resolve(dlOpts.output)}`);
  console.log(`▸ 数量：${urls.length} 张，并发 ${Number(opts.concurrency) || 4}\n`);

  const results = await downloadImages(urls, dlOpts, {
    concurrency: Number(opts.concurrency) || 4,
    onProgress: (err, r) => {
      if (err) console.error(`  ✗ ${r.url} — ${err.message}`);
      else {
        const done = r as { skipped: boolean; path: string; bytes: number };
        console.log(
          `  ${done.skipped ? '⏭' : '✓'} ${path.basename(done.path)}  ${fmtKB(done.bytes)}${done.skipped ? '（已存在，跳过）' : ''}`
        );
      }
    },
  });

  const ok = results.filter((r) => r.ok);
  const fail = results.filter((r) => !r.ok);
  const bytes = ok.reduce((s, r) => s + (r.ok ? r.bytes : 0), 0);
  console.log(
    `\nΣ ${ok.length}/${results.length} 张成功，共 ${fmtKB(bytes)}${fail.length ? `，${fail.length} 张失败（见上方 ✗ 行）` : ''}`
  );
  if (fail.length) process.exitCode = 1;
}

/* ------------------------------------------------------------------ */
/* 参数解析                                                            */
/* ------------------------------------------------------------------ */
const SHORT_OPTS = new Set(['o', 'h']);

function parseArgs(argv: string[]): ParsedArgs {
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
    } else if (a.startsWith('-') && a.length === 2 && SHORT_OPTS.has(a[1])) {
      const key = a[1] === 'h' ? 'help' : 'out';
      const next = argv[i + 1];
      if (key === 'help') {
        opts.help = true;
      } else if (next !== undefined && !next.startsWith('-')) {
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

function camelize(k: string): string {
  return k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function fmtKB(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/* ------------------------------------------------------------------ */
/* 帮助                                                                */
/* ------------------------------------------------------------------ */
function printHelp(): void {
  console.log(`down-img — 网络图片批量下载（零依赖，Node 18+ 原生 fetch）

用法
  down-img <url...> [选项]
  down-img --file <urls.json> [选项]

选项
  -o, --out <目录>          输出目录，默认 ./dist
      --file <json文件>     从 JSON 数组文件读取链接（与命令行 url 可混用）
      --prefix <前缀>       文件名前缀，如 --prefix cover
      --overwrite           覆盖已存在文件（默认跳过）
      --timeout <毫秒>      单次请求超时，默认 30000
      --retries <次数>      失败重试次数，默认 2
      --concurrency <1-64>  并发数，默认 4
  -h, --help                显示本帮助

说明
  文件名取自 URL 路径末段；无扩展名时按响应 content-type 补全（.jpg/.png/.webp/...）
  已存在同名文件默认跳过，可反复执行（幂等）
  "xx.jpg@759w_140h" 这类带处理参数的文件名会规整为 xx.jpg

示例
  down-img https://a.com/1.png https://a.com/2.png
  down-img https://a.com/1.png -o ./images --prefix cover
  down-img --file test/index.json --concurrency 8
`);
}

/* ------------------------------------------------------------------ */
/* 入口守卫：直接执行（node dist/cli.js 或经 bin 软链）时才运行，被 import 时不执行 */
/* ------------------------------------------------------------------ */
import { fileURLToPath } from 'node:url';

let invokedDirectly = false;
try {
  invokedDirectly =
    !!process.argv[1] &&
    fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
} catch {
  // argv[1] 不存在或不可解析（如 node -e），视为非直接执行
}

if (invokedDirectly) {
  run(process.argv.slice(2)).catch((err: Error) => {
    console.error(`\n✗ ${err.message || err}`);
    process.exit(1);
  });
}
