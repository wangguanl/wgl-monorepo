export default (canvas = 750): void => {
  const applyScale = (value: number) => {
    const clientWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize =
      (100 * (clientWidth / value)).toFixed(4) + 'px';
  };
  applyScale(canvas);
  window.addEventListener('resize', () => applyScale(canvas));
};
