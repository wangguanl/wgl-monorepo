// 获取选定的文本
export default (): string => window.getSelection()!.toString();
