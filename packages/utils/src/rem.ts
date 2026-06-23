export const pxToRem = (str = '', scale = 100): string =>
  str.replace(
    /\d+px/g,
    px =>
      Number((parseInt(px) / parseInt(String(scale))).toFixed(3)) + 'rem'
  );
export const remToPx = (str = '', scale = 100): string =>
  str.replace(
    /(\d+\.?\d{0,3})rem/gi,
    (_$1, $2: string) => Math.floor(Number($2) * scale) + 'px'
  );
