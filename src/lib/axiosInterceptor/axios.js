import axios from 'axios'
import {Message} from 'element-ui'
// axios.defaults.baseURL = "http://47.112.213.96";
axios.defaults.withCredentials = true;

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  config.url = '/erp' + config.url; // 请求全局拼接erp路径
  if (config.data && config.data.notToken) { // 当传入notToken时表示接口无需token
    delete config.data.notToken;
  } else { // 请求时全局配置token
    config.headers['x-token'] = localStorage.getItem('token');
  }
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.code === 401) { // token失效
    localStorage.removeItem('token');
    location.replace(location.origin + '/#/login');
  } else if (response.data.code !== 0) { // 请求不成功全局提示
    Message.error(response.data.message);
  }
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios;