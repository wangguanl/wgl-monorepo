// 检查设备是否支持触摸事件
export default (): boolean => window && 'ontouchstart' in window;
