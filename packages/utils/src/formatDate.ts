type DateInput = Date | string | number;

export const formatDate = (
  timestamp: DateInput,
  format?: string
): string | number => {
  if (!timestamp) {
    return '';
  }
  let ts = timestamp;
  if (String(timestamp).length === 10) {
    ts = Number(timestamp) * 1000;
  }
  const date = new Date(ts as string | number);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  if (format === 'YYYY') {
    return Y;
  } else if (format === 'YYYY-MM') {
    return Y + '-' + (M < 10 ? '0' + M : M);
  } else if (format === 'YYYY-MM-DD') {
    return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D);
  } else if (format === 'HH:mm:ss') {
    return (
      (hour < 10 ? '0' + hour : hour) +
      ':' +
      (min < 10 ? '0' + min : min) +
      ':' +
      (sec < 10 ? '0' + sec : sec)
    );
  } else if (format === 'YYYY-MM-DD HH:mm') {
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
export const transDate = (date: Date): string => {
  const year = date.getFullYear(),
    month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1,
    da =
      date.getDate() < 10
        ? '0' + date.getDate().toString()
        : date.getDate().toString();
  return year + '-' + month + '-' + da;
};
