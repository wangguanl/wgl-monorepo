// 深拷贝
export default function deepCopy<T>(obj: T): T {
  let result: T;
  if (typeof obj === 'object' && obj !== null) {
    result = (Array.isArray(obj) ? [] : {}) as T;
    for (const i in obj) {
      (result as Record<string, unknown>)[i] =
        typeof (obj as Record<string, unknown>)[i] === 'object'
          ? deepCopy((obj as Record<string, unknown>)[i])
          : (obj as Record<string, unknown>)[i];
    }
  } else {
    result = obj;
  }
  return result;
}
