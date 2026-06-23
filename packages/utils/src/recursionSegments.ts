/*
  * 递归解析数组生成层级对象
*/
export default function recursionSegments(
  segments: string[],
  propsTarget: Record<string, unknown> = {},
  val?: unknown
): Record<string, unknown> {
  const key = segments.shift()!;
  if (segments.length) {
    if (Object.keys(propsTarget).indexOf(key) === -1) {
      propsTarget[key] = {};
    }
    recursionSegments(segments, propsTarget[key] as Record<string, unknown>, val);
  } else {
    propsTarget[key] = val;
  }
  return propsTarget;
}
