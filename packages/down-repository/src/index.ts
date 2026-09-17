import fs from 'node:fs';
import path from 'node:path';
import download from 'download-git-repo';

export interface ScaffoldOptions {
  /** 目标目录（相对/绝对，不存在自动创建） */
  target: string;
  /** 是否删除目标目录内的 .git（转成普通代码目录），默认 true */
  removeGit?: boolean;
}

export interface ScaffoldResult {
  target: string;
  gitRepo: string;
}

/**
 * 以 git clone 方式拉取远程仓库到目标目录
 *
 * 支持 github:`owner/repo`、gitee:`owner/repo`、或 `direct:https://...` 裸地址。
 */
export async function scaffold(gitRepo: string, options: ScaffoldOptions): Promise<ScaffoldResult> {
  const target = path.resolve(options.target);
  fs.mkdirSync(target, { recursive: true });
  const src = /^https?:\/\//i.test(gitRepo) ? `direct:${gitRepo}` : gitRepo;

  await new Promise<void>((resolve, reject) => {
    download(src, target, { clone: true }, (err) => (err ? reject(err) : resolve()));
  });

  if (options.removeGit !== false) {
    const gitDir = path.join(target, '.git');
    if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });
  }
  return { target, gitRepo };
}