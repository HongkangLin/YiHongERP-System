import axios from 'axios'

// axios.defaults.baseURL = "";
axios.defaults.withCredentials = true;

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.code !== 0) {
    window.vm.$message.error(response.data.message);
  }
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios;