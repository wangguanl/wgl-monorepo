#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compressImage } from './compress.ts';
import { IMAGE_EXTS, parseSize, parseCrop, savedPct } from './util.ts';

interface OptValue {
  s: string;
  b: boolean;
}

export async function run(argv: string[]): Promise<void> {
  const { args, opts } = parseArgs(argv);
  if (opts.help?.b || args.length === 0) {
    printHelp();
    return;
  }
  const input = path.resolve(args[0]);
  const stats = fs.statSync(input);
  const outOpts: Record<string, unknown> = {
    quality: opts.quality ? Number(opts.quality.s) : 75,
    format: opts.format?.s,
  };
  if (opts.resize) outOpts.resize = parseSize(opts.resize.s);
  if (opts.crop) outOpts.crop = parseCrop(opts.crop.s);
  if (opts.rotate) outOpts.rotate = Number(opts.rotate.s);
  if (opts.lossless?.b) outOpts.lossless = true;
  if (opts['strip-meta']?.b === false) outOpts.stripMeta = false;
  if (opts['wm-text']) outOpts.watermark = { text: opts['wm-text'].s };

  if (stats.isDirectory()) {
    const files = walkImages(input);
    for (const f of files) {
      await compressOne(f, input, outOpts);
    }
    console.log(`Σ ${files.length} 张完成`);
  } else if (stats.isFile()) {
    await compressOne(input, path.dirname(input), outOpts);
  } else {
    throw new Error(`输入不存在：${input}`);
  }
}

async function compressOne(file: string, root: string, opts: Record<string, unknown>): Promise<void> {
  const rel = path.relative(root, file);
  const outFile = path.join(root, 'compressed', rel);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const r = await compressImage(file, { ...opts, output: outFile, overwrite: true });
  const before = r.beforeBytes;
  const after = r.info.size || 0;
  console.log(`  ${rel}  ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB  ${savedPct(before, after)}`);
}

function walkImages(dir: string): string[] {
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walkImages(p));
    else if (IMAGE_EXTS.has(path.extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

function parseArgs(argv: string[]): { args: string[]; opts: Record<string, OptValue> } {
  const args: string[] = [];
  const opts: Record<string, OptValue> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      const key = eq === -1 ? camelize(a.slice(2)) : camelize(a.slice(2, eq));
      if (eq !== -1) {
        opts[key] = { s: a.slice(eq + 1), b: true };
      } else {
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('-')) {
          opts[key] = { s: next, b: true };
          i++;
        } else {
          opts[key] = { s: '', b: true };
        }
      }
    } else if (a === '-h') {
      opts.help = { s: '', b: true };
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
  console.log(`wgl-compress — 图片压缩（sharp）

用法
  wgl-compress <文件|目录> [选项]

选项
  -q, --quality <1-100>  质量，默认 75
  -f, --format <格式>    转换格式 jpg/png/webp/avif/tiff/gif
      --resize <WxH>     等比缩放
      --crop <WxH>       居中裁剪
      --rotate <90|180|270>
      --wm-text <文字>   文字水印
  -h, --help             显示帮助
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