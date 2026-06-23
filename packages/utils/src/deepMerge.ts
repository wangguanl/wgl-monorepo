// 对象深合并
export default function deepMerge<T extends Record<string, unknown>>(
  obj1: T,
  obj2: Partial<T>
): T {
  let key: string;
  for (key in obj2) {
    if (
      obj1[key] &&
      Array.isArray(obj1[key]) &&
      obj2[key] &&
      Array.isArray(obj2[key])
    ) {
      (obj1 as Record<string, unknown>)[key] = [
        ...(obj1[key] as unknown[]),
        ...(obj2[key] as unknown[]),
      ];
    } else if (
      obj1[key] &&
      obj1[key].toString() === '[object Object]' &&
      obj2[key] &&
      obj2[key].toString() === '[object Object]'
    ) {
      (obj1 as Record<string, unknown>)[key] = deepMerge(
        obj1[key] as Record<string, unknown>,
        obj2[key] as Record<string, unknown>
      );
    } else {
      (obj1 as Record<string, unknown>)[key] = obj2[key];
    }
  }
  return obj1;
}
