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

function jsonMerge(jsonArr,keyArr){
	let newJson = [] //合并好的数据都放在这个数组里
	jsonArr.forEach((itemJson,indexJson)=>{
		let mark = -1
		let finded = newJson.find((itemFind, indexFind) => {
			if (itemFind[keyArr[0]] === itemJson[keyArr[0]]) {
				mark = indexFind
				return itemFind[keyArr[0]] === itemJson[keyArr[0]]
			}
		})
		if(!finded){
			let value = {}
			value[keyArr[0]] = itemJson[keyArr[0]]
			value['children'] = []
			let info = {}
			for(let i in itemJson){
				if(i!==keyArr[0]){
					info[i] = itemJson[i]
				}
			}
			value['children'].push(info)

   			// console.log(info)                            
			newJson.push(value)
		}else{
			let info = {}
			for(let i in itemJson){
				if(i!==keyArr[0]){
					info[i] = itemJson[i]
				}
			}
			newJson[mark]['children'].push(info)
       
		}
	})
	// 递归的条件是不断的缩减keyArr的length，每次都去除第零个，直到为0
	if(keyArr.length === 1){
		return newJson
	}else{
		return newJson.map((itemInfo)=>{
			let newKeyArr = []
			keyArr.forEach((item,index)=>{
				if(index>0){
					newKeyArr.push(item)
				}
			})
			return{
				[keyArr[0]]:itemInfo[keyArr[0]],
				'children':jsonMerge(itemInfo['children'],newKeyArr)
			}
		})
	}
}

 /**
     *获取当前时间
     *format=1精确到天
     *format=2精确到分
    */
   function getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    // if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if(format==1){
      time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if(format==2){
      time = year + "-" + month + "-" + date+ " " + hour + ":" + minu;
    }
    return time;
  }


  function escape(str) {
    str = str.replace(/&/g, '&amp;')
    str = str.replace(/</g, '&lt;')
    str = str.replace(/>/g, '&gt;')
    str = str.replace(/"/g, '&quto;')
    str = str.replace(/'/g, '&#39;')
    str = str.replace(/`/g, '&#96;')
    str = str.replace(/\//g, '&#x2F;')
    return str
  }

export {
    request,
    encrypt,
    downloadFile,
    jsonMerge,
    getCurrentDate,
    escape
}