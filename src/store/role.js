export default {
  namespaced: true,
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
  }
};