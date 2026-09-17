declare module '@ffmpeg-installer/ffmpeg' {
  export interface FfmpegInstaller {
    path: string;
    version: string;
    url: string;
  }
  const installer: FfmpegInstaller;
  export default installer;
}