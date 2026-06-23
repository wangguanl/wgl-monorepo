/**
 * @overview 根据校验规则校验数据，执行传入的回调函数，返回校验结果
 * @method 验证类型
 * @param { Object | required } rules - 校验规则.
 * @param { Array | required } data - 数据.
 * @return { Boolean | rules[key] } 返回值描述: 如果校验成功则返回 true, 校验失败返回校验的规则
 **/
export default (() => {
  const Rules = {
    empty: data =>
      data !== null &&
      data !== undefined &&
      (!Array.isArray(data) || data.length !== 0) &&
      (Object.prototype.toString.call(data) !== '[object Object]' ||
        JSON.stringify(data) !== '{}') &&
      (typeof data !== 'string' || data.replace(/\s+/g, '').length !== 0) &&
      !(typeof data !== 'number' && !data),

    // 校验是否以http或https开头的url
    url: data => /^(http|https):/.test(data),

    // 钱
    money: data =>
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
        data
      ),
    // 纯英文
    alphabets: data => /^[A-Za-z]+$/.test(data),

    // 浮点数
    float: data => /^-?[1-9]\d*\.\d+$|^-?0\.\d+$|^-?[1-9]\d*$|^0$/.test(data),
    // 汉字
    chinese: data => /^[\u4e00-\u9fa5]{0,}$/.test(data),

    placeholder: () => true,

    email: data =>
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        data
      ),
  };
  /**
   * @overview 如果自带校验方法则直接校验，否则使用已有的校验。校验成功或失败如果有函数则执行对应的函数
   * @method 传入一个公用data，返回一个可执行函数
   * @param { Function } validation - 自定义校验函数
   * @param { String } type - 已有规则的校验类型
   * @param { Function } success - 校验成功后执行的函数
   * @param { Function } error - 校验失败后执行的函数
   * @return { Boolean }
   **/
  const CacheData = data => (field, rule) => {
    // 自带校验方法
    const { validation, type, success, error } = rule;
    if (type === undefined) {
      console.warn(field + ' 字段没有传入既定校验类型');
      return true;
    } else if (!Rules[type]) {
      console.warn(
        '既定规则中无此校验类型，可使用validation传入自定义校验函数'
      );
      return false;
    }
    const pass = validation
      ? validation(data[field])
      : Rules[type](data[field]);
    pass ? success?.(rule) : error?.(rule);
    return pass;
  };
  return (rules, data) => {
    const Validation = CacheData(data);
    for (let field in rules) {
      // 多个校验规则
      if (Array.isArray(rules[field])) {
        for (let i = 0; i < rules[field].length; i++) {
          if (rules[field]) {
            if (!Validation(field, rules[field][i])) {
              return rules[field][i];
            }
          }
        }
      } else {
        // 单个校验规则
        if (!Validation(field, rules[field])) {
          return rules[field];
        }
      }
    }
    return true;
  };
})();
