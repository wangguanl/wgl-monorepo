// 防抖
export const throttle = (() => {
  let timeout = 0;
  return (fn?: () => void, delay = 1000) => {
    const now = new Date().valueOf();
    if (now - timeout > delay) {
      fn?.();
      timeout = now;
    }
  };
})();

// 节流
export const debounce = (() => {
  let timer: ReturnType<typeof setTimeout>;
  return (fn?: () => void, delay = 3000) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn?.(), delay);
  };
})();

interface ScrollOptions {
  el: HTMLElement;
  time?: number;
  fn?: () => void;
}

export const mouseScroll = () => {
  let timer: ReturnType<typeof setTimeout>;
  return ({ el, time = 300, fn }: ScrollOptions) => {
    el.addEventListener('scroll', () => {
      const scrollHeightVal = el.scrollHeight,
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
  let timer: ReturnType<typeof setTimeout>;
  return ({ el, time = 300, fn }: ScrollOptions) => {
    el.addEventListener('keyup', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn && fn();
      }, time);
    });
  };
};
