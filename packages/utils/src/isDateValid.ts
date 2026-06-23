// 检查日期是否有效
export default (...val: ConstructorParameters<typeof Date>): boolean =>
  !Number.isNaN(new Date(...val).valueOf());
