// 处理点击元素外部的事件
export default (element: HTMLElement, callback: () => void): void => {
  document.addEventListener('click', e => {
    if (!element.contains(e.target as Node)) callback();
  });
};
