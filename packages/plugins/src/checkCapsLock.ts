// 检查大写是否打开
export default (el: HTMLElement, cb?: (capsLockOn: boolean) => void): void => {
  el.addEventListener('keyup', function (event) {
    if (event.getModifierState('CapsLock')) {
      cb?.(true);
    } else {
      cb?.(false);
    }
  });
};
