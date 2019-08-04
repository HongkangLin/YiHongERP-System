import Vue from 'vue'
import App from './App.vue'

// 引入路由配置
import router from './router/index'

// 按需引入ElementUI
import ElementUI from './lib/elementUI/config'
ElementUI(Vue);

// 导入并挂载axios
import axios from './lib/axiosInterceptor/axios'
// Vue.prototype.$axios = axios;
window.axios = axios;

import './assets/css/base.css'

Vue.config.productionTip = false

window.vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
