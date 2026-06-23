import * as FS from 'fs';
import * as os from 'os';
import { to } from 'await-to-js';

// 读取文件夹
export const readdirAsync = (path: string): Promise<string[]> =>
  new Promise((resolve, reject) =>
    FS.readdir(path, (err, dirs) => (err ? reject(err) : resolve(dirs)))
  );

// 读取文件
export const readFileAsync = (path: string): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    FS.readFile(path, (err, buffer) => (err ? reject(err) : resolve(buffer)))
  );

// 写入文件
export const writeFileAsync = (
  path: string,
  data: string | Buffer
): Promise<void> =>
  new Promise((resolve, reject) =>
    FS.writeFile(path, data, err => (err ? reject(err) : resolve()))
  );

// 检查文件夹是否存在
export const statAsync = (path: string): Promise<FS.Stats> =>
  new Promise((resolve, reject) =>
    FS.stat(path, (err, data) => (err ? reject(err) : resolve(data)))
  );

// 创建文件夹
export const mkdirAsync = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    FS.mkdir(path, err => (err ? reject(err) : resolve()))
  );

// 检查文件是否存在
export const accessAsync = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    FS.access(path, err => (err ? reject(err) : resolve()))
  );

// 检查数据是否是一个文件
export const isFile = (path: string): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    const [err, data] = await to(statAsync(path));
    err ? reject(err) : resolve(data.isFile());
  });

// 检查数据是否是一个文件夹
export const isDirectory = (path: string): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    const [err, data] = await to(statAsync(path));
    err ? reject(err) : resolve(data.isDirectory());
  });

// 删除文件夹
export const rmdirSync = (path: string): Promise<void> =>
  new Promise((resolve, reject) =>
    FS.rmdir(path, err => (err ? reject(err) : resolve()))
  );

// 递归删除文件夹及文件
export const rmDirFile = (path: string): Promise<void> =>
  new Promise(async (resolve, reject) => {
    if (FS.existsSync(path)) {
      const [err, files] = await to(readdirAsync(path));
      if (err) {
        reject(err);
        return;
      }
      await Promise.allSettled(
        files.map(
          file =>
            new Promise<void>(async resolveFile => {
              const curPath = path + '/' + file;
              if (FS.statSync(curPath).isDirectory()) {
                await rmDirFile(curPath);
              } else {
                FS.unlinkSync(curPath);
              }
              resolveFile();
            })
        )
      );
      await rmdirSync(path);
      resolve();
    }
  });

export const cpAsync = (src: string, dest: string): Promise<void> =>
  new Promise((resolve, reject) => {
    FS.cp(src, dest, err => (err ? reject(err) : resolve()));
  });

// 获取本地IPV4
export const getLocalIP = (): string => {
  const iFaces = os.networkInterfaces();
  let localIp = '';
  for (const dev in iFaces) {
    if (dev === '本地连接' || dev === 'WLAN' || dev === '以太网') {
      for (let j = 0; j < iFaces[dev]!.length; j++) {
        if (iFaces[dev]![j].family === 'IPv4') {
          localIp = iFaces[dev]![j].address;
          break;
        }
      }
    }
  }
  return localIp;
};

// 检测是否是本地
export const isDev = (hostname: string): boolean =>
  ['localhost', '127.0.0.1', getLocalIP()].includes(hostname);

// 将名称转为可保存的文件格式命名
export const IllegalPipe = (str: string): string =>
  str.replace(/\"|\*|\\|\/|\||\:|\?/g, '');
