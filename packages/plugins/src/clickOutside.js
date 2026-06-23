// 处理点击元素外部的事件
export default (element, callback) => {
  document.addEventListener('click', e => {
    if (!element.contains(e.target)) callback();
  });
};
