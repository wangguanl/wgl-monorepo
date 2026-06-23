/*
	检测类型
	variable, 返回当前variable参数类型
	[, isType], 判断variable参数类型
	来自用户传输的内容都必须验证类型
 */
export default (variable: unknown, isType?: string): string | boolean => {
  const variableType: Record<string, string> = {
    '[object String]': 'string',
    '[object Object]': 'object',
    '[object Number]': 'number',
    '[object Boolean]': 'boolean',
    '[object Array]': 'array',
    '[object Undefined]': 'undefined',
    '[object Arguments]': 'arguments',
    '[object Function]': 'function',
    '[object Null]': 'null',
    '[object Date]': 'date',
    '[object JSON]': 'json',
    '[object RegExp]': 'regexp',
  };

  const type = variableType[Object.prototype.toString.call(variable)];
  return variableType[Object.prototype.toString.call(isType)] === 'string'
    ? type === isType.replace(/\s+/g, '').toLocaleLowerCase()
    : type;
};
