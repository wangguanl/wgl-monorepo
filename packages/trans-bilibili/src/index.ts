import fs from 'node:fs';
import path from 'node:path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface TransCallbacks {
  onProgress?: (msg: string) => void;
}

export interface TransSummary {
  outputDir: string;
  total: number;
  merged: number;
  errors: { pro: string; video: string; error: string }[];
  files: string[];
}

interface Fraction {
  videoName: string;
  dir: string[];
  blv: string[];
  m4s: string[];
}

type CacheTree = Record<string, Fraction[]>;

function IllegalPipe(s: string): string {
  return String(s).replace(/[\\/:*?"<>|\s]/g, '_');
}

/* ------------------------------------------------------------------ */
/* 扫描 download/ 目录 → 树                                             */
/* ------------------------------------------------------------------ */
async function scanCache(input: string): Promise<CacheTree> {
  const json: CacheTree = {};
  const proDirs = (await fs.promises.readdir(input)).filter((d) => {
    try {
      return fs.statSync(path.join(input, d)).isDirectory();
    } catch {
      return false;
    }
  });

  for (const proDir of proDirs) {
    const proPath = path.join(input, proDir);
    const vDirs = (await fs.promises.readdir(proPath)).filter((d) => {
      try {
        return fs.statSync(path.join(proPath, d)).isDirectory();
      } catch {
        return false;
      }
    });
    for (const vDir of vDirs) {
      const vPath = path.join(proPath, vDir);
      let title = vDir;
      let part: string | undefined;
      try {
        const entry = JSON.parse((await fs.promises.readFile(path.join(vPath, 'entry.json'))).toString());
        title = entry.title;
        part = entry.page_data?.part;
      } catch {
        /* 无 entry.json 也尝试处理 */
      }
      const key = IllegalPipe(title) + '_' + proDir;
      if (!json[key]) json[key] = [];

      const subDirs = (await fs.promises.readdir(vPath)).filter((d) => {
        try {
          return fs.statSync(path.join(vPath, d)).isDirectory();
        } catch {
          return false;
        }
      });
      for (const sub of subDirs) {
        const absSub = path.join(vPath, sub);
        const files = await fs.promises.readdir(absSub);
        json[key].push({
          videoName: (part ? IllegalPipe(part) + '_' : '') + sub,
          dir: [input, proDir, vDir, sub],
          blv: files.filter((f) => path.extname(f) === '.blv').sort((a, b) => parseInt(a, 10) - parseInt(b, 10)),
          m4s: files.filter((f) => path.extname(f) === '.m4s'),
        });
      }
    }
  }
  return json;
}

/* ------------------------------------------------------------------ */
/* ffmpeg 合并                                                         */
/* ------------------------------------------------------------------ */
function mergeFragments(fragments: string[], output: string, cb: TransCallbacks = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg();
    const count = fragments.length;
    fragments.forEach((f) => ff.mergeAdd(f));
    ff.on('progress', (progress) => {
      if (progress && progress.percent) {
        const per = Number(progress.percent);
        cb.onProgress?.(`片段 ${Math.min(count, Math.floor(per / 100) + 1)}/${count}，${(per % 100).toFixed(0)}%`);
      }
    })
      .on('error', (err: Error) => reject(err))
      .on('end', () => resolve())
      .mergeToFile(output, './');
  });
}

function mergePair(fragments: string[], output: string, cb: TransCallbacks = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg(fragments[0]);
    if (fragments[1]) ff.input(fragments[1]);
    ff.on('progress', (progress) => {
      if (progress && progress.percent) cb.onProgress?.(`转译 ${progress.percent.toFixed(0)}%`);
    })
      .on('error', (err: Error) => reject(err))
      .on('end', () => resolve())
      .outputOptions('-c copy')
      .output(output)
      .run();
  });
}

/* ------------------------------------------------------------------ */
/* 入口                                                               */
/* ------------------------------------------------------------------ */
export async function convertBilibiliCache(inputDir: string, outputDir: string, cb: TransCallbacks = {}): Promise<TransSummary> {
  const input = path.resolve(inputDir);
  const output = path.resolve(outputDir);
  fs.mkdirSync(output, { recursive: true });

  const tree = await scanCache(input);
  const proNames = Object.keys(tree);
  const summary: TransSummary = { outputDir: output, total: 0, merged: 0, errors: [], files: [] };

  for (const pro of proNames) {
    const proOut = path.join(output, pro);
    fs.mkdirSync(proOut, { recursive: true });
    for (const frac of tree[pro]) {
      const filePath = path.join(proOut, frac.videoName + '.mp4');
      try {
        await fs.promises.access(filePath);
        cb.onProgress?.(`${pro} / ${frac.videoName}：已存在，跳过`);
        summary.files.push(filePath);
        continue;
      } catch {
        /* 未生成 */
      }
      try {
        cb.onProgress?.(`正在合成：${pro} / ${frac.videoName}`);
        if (frac.blv.length) {
          await mergeFragments(frac.blv.map((f) => path.join(...frac.dir, f)), filePath, cb);
        } else if (frac.m4s.length) {
          await mergePair(frac.m4s.map((f) => path.join(...frac.dir, f)), filePath, cb);
        } else {
          throw new Error('无 blv/m4s 分片');
        }
        summary.merged++;
        summary.files.push(filePath);
      } catch (err) {
        summary.errors.push({ pro, video: frac.videoName, error: (err as Error).message });
      }
      summary.total++;
    }
  }
  return summary;
}

export const transUtils = { IllegalPipe, scanCache };