import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as NodeWebReadableStream } from 'node:stream/web';

/** 合法扩展名（用于识别 URL 文件名末尾的扩展名） */
const EXT_RE = /^\.[a-z0-9]{1,5}$/i;

/** content-type → 扩展名（URL 未携带扩展名时按响应头补全） */
const CT_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/tiff': '.tiff',
  'image/bmp': '.bmp',
  'image/svg+xml': '.svg',
};

export interface DownloadImageOptions {
  /** 输出目录（不存在自动创建），默认 "./dist" */
  output?: string;
  /** 指定文件名（默认取 URL 路径末段） */
  name?: string;
  /** 文件名前缀 */
  prefix?: string;
  /** 覆盖已存在文件（默认跳过，幂等） */
  overwrite?: boolean;
  /** 单次请求超时毫秒数，默认 30000 */
  timeout?: number;
  /** 失败重试次数（退避间隔递增），默认 2 */
  retries?: number;
  /** 附加请求头 */
  headers?: Record<string, string>;
}

export interface DownloadSuccess {
  url: string;
  path: string;
  bytes: number;
  skipped: boolean;
  contentType?: string;
}

export interface DownloadImagesBatchOptions {
  /** 并发数，默认 4 */
  concurrency?: number;
  /** 每张完成回调（err 为 null 表示成功） */
  onProgress?: (err: Error | null, r: DownloadSuccess | { url: string }) => void;
}

export type DownloadResult =
  | ({ ok: true } & DownloadSuccess)
  | { ok: false; url: string; error: string };

/**
 * 从 URL 提取文件名
 *
 * - 去 query / hash，取路径末段
 * - 替换文件系统非法字符
 * - "xx.jpg@759w_140h" 这类带处理参数的文件名：扩展名不合法时截掉 @ 后缀再识别
 */
export function urlFileName(url: string): string {
  let name = '';
  try {
    name = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
  } catch {
    name = '';
  }
  if (!name) name = String(url).split('?')[0].split('#')[0].split('/').pop() || '';
  name = name.replace(/[\\/:*?"<>|\s]/g, '_');

  if (!EXT_RE.test(path.extname(name)) && name.includes('@')) {
    name = name.split('@')[0];
  }
  return name;
}

/**
 * 下载单张网络图片到本地
 *
 * @param url http/https 图片链接
 * @param opts 下载选项
 * @returns 落盘信息（skipped=true 表示文件已存在被跳过）
 */
export async function downloadImage(url: string, opts: DownloadImageOptions = {}): Promise<DownloadSuccess> {
  const {
    output = './dist',
    name,
    prefix = '',
    overwrite = false,
    timeout = 30_000,
    retries = 2,
    headers = {},
  } = opts;

  if (!/^https?:\/\//i.test(url)) throw new Error(`仅支持 http/https 链接：${url}`);

  const outDir = path.resolve(output);
  fs.mkdirSync(outDir, { recursive: true });

  let filename = name || urlFileName(url) || 'image';
  if (prefix) filename = `${prefix}-${filename}`;
  const hasExt = EXT_RE.test(path.extname(filename));

  // 扩展名已知时：已存在直接跳过，不发请求
  if (hasExt && !overwrite) {
    const existing = path.join(outDir, filename);
    if (fs.existsSync(existing)) {
      return { url, path: existing, bytes: fs.statSync(existing).size, skipped: true };
    }
  }

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchToFile(url, outDir, filename, { hasExt, overwrite, timeout, headers });
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await sleep(300 * (attempt + 1));
    }
  }
  throw lastErr;
}

/**
 * 批量下载（简单并发池：顺序领取任务，最多 concurrency 个同时执行）
 *
 * @param urls 链接数组
 * @param opts 同 downloadImage
 * @param batch 并发与回调配置
 * @returns 按传入顺序的结果数组（失败项含 error 字段）
 */
export async function downloadImages(
  urls: string[],
  opts: DownloadImageOptions = {},
  { concurrency = 4, onProgress }: DownloadImagesBatchOptions = {}
): Promise<DownloadResult[]> {
  const results: DownloadResult[] = [];
  let i = 0;
  const n = Math.max(1, Math.min(concurrency, urls.length));
  const workers = Array.from({ length: n }, async () => {
    while (i < urls.length) {
      const idx = i++;
      const url = urls[idx];
      try {
        const r = await downloadImage(url, opts);
        onProgress?.(null, r);
        results[idx] = { ok: true, ...r };
      } catch (err) {
        const e = err as Error;
        onProgress?.(e, { url });
        results[idx] = { ok: false, url, error: e.message };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

/* ------------------------------------------------------------------ */
/* 内部实现                                                            */
/* ------------------------------------------------------------------ */

async function fetchToFile(
  url: string,
  outDir: string,
  filename: string,
  { hasExt, overwrite, timeout, headers }: Required<Pick<DownloadImageOptions, 'overwrite' | 'timeout' | 'headers'>> & { hasExt: boolean }
): Promise<DownloadSuccess> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; down-img/1.0)', ...headers },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim() + ` — ${url}`);
  if (!res.body) throw new Error(`响应无内容 — ${url}`);

  const contentType = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();

  // 扩展名修正：URL 未携带合法扩展名时，按 content-type 补全（兜底 .png）
  let finalName = filename;
  if (!hasExt) finalName = filename + (CT_EXT[contentType] || '.png');
  const outFile = path.join(outDir, finalName);

  // 先落临时文件，成功后改名，避免半截文件
  const tmpFile = path.join(outDir, `.down-img-${process.pid}-${Date.now()}.tmp`);
  try {
    await pipeline(
      Readable.fromWeb(res.body as unknown as NodeWebReadableStream),
      fs.createWriteStream(tmpFile)
    );

    if (!overwrite && fs.existsSync(outFile)) {
      return { url, path: outFile, bytes: fs.statSync(outFile).size, skipped: true };
    }
    fs.renameSync(tmpFile, outFile);
    return { url, path: outFile, bytes: fs.statSync(outFile).size, skipped: false, contentType };
  } finally {
    fs.rmSync(tmpFile, { force: true }); // 已 rename 时为 no-op
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
