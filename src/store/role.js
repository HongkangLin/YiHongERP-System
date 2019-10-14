export default {
  state: {
    menu: [],
    roleCtl: {}
  },
  mutations: {
    setMenu (state, data) {
      state.menu = data;
    },
    getRoleCtl (state, data) {
      state.roleCtl = data;
    }
  },
  getters: {
    getMenu (state) {
      return state.menu;
    }
  }
};