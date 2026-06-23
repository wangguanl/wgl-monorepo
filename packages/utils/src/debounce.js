// 防抖
export const throttle = (() => {
  let timeout = 0;
  return (fn, delay = 1000) => {
    // 获取当前时间戳
    let now = new Date().valueOf();
    // 第一次会触发, 每隔delay秒执行一次
    if (now - timeout > delay) {
      // 立即执行
      fn?.();
      timeout = now;
    }
  };
})();

// 节流
export const debounce = (() => {
  let timer; // 维护一个 timer
  return (fn, delay = 3000) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn?.(), delay);
  };
})();

export const mouseScroll = () => {
  let timer;
  // 防抖节流函数
  return ({ el, time = 300, fn }) => {
    el.addEventListener('scroll', () => {
      let scrollHeightVal = el.scrollHeight,
        scrollTopVal = el.scrollTop,
        tbodyHeight = el.clientHeight;

      clearTimeout(timer);

      timer = setTimeout(() => {
        if (scrollTopVal + tbodyHeight > scrollHeightVal - 20) {
          fn && fn();
        }
      }, time);
    });
  };
};
export const mouseClick = () => {
  let timer;
  // 防抖节流函数
  return ({ el, time = 300, fn }) => {
    el.addEventListener('keyup', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn && fn();
      }, time);
    });
  };
};
