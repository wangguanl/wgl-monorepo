/*
 * url 中取出对应的key值
 * @url ?a=1&b=2&c=3&b=4
 * @key url[key]
 */
export const getUrlKey = (url, key) =>
  decodeURIComponent(
    (new RegExp('[?|&]' + key + '=([^&;]+?)(&|#|;|$)').exec(url) || [
      null,
      '',
    ])[1].replace(/\+/g, '%20')
  ) || null;

// 将对象解析为url ?a=1&b=2&c=3&b=4
export const stringifyQuery = obj => {
  let urlStr = '';
  for (let k in obj) {
    if (obj[k] === undefined) {
      obj[k] = '';
    }
    urlStr += encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]) + '&';
  }
  return urlStr;
};

/*
	传入对象 解析为 query
	@obj 对象
	@key 去除的key值
*/
export const stringifyQuerySlice = (obj, key) => {
  let queryString = '';
  for (let i in obj) {
    if (key && key !== i) {
      queryString += obj[i] + '&';
    }
  }
  return queryString.slice(0, -1);
};

// @url 可传入 ?a=1&b=2&c=3&b=4 解析为对象 {a:1, b:2, c:3, d:4}
export const parseQueryString = url => {
  var json = {},
    arr = url.substr(url.indexOf('?') + 1).split('&');
  arr.forEach(item => {
    var tmp = item.split('=');
    json[tmp[0]] = tmp[1];
  });
  return json;
};

// @url 可传入 ?a=1&b=2&c=3&b=4 解析为对象 {a:1, b:2, c:3, d:4}
export const parseQueryString2 = url =>
  url
    .match(/([^?=&]+)(=([^&]*))/g)
    .reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
      ),
      {}
    );

/*
 *	去除某一个值
 * 	@url 地址
 *	@key 去除值
 */
export const queryStringSlice = (url, key) =>
  url.replace(new RegExp(`${key}=\\d*(&?)|(&?)${key}=\\d*`, 'g'), '');
