export const formatDate = (timestamp, format) => {
  if (!timestamp) {
    return '';
  }
  if (String(timestamp).length === 10) {
    timestamp = timestamp * 1000;
  }
  var date = new Date(timestamp);
  var Y = date.getFullYear();
  var M = date.getMonth() + 1;
  var D = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  if (format === 'YYYY') {
    return Y; // 2021
  } else if (format === 'YYYY-MM') {
    // 2021-07
    return Y + '-' + (M < 10 ? '0' + M : M);
  } else if (format === 'YYYY-MM-DD') {
    // 2021-07-12
    return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D);
  } else if (format === 'HH:mm:ss') {
    // 10:20:35
    return (
      (hour < 10 ? '0' + hour : hour) +
      ':' +
      (min < 10 ? '0' + min : min) +
      ':' +
      (sec < 10 ? '0' + sec : sec)
    );
  } else if (format === 'YYYY-MM-DD HH:mm') {
    // 2021-07-12 10:20
    return (
      Y +
      '-' +
      (M < 10 ? '0' + M : M) +
      '-' +
      (D < 10 ? '0' + D : D) +
      ' ' +
      (hour < 10 ? '0' + hour : hour) +
      ':' +
      (min < 10 ? '0' + min : min)
    );
  } else if (format === 'YYYY-MM-DD HH:mm:ss') {
    // 2021-07-12 10:20:35
    return (
      Y +
      '-' +
      (M < 10 ? '0' + M : M) +
      '-' +
      (D < 10 ? '0' + D : D) +
      ' ' +
      (hour < 10 ? '0' + hour : hour) +
      ':' +
      (min < 10 ? '0' + min : min) +
      ':' +
      (sec < 10 ? '0' + sec : sec)
    );
  } else {
    return '--';
  }
};

// 传入的时间转为 年-月-日
export const transDate = date => {
  // 获取当前时间的年份转为字符串
  let year = date.getFullYear(),
    // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
    month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1, // '04'
    // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
    da =
      date.getDate() < 10
        ? '0' + date.getDate().toString()
        : date.getDate().toString(); // '12'
  return year + '-' + month + '-' + da;
};
