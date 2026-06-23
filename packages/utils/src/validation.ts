type RuleType =
  | 'empty'
  | 'url'
  | 'money'
  | 'alphabets'
  | 'float'
  | 'chinese'
  | 'placeholder'
  | 'email';

interface ValidationRule {
  validation?: (value: unknown) => boolean;
  type?: RuleType;
  success?: (rule: ValidationRule) => void;
  error?: (rule: ValidationRule) => void;
}

type Rules = Record<string, ValidationRule | ValidationRule[]>;

/**
 * @overview 根据校验规则校验数据，执行传入的回调函数，返回校验结果
 * @method 验证类型
 * @param { Object | required } rules - 校验规则.
 * @param { Array | required } data - 数据.
 * @return { Boolean | rules[key] } 返回值描述: 如果校验成功则返回 true, 校验失败返回校验的规则
 **/
export default (() => {
  const Rules: Record<
    RuleType,
    (data: unknown) => boolean
  > = {
    empty: data =>
      data !== null &&
      data !== undefined &&
      (!Array.isArray(data) || data.length !== 0) &&
      (Object.prototype.toString.call(data) !== '[object Object]' ||
        JSON.stringify(data) !== '{}') &&
      (typeof data !== 'string' || data.replace(/\s+/g, '').length !== 0) &&
      !(typeof data !== 'number' && !data),

    url: data => /^(http|https):/.test(String(data)),

    money: data =>
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
        String(data)
      ),
    alphabets: data => /^[A-Za-z]+$/.test(String(data)),

    float: data =>
      /^-?[1-9]\d*\.\d+$|^-?0\.\d+$|^-?[1-9]\d*$|^0$/.test(String(data)),
    chinese: data => /^[\u4e00-\u9fa5]{0,}$/.test(String(data)),

    placeholder: () => true,

    email: data =>
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(data)
      ),
  };

  const CacheData =
    (data: Record<string, unknown>) => (field: string, rule: ValidationRule) => {
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
  return (rules: Rules, data: Record<string, unknown>) => {
    const Validation = CacheData(data);
    for (const field in rules) {
      if (Array.isArray(rules[field])) {
        for (let i = 0; i < (rules[field] as ValidationRule[]).length; i++) {
          if (rules[field]) {
            if (
              !Validation(field, (rules[field] as ValidationRule[])[i])
            ) {
              return (rules[field] as ValidationRule[])[i];
            }
          }
        }
      } else {
        if (!Validation(field, rules[field] as ValidationRule)) {
          return rules[field];
        }
      }
    }
    return true;
  };
})();
