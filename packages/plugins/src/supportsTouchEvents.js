// 检查设备是否支持触摸事件
export default () => window && 'ontouchstart' in window;
