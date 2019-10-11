import Vue from 'vue';
import Vuex from 'vuex';

import role from './role'; // 权限管理

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    role
  }
});