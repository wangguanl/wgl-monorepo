# 监听元素是否显示隐藏
## Example
```js
ObserveElVisible(
  document.querySelector('.box'),
  () => {
    console.log('已显示');
  },
  () => {
    console.log('已隐藏');
  }
);
```