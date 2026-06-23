// 检查大写是否打开
export default (el, cb) => {
  el.addEventListener('keyup', function (event) {
    if (event.getModifierState('CapsLock')) {
      // CapsLock 已经打开了
      cb?.(true);
    } else {
      cb?.(false);
    }
  });
};
