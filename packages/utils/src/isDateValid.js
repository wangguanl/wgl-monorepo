// 检查日期是否有效
export default (...val) => !Number.isNaN(new Date(...val).valueOf());
