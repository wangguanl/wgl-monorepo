import fs from 'node:fs';
import sharp, {
  type Sharp as SharpInstance,
  type Metadata,
  type OutputInfo,
  type OverlayOptions,
  type Gravity,
} from 'sharp';

export interface WatermarkOptions {
  text?: string;
  path?: string;
  position?: string;
  opacity?: number;
  fontSize?: number;
  color?: string;
  margin?: number;
}

export interface CropOptions {
  width: number;
  height: number;
  left?: number | null;
  top?: number | null;
}

export interface ResizeOptions {
  width?: number;
  height?: number;
}

export interface CompressOptions {
  output?: string;
  quality?: number;
  effort?: number;
  rotate?: number;
  crop?: CropOptions;
  resize?: ResizeOptions;
  format?: string;
  watermark?: WatermarkOptions;
  lossless?: boolean;
  progressive?: boolean;
  stripMeta?: boolean;
  overwrite?: boolean;
}

export interface CompressResult {
  data: Buffer | null;
  info: { width?: number; height?: number; format?: string; size?: number };
  bytesSaved: number;
  beforeBytes: number;
}

/**
 * 核心压缩管线（单文件）。不传 output 时返回 Buffer 不写盘。
 */
export async function compressImage(input: string, opts: CompressOptions = {}): Promise<CompressResult> {
  const {
    output,
    quality = 75,
    effort,
    rotate = 0,
    crop,
    resize,
    format,
    watermark,
    lossless = false,
    progressive = false,
    stripMeta = true,
    overwrite = false,
  } = opts;

  const meta = await sharp(input).metadata();
  const inBytes = await fs.promises
    .stat(input)
    .then((s) => s.size)
    .catch(() => 0);
  const outFormat = normalizeFormat(format || meta.format);

  let pipe = sharp(input, { failOn: 'none' }).rotate();
  if (rotate) pipe = pipe.rotate(rotate, { background: '#ffffff' });
  if (resize && (resize.width || resize.height)) {
    pipe = pipe.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
  }
  if (crop) {
    if (crop.left == null || crop.top == null) {
      pipe = pipe.resize(crop.width, crop.height, { fit: 'cover', position: 'centre' });
    } else {
      pipe = pipe.extract({ width: crop.width, height: crop.height, left: crop.left, top: crop.top });
    }
  }
  if (watermark) pipe = await applyWatermark(pipe, watermark, meta);

  const encoderOpts = buildEncoderOpts(outFormat, { quality, effort, lossless, progressive, stripMeta });
  let target = (pipe as unknown as Record<string, (o: Record<string, unknown>) => SharpInstance>)[outFormat](encoderOpts);
  if (!stripMeta) target = target.withMetadata();

  if (output) {
    if (!overwrite && exists(output)) {
      throw new Error(`输出已存在（--overwrite 可覆盖）：${output}`);
    }
    const info = await target.toFile(output);
    return {
      data: null,
      info: normalizeInfo(info, outFormat),
      bytesSaved: inBytes - info.size,
      beforeBytes: inBytes,
    };
  }
  const { data, info } = await target.toBuffer({ resolveWithObject: true });
  return {
    data,
    info: normalizeInfo(info, outFormat),
    bytesSaved: inBytes - data.length,
    beforeBytes: inBytes,
  };
}

function normalizeInfo(info: OutputInfo, outFormat: string): { width?: number; height?: number; format?: string; size?: number } {
  return { ...info, format: outFormat };
}

function normalizeFormat(f: string | undefined | null): string {
  const s = String(f || '').toLowerCase();
  if (s === 'jpg') return 'jpeg';
  if (['jpeg', 'png', 'webp', 'avif', 'tiff', 'gif', 'heif'].includes(s)) return s;
  throw new Error(`不支持的格式：${f}`);
}

function buildEncoderOpts(
  format: string,
  { quality, effort, lossless, progressive, stripMeta }: { quality: number; effort?: number; lossless: boolean; progressive: boolean; stripMeta: boolean }
): Record<string, unknown> {
  switch (format) {
    case 'jpeg':
      return { quality, progressive, mozjpeg: true, chromaSubsampling: '4:2:0' };
    case 'png': {
      const usePalette = quality < 100;
      return {
        compressionLevel: 9,
        effort: clamp(effort ?? 7, 1, 10),
        palette: usePalette,
        ...(usePalette ? { quality: clamp(quality, 0, 100) } : {}),
        colours: 256,
      };
    }
    case 'webp':
      return { quality, effort: clamp(effort ?? 4, 0, 6), lossless, smartSubsample: true };
    case 'avif':
      return { quality, effort: clamp(effort ?? 4, 1, 9), lossless };
    case 'tiff':
      return { quality, compression: 'lzw' };
    case 'gif':
      return { quality };
    default:
      return { quality };
  }
}

async function applyWatermark(pipe: SharpInstance, watermark: WatermarkOptions, meta: Metadata): Promise<SharpInstance> {
  const { position = 'southeast', opacity = 0.6, fontSize = 24, color = 'rgba(255,255,255,0.9)', text, path } = watermark;
  if (!text && !path) throw new Error('水印需要 text 或 path');

  const gravityMap: Record<string, string> = {
    northwest: 'northwest', north: 'north', northeast: 'northeast', west: 'west',
    center: 'centre', centre: 'centre', east: 'east',
    southwest: 'southwest', south: 'south', southeast: 'southeast',
  };
  const gravity = gravityMap[String(position).toLowerCase()] || 'southeast';

  let wmInput: OverlayOptions;
  if (text) {
    const imgW = meta.width || 1200;
    const size = Math.min(fontSize, Math.max(14, Math.round(imgW / 18)));
    const fontPx = size;
    const textW = Math.ceil([...text].reduce((w, ch) => w + (ch.charCodeAt(0) > 255 ? 1 : 0.55), 0) * fontPx);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${textW + 8}" height="${fontPx * 1.6}" viewBox="0 0 ${textW + 8} ${fontPx * 1.6}">
  <text x="4" y="${fontPx * 1.1}" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif" font-size="${fontPx}" fill="${color}" fill-opacity="${opacity}">${escapeXml(text)}</text>
</svg>`;
    wmInput = { input: Buffer.from(svg), gravity: gravity as Gravity, blend: 'over' };
  } else {
    const { data, info } = await sharp(path!)
      .ensureAlpha()
      .toColourspace('srgb')
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * opacity);
    wmInput = { input: Buffer.from(data), raw: { width: info.width, height: info.height, channels: 4 }, gravity: gravity as Gravity, blend: 'over' };
  }
  return pipe.composite([wmInput]);
}

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Number(n) || 0));
}

function exists(p: string): boolean {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}