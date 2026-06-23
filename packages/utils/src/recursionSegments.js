/*
  * 递归解析数组生成层级对象
  function recursionSegments<T>(segments: array, propsTarget: object<props.modelValue | T>, val: any): T {
    return propsTarget;
  }
*/
export default function recursionSegments(segments, propsTarget = {}, val) {
  const key = segments.shift();
  if (segments.length) {
    if (Object.keys(propsTarget).indexOf(key) === -1) {
      propsTarget[key] = {};
    }
    recursionSegments(segments, propsTarget[key], val);
  } else {
    propsTarget[key] = val;
  }
  return propsTarget;
}
