import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/* ================================================================== */
/* JSON / 响应                                                          */
/* ================================================================== */

export function jsonHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json; charset=utf-8' };
}

export function sendJson(res: http.ServerResponse, code: number, data: unknown): void {
  res.writeHead(code, jsonHeaders());
  res.end(JSON.stringify(data));
}

export function sendErr(res: http.ServerResponse, code: number, msg: string): void {
  res.writeHead(code, jsonHeaders());
  res.end(JSON.stringify({ error: msg }));
}

/* ================================================================== */
/* 请求体读取 / 限长落盘                                                 */
/* ================================================================== */

export function readBody(req: http.IncomingMessage, limit = 1024 * 1024): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer | string) => {
      const buf = Buffer.isBuffer(c) ? c : Buffer.from(c);
      size += buf.length;
      if (size > limit) {
        req.destroy();
        reject(new Error('请求体过大'));
        return;
      }
      chunks.push(buf);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** 请求体限长管道落盘，超限回调并销毁连接 */
export function pipeToFile(
  req: http.IncomingMessage,
  filePath: string,
  limit: number,
  onOver: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filePath);
    let size = 0;
    let over = false;
    req.on('data', (c: Buffer | string) => {
      size += Buffer.isBuffer(c) ? c.length : Buffer.byteLength(c);
      if (size > limit) {
        over = true;
        req.destroy();
        ws.destroy();
        fs.rm(filePath, { force: true }, () => {});
        onOver();
        reject(new Error('over-limit'));
      }
    });
    req.on('error', (err) => {
      if (!over) {
        ws.destroy();
        reject(err);
      }
    });
    req.pipe(ws);
    ws.on('finish', () => !over && resolve());
    ws.on('error', (err) => {
      if (!over) {
        ws.destroy();
        reject(err);
      }
    });
  });
}

/* ================================================================== */
/* 会话临时目录                                                          */
/* ================================================================== */

export interface Session {
  dir: string;
  /** 通过 id 返回会话内临时文件路径（防目录穿越） */
  join: (id: string, ext?: string) => string;
  /** 注册 afterWrite 弱路径，供 /file/:id 下载 */
  register: (map: Map<string, { absPath: string; outName: string; mime: string }>, id: string, entry: { absPath: string; outName: string; mime: string }) => void;
  cleanup: () => void;
}

/** 创建会话临时目录并注册退出清理；返回 { dir, cleanup } */
export function makeSession(prefix: string): Omit<Session, 'join' | 'register'> & { idFile: (id: string, ext?: string) => string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const cleanup = () => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* 尽力清理 */
    }
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(0);
  });
  return { dir, idFile: (id, ext = '') => path.join(dir, `out-${id}${ext}`), cleanup };
}

const SAFE_ID_RE = /^[a-z0-9-]+$/i;
/** 会话内文件的相对名（含前缀），防目录穿越 */
export function sessionRelPrefix(prefix: string, id: string, ext = ''): string {
  if (!SAFE_ID_RE.test(id)) throw new Error('非法 id');
  return `${prefix}${id}${ext}`;
}

/* ================================================================== */
/* 静态服务（白名单 + 防目录穿越）                                        */
/* ================================================================== */

export const STATIC_MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * 服务单个静态文件（相对 root）。返回 true 表示已响应（含 404）；
 * 白名单之外或越权路径返回 false（由调用方兜底 404）。
 */
export function serveStatic(res: http.ServerResponse, root: string, relFile: string): boolean {
  const abs = path.normalize(path.join(root, relFile));
  const rootNorm = path.normalize(root);
  if (!abs.startsWith(rootNorm) || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    return false;
  }
  const buffer = fs.readFileSync(abs);
  res.writeHead(200, {
    'Content-Type': STATIC_MIME[path.extname(abs)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(buffer);
  return true;
}

/** 白名单式静态服务：只有显式列在 map 里的 relFile 才可被读取 */
export function serveStaticAllowList(
  res: http.ServerResponse,
  root: string,
  allowList: Map<string, string>,
  relFile: string
): boolean {
  const mapped = allowList.get(relFile);
  if (mapped == null) return false;
  return serveStatic(res, root, mapped);
}

/* ================================================================== */
/* 端口占用顺延                                                          */
/* ================================================================== */

/** 优先 preferred，被占用则 +1 顺延（attempts 次后回落随机端口） */
export function listenAvailablePort(
  server: http.Server,
  { host = '127.0.0.1', preferred = 7788, attempts = 20 }: { host?: string; preferred?: number; attempts?: number } = {}
): Promise<{ server: http.Server; host: string; port: number }> {
  return new Promise((resolve, reject) => {
    const attempt = (p: number, left: number) => {
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' && left > 0) attempt(p + 1, left - 1);
        else if (err.code === 'EADDRINUSE') attempt(0, 0);
        else reject(err);
      });
      server.listen(p, host, () => {
        const addr = server.address();
        const port = typeof addr === 'object' && addr ? addr.port : p;
        resolve({ server, host, port });
      });
    };
    attempt(Number(preferred) || 7788, attempts);
  });
}

/* ================================================================== */
/* 文件下载                                                            */
/* ================================================================== */

export function fileDownload(
  res: http.ServerResponse,
  { absPath, outName, mime, bytes }: { absPath: string; outName: string; mime: string; bytes?: number }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = {
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(outName)}`,
    };
    if (bytes != null) headers['Content-Length'] = String(bytes);
    try {
      const st = fs.statSync(absPath);
      if (bytes == null) headers['Content-Length'] = String(st.size);
      res.writeHead(200, headers);
    } catch {
      reject(new Error('文件不存在'));
      return;
    }
    fs.createReadStream(absPath)
      .on('error', reject)
      .pipe(res)
      .on('finish', resolve);
  });
}

/* ================================================================== */
/* ZIP（STORED 压缩）—— 逐条 local header + central dir + EOCD          */
/* ================================================================== */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** entry 名 sanitize（防 zip-slip） */
export function sanitizeEntryName(name: string): string {
  const norm = String(name).replace(/\\/g, '/');
  const parts = norm
    .split('/')
    .filter((p) => p && p !== '.' && p !== '..' && !/^[a-zA-Z]:$/.test(p));
  return parts.join('/') || 'file';
}

const SIG_LFH = 0x04034b50;
const SIG_CDH = 0x02014b50;
const SIG_EOCD = 0x06054b50;
const FLAG_UTF8 = 0x0800;

function dosDateTime(d = new Date()) {
  const year = Math.max(1980, d.getFullYear());
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time: time & 0xffff, date: date & 0xffff };
}

function buildLocalHeader(entryName: string, data: Buffer, crc: number, { time, date }: { time: number; date: number }): Buffer {
  const nameBuf = Buffer.from(entryName, 'utf8');
  const h = Buffer.alloc(30);
  h.writeUInt32LE(SIG_LFH, 0);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(FLAG_UTF8, 6);
  h.writeUInt16LE(0, 8); // method stored
  h.writeUInt16LE(time, 10);
  h.writeUInt16LE(date, 12);
  h.writeUInt32LE(crc, 14);
  h.writeUInt32LE(data.length, 18);
  h.writeUInt32LE(data.length, 22);
  h.writeUInt16LE(nameBuf.length, 26);
  h.writeUInt16LE(0, 28);
  return Buffer.concat([h, nameBuf, data]);
}

function buildCentralHeader(entryName: string, crc: number, size: number, offset: number, { time, date }: { time: number; date: number }): Buffer {
  const nameBuf = Buffer.from(entryName, 'utf8');
  const h = Buffer.alloc(46);
  h.writeUInt32LE(SIG_CDH, 0);
  h.writeUInt16LE(20, 4);
  h.writeUInt16LE(20, 6);
  h.writeUInt16LE(FLAG_UTF8, 8);
  h.writeUInt16LE(0, 10);
  h.writeUInt16LE(time, 12);
  h.writeUInt16LE(date, 14);
  h.writeUInt32LE(crc, 16);
  h.writeUInt32LE(size, 20);
  h.writeUInt32LE(size, 24);
  h.writeUInt16LE(nameBuf.length, 28);
  h.writeUInt32LE(offset, 42);
  return Buffer.concat([h, nameBuf]);
}

export interface ZipEntry {
  name?: string;
  path: string;
  data?: Buffer;
}

export async function zipBuffer(files: ZipEntry[], { mtime }: { mtime?: Date } = {}): Promise<Buffer> {
  const dos = dosDateTime(mtime);
  const chunks: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const f of files) {
    const data = Buffer.isBuffer(f.data) ? f.data : await fs.promises.readFile(f.path);
    const name = sanitizeEntryName(f.name ?? path.basename(f.path));
    const crc = crc32(data);
    const local = buildLocalHeader(name, data, crc, dos);
    chunks.push(local);
    centrals.push(buildCentralHeader(name, crc, data.length, offset, dos));
    offset += local.length;
  }
  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(SIG_EOCD, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, cd, eocd]);
}

/** 流式写一条条的 ZIP 到 ServerResponse */
export async function pipeZip(files: ZipEntry[], res: http.ServerResponse, { mtime }: { mtime?: Date } = {}): Promise<void> {
  const dos = dosDateTime(mtime);
  const centrals: Buffer[] = [];
  let offset = 0;
  let n = 0;
  for (const f of files) {
    const data = Buffer.isBuffer(f.data) ? f.data : await fs.promises.readFile(f.path);
    const name = sanitizeEntryName(f.name ?? path.basename(f.path));
    const crc = crc32(data);
    const local = buildLocalHeader(name, data, crc, dos);
    await write(res, local);
    centrals.push(buildCentralHeader(name, crc, data.length, offset, dos));
    offset += local.length;
    n++;
  }
  const cd = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(SIG_EOCD, 0);
  eocd.writeUInt16LE(n, 8);
  eocd.writeUInt16LE(n, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  await write(res, cd);
  await write(res, eocd);
}

function write(res: http.ServerResponse, chunk: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    res.write(chunk, (err: Error | null | undefined) => (err ? reject(err) : resolve()));
  });
}