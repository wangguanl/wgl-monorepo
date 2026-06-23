// 平滑滚动到元素视图中
export default element =>
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth',
  });
