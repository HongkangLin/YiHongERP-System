import Vue from 'vue';
import Vuex from 'vuex';

import role from './role'; // 权限管理
import email from './email'; 

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    role,
    email
  }
});