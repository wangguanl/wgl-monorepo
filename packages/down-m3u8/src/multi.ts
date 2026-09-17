import type { FfmpegCallbacks } from './ffmpeg.ts';
import { downloadM3u8, safeName } from './single.ts';

export type VideoGroup = [prefix: string, urls: string[]];

export interface MultiOptions extends FfmpegCallbacks {
  output?: string;
}

export interface MultiResult {
  group: string;
  url: string;
  file: string;
  skipped: boolean;
  ok: boolean;
  error?: string;
}

/** 多组视频顺序下载：每组 [前缀, urls[]]，产出 <前缀>_<url末段>.mp4 */
export async function downloadMany(groups: VideoGroup[], options: MultiOptions = {}): Promise<MultiResult[]> {
  const results: MultiResult[] = [];
  for (const [prefix, urls] of groups) {
    for (const url of urls) {
      const baseName = prefix ? `${prefix}_${safeName(url)}` : safeName(url);
      try {
        const r = await downloadM3u8(url, { output: options.output, name: baseName, onProgress: options.onProgress });
        results.push({ group: prefix, url, file: r.file, skipped: r.skipped, ok: true });
      } catch (err) {
        results.push({ group: prefix, url, file: '', skipped: false, ok: false, error: (err as Error).message });
      }
    }
  }
  return results;
}