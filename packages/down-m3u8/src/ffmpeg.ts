import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface ProgressInfo {
  percent?: number;
  timemark?: string;
}

export interface FfmpegCallbacks {
  onProgress?: (p: ProgressInfo) => void;
}

/** m3u8 / 任意 ffmpeg 可读的 URL → mp4（-c copy 转封装，不重新编码） */
export function ffmpegDownload(url: string, output: string, { onProgress }: FfmpegCallbacks = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (fn: () => void) => {
      if (!done) {
        done = true;
        fn();
      }
    };
    const cmd = ffmpeg(url)
      .on('progress', (progress) => {
        if (progress && (progress.percent || progress.timemark)) {
          onProgress?.({ percent: Number(progress.percent) || 0, timemark: progress.timemark });
        }
      })
      .on('error', (err) => finish(() => reject(err)))
      .on('end', () => finish(() => resolve()))
      .outputOptions('-c copy')
      .outputOptions('-bsf:a aac_adtstoasc')
      .output(output);
    // 结束时若有 100% 进度未触发 end（某些源不报 end），以 progress>=100 兜底
    cmd.on('progress', (progress) => {
      if (progress && Number(progress.percent) >= 100) finish(() => resolve());
    });
    cmd.run();
  });
}