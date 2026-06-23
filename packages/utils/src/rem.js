export const pxToRem = (str = '', scale = 100) =>
  str.replace(
    /\d+px/g,
    px => (parseInt(px) / parseInt(scale)).toFixed(3) * 1 + 'rem'
  );
export const remToPx = (str = '', scale = 100) =>
  str.replace(
    /(\d+\.?\d{0,3})rem/gi,
    ($1, $2) => Math.floor($2 * scale) + 'px'
  );
