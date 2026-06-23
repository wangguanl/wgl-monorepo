export default (canvas = 750) => {
  const applyScale = value => {
    const clientWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize =
      (100 * (clientWidth / value)).toFixed(4) + 'px';
  };
  applyScale(canvas);
  window.addEventListener('resize', () => applyScale(canvas));
};
