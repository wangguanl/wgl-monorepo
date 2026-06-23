// 平滑滚动到元素视图中
export default (element: string): void => {
  document.querySelector(element)!.scrollIntoView({
    behavior: 'smooth',
  });
};
