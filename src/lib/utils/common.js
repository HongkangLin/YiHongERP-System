/**
 * 公共方法
 */
import axios from '../axiosInterceptor/axios';
import { JSEncrypt } from 'jsencrypt';
/*请求*/
function request(url, data = {}, method = "POST") {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method
        }
        if (method.toUpperCase() === 'GET') {
            options.params = data
        } else if (method.toUpperCase() === 'POST') {
            options.data = data
        }
        axios(options)
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
    })
}

/*加密*/
function encrypt(data) {
    const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCw8LEbXLArEnUwnGiOPw0YqDUwopOs3s0c5SWZgMID2J3s3pBD+Fme1a6JuMgiisBmFOt2bYkzHfVWkiqaZEjq5u+LAvmRhRoxgP4ESKE1Z99PWu8BlANHlctA6ybBOyWilPAYbkeUy355ot7pI97GIcLSsftD1p/8VBsJ6PafwIDAQAB';
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    let result = encrypt.encrypt(data)
    return result
}

/**
  * 下载
  * @param {String} url 目标文件地址
  * @param {String} filename 想要保存的文件名称
  */
function downloadFile(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    });
}
/**
    * 获取 blob
    * url 目标文件地址
    */
function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };

        xhr.send();
    });
}

/**
 * 保存 blob
 * filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}


export {
    request,
    encrypt,
    downloadFile
}