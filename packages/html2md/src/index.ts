import path from 'node:path';
import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import request from 'superagent';
import { downloadImage } from '@wgl-m/down-img';
import {
  readFileAsync,
  writeFileAsync,
  statAsync,
  mkdirAsync,
  rmDirFile,
} from '@wgl-m/node-utils';

export interface Html2MdOptions {
  /** 远程页面 URL（与 file 二选一） */
  url?: string;
  /** 本地 html 文件绝对/相对路径 */
  file?: string;
  /** 输出根目录，默认 ./dist；产物位于 <output>/<name> */
  output?: string;
  /** 产物文件夹名，默认 index */
  name?: string;
  /** hostname → CSS 选择器（捕获该区域转 MD），默认 overall body */
  hosts?: Record<string, string>;
  /** 是否下载并本地化图片，默认 true */
  downloadImages?: boolean;
}

export interface Html2MdResult {
  outputDir: string;
  indexFile: string;
  images: string[];
  markdown: string;
  title?: string;
  sourceUrl?: string;
}

const turndownService = new TurndownService();

/** 生成唯一文件名（同位原版 wgl-utils unique()） */
function unique(): string {
  const b = crypto.randomBytes(16);
  return b.toString('hex').slice(0, 16);
}

/**
 * HTML 页面 / 本地文件 → Markdown（图片本地化）
 */
export async function pageToMarkdown(options: Html2MdOptions): Promise<Html2MdResult> {
  const output = options.output ? path.resolve(options.output) : path.resolve('./dist');
  const name = options.name || 'index';
  const hosts = options.hosts || {};
  const downloadImages = options.downloadImages !== false;

  // 准备输出目录
  const mkdir = async (dir: string) => {
    try {
      await statAsync(dir);
    } catch {
      await mkdirAsync(dir).catch(() => {});
    }
  };
  await mkdir(output);
  const outputDir = path.resolve(output, name);
  try {
    await statAsync(outputDir);
    await rmDirFile(outputDir); // 已存在则清空
  } catch {
    /* 不存在 */
  }
  await mkdir(outputDir);
  const imagesDir = path.join(outputDir, 'images');

  // 抓取 HTML
  let html = '';
  let sourceUrl = '';
  let origin = '';
  let hostname = '';
  let pathname = '';
  let pathUrl = '/';
  if (options.url && /^(http|https):/i.test(options.url)) {
    sourceUrl = options.url;
    const res = await request.get(options.url);
    html = res.text;
    const urlObj = new URL(options.url);
    origin = urlObj.origin;
    hostname = urlObj.hostname;
    pathname = urlObj.pathname;
    pathUrl = pathname[pathname.length - 1] === '/' ? pathname : pathname.slice(0, pathname.lastIndexOf('/') + 1);
  } else if (options.file) {
    const buf = await readFileAsync(options.file);
    html = buf.toString();
    origin = path.dirname(options.file);
    hostname = 'localhost';
  } else {
    throw new Error('需要 url 或 file 之一');
  }

  const $ = cheerio.load(html);
  const domName = options.url ? hosts[hostname] || 'body' : hosts['localhost'] || 'body';
  const title = $('title').text();

  if (sourceUrl) {
    $(domName).prepend(`<a href="${sourceUrl}">转载文章：${title}</a><br />`);
  }

  const images: string[] = [];
  // 图片本地化
  const imgs = $(`${domName} img`).toArray();
  await Promise.allSettled(
    imgs.map(async (el) => {
      const $el = $(el);
      let url = String($el.attr('src') || $el.attr('data-src') || '');
      if (!/^(http|https|data|blob):/i.test(url)) {
        url = origin + path.join(pathUrl, url).replace(/\\/g, '/');
      }
      await mkdir(imagesDir);
      const filename = unique() + '.png';
      const relPath = path.join('images', filename);
      const absPath = path.join(outputDir, relPath);

      if (/^https?:\/\//i.test(url)) {
        try {
          await downloadImage(url, { output: imagesDir, name: filename, overwrite: true, retries: 1, timeout: 30000 });
          images.push(absPath);
          $el.attr('src', relPath).attr('data-src', relPath);
        } catch {
          /* 单图失败不中断整页 */
        }
      } else if (!/^(data|blob):/i.test(url)) {
        try {
          const buf = await readFileAsync(url);
          await writeFileAsync(absPath, buf);
          images.push(absPath);
          $el.attr('src', relPath).attr('data-src', relPath);
        } catch {
          /* 本地图读取失败 */
        }
      }
    })
  );

  const markdown = turndownService.turndown($(domName).html() || '');
  const indexFile = path.join(outputDir, 'index.md');
  await writeFileAsync(indexFile, markdown);

  return { outputDir, indexFile, images, markdown, title, sourceUrl };
}

export { turndownService };