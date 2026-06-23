// 生成唯一标识

const Base64 = {
  // 转码表
  // prettier-ignore
  table: [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/',
  ],
  UTF16ToUTF8: function (str: string): string {
    const res: string[] = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (code > 0x0000 && code <= 0x007f) {
        res.push(str.charAt(i));
      } else if (code >= 0x0080 && code <= 0x07ff) {
        const byte1 = 0xc0 | ((code >> 6) & 0x1f),
          byte2 = 0x80 | (code & 0x3f);
        res.push(String.fromCharCode(byte1), String.fromCharCode(byte2));
      } else if (code >= 0x0800 && code <= 0xffff) {
        const byte1 = 0xe0 | ((code >> 12) & 0x0f),
          byte2 = 0x80 | ((code >> 6) & 0x3f),
          byte3 = 0x80 | (code & 0x3f);
        res.push(
          String.fromCharCode(byte1),
          String.fromCharCode(byte2),
          String.fromCharCode(byte3)
        );
      }
    }

    return res.join('');
  },
  UTF8ToUTF16: function (str: string): string {
    const res: string[] = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (((code >> 7) & 0xff) === 0x0) {
        res.push(str.charAt(i));
      } else if (((code >> 5) & 0xff) === 0x6) {
        const code2 = str.charCodeAt(++i),
          byte1 = (code & 0x1f) << 6,
          byte2 = code2 & 0x3f,
          utf16 = byte1 | byte2;
        res.push(String.fromCharCode(utf16));
      } else if (((code >> 4) & 0xff) === 0xe) {
        const code2 = str.charCodeAt(++i),
          code3 = str.charCodeAt(++i),
          byte1 = (code << 4) | ((code2 >> 2) & 0x0f),
          byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3f),
          utf16 = ((byte1 & 0x00ff) << 8) | byte2;
        res.push(String.fromCharCode(utf16));
      }
    }

    return res.join('');
  },
  encode: function (str: string): string {
    if (!str) {
      return '';
    }
    const utf8 = this.UTF16ToUTF8(str),
      len = utf8.length,
      res: string[] = [];
    let i = 0;
    while (i < len) {
      const c1 = utf8.charCodeAt(i++) & 0xff;
      res.push(this.table[c1 >> 2]);
      if (i === len) {
        res.push(this.table[(c1 & 0x3) << 4]);
        res.push('==');
        break;
      }
      const c2 = utf8.charCodeAt(i++);
      if (i === len) {
        res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
        res.push(this.table[(c2 & 0x0f) << 2]);
        res.push('=');
        break;
      }
      const c3 = utf8.charCodeAt(i++);
      res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
      res.push(this.table[((c2 & 0x0f) << 2) | ((c3 & 0xc0) >> 6)]);
      res.push(this.table[c3 & 0x3f]);
    }

    return res.join('');
  },
  decode: function (str: string): string {
    if (!str) {
      return '';
    }

    const len = str.length;
    let i = 0;
    const res: string[] = [];

    while (i < len) {
      const code1 = this.table.indexOf(str.charAt(i++)),
        code2 = this.table.indexOf(str.charAt(i++)),
        code3 = this.table.indexOf(str.charAt(i++)),
        code4 = this.table.indexOf(str.charAt(i++)),
        c1 = (code1 << 2) | (code2 >> 4),
        c2 = ((code2 & 0xf) << 4) | (code3 >> 2),
        c3 = ((code3 & 0x3) << 6) | code4;

      res.push(String.fromCharCode(c1));

      if (code3 !== 64) {
        res.push(String.fromCharCode(c2));
      }
      if (code4 !== 64) {
        res.push(String.fromCharCode(c3));
      }
    }

    return this.UTF8ToUTF16(res.join(''));
  },
};
export default (): string => {
  let d = new Date().getTime(),
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  return Base64.encode(uuid);
};
