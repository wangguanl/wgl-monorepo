declare global {
  interface Window {
    baseUrl: string;
  }
  const baseUrl: string;
}

const uploadUrl = window.baseUrl + '/upload';

/* 
	上传文件
 	uploadFile(file.file).then(res => {});
*/
export function uploadFile(file: Blob): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const fileBuffer = new FormData();

    fileBuffer.append('', file);

    const xhr = new XMLHttpRequest();

    xhr.open('post', uploadUrl, true);

    xhr.send(fileBuffer);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const res = JSON.parse(
          xhr.responseText.replace(/\\/g, '/').replace(/\/\//g, '/')
        );
        resolve(res);
      }
    };
  });
}

import axios from 'axios';

export function uploadFile2(file: Blob): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const fileBuffer = new FormData();

    fileBuffer.append('image[]', file);
    fileBuffer.append('token', '');

    axios
      .post(baseUrl + '/img/upload_file', fileBuffer, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response: { code?: number; data?: unknown }) => {
        const { code, data } = response;
        if (code == 200) {
          resolve(data);
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export {};
