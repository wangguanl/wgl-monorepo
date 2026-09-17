import fs from 'node:fs';
import path from 'node:path';
import { ffmpegDownload, type FfmpegCallbacks } from './ffmpeg.ts';

export interface SingleOptions extends FfmpegCallbacks {
  /** 输出目录（不存在自动创建），默认 ./dist */
  output?: string;
  /** 文件名（不含扩展名），默认取 URL 或时间戳 */
  name?: string;
  /** 已存在同名输出时跳过，默认 true */
  skipIfExists?: boolean;
}

export interface DownloadResult {
  url: string;
  file: string;
  skipped: boolean;
}

/** 单文件 m3u8 下载 */
export async function downloadM3u8(url: string, options: SingleOptions = {}): Promise<DownloadResult> {
  const outputDir = path.resolve(options.output || './dist');
  fs.mkdirSync(outputDir, { recursive: true });
  const baseName = options.name || safeName(url);
  const file = path.join(outputDir, `${baseName}.mp4`);

  if (options.skipIfExists !== false && fs.existsSync(file)) {
    return { url, file, skipped: true };
  }
  await ffmpegDownload(url, file, { onProgress: options.onProgress });
  return { url, file, skipped: false };
}

export function safeName(url: string): string {
  try {
    const seg = new URL(url).pathname.split('/').pop() || '';
    if (seg) return seg.replace(/\.m3u8$/i, '').replace(/[\\/:*?"<>|\s]/g, '_');
  } catch {
    /* fallthrough */
  }
  return `video-${Date.now()}`;
}