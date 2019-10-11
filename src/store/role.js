export default {
  state: {
    menu: {}
  },
  mutations: {
    setMenu (state, data) {
      state.menu = data;
    }
  },
  getters: {
    getMenu (state) {
      return state.menu;
    }
  }
};