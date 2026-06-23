// 切换全屏
export default (mode = true, el = 'body') =>
  mode
    ? document.querySelector(el).requestFullscreen()
    : document.exitFullscreen();
