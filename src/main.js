import Vue from 'vue'
import App from './App.vue'
import crumbs from '#/crumbs/crumbs'
import store from './store'
import API from './lib/utils/baseConfig'
import { encrypt } from './lib/utils/common'
Vue.component('crumbs', crumbs);

// 引入路由配置
import router from './router/index'

// 按需引入ElementUI
import ElementUI from './lib/elementUI/config'
ElementUI(Vue);

// 导入并挂载axios
import axios from './lib/axiosInterceptor/axios'

window.axios = axios;
//全局接口地址
Vue.prototype.API = API;
Vue.prototype.encrypt = encrypt;


import './assets/css/base.css'
import './assets/css/main.css'
// 打印print.js
// import Print from 'vue-print-nb'
// Vue.use(Print); //注册

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
