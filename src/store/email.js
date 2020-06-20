import API from '../lib/utils/baseConfig'
export default {
  namespaced: true,
  state: {
    emailBoxData: {}, // 当前邮箱数据
    lastOperation: {}, // 上一次操作,新邮件返回时用到
    emailType: 'standInsideLetter-all', // 操作类型
    activeMenu: "standInsideLetter-all",
    isSelectEmail: false, //是否选中邮件
    draftEmail: {}, // 草稿箱数据
    emailList: {}, // 草稿箱数据
   // tableData:[], // 列表数据
    multipleSelection: [], //列表选中数据
    itemList: [], //侧边栏数据
    mailObj: {} // 当前邮件数据
  },
  getters: {
    // 选中的邮件id列表
    selectList: state => {
      let list = [];
      state.multipleSelection.map(item => {
        list.push(item.id || item.messageId);
      });
      return list
    }
  },
  mutations: {
    setEmailBoxData(state, data) {
      state.emailBoxData = data;
      console.log(`emailBoxData:${JSON.stringify(state.emailBoxData)}`)
    },
    setIsSelectEmail(state, flag) {
      state.isSelectEmail = flag;
      console.log(`isSelectEmail:${state.isSelectEmail}`)
    },
    setLastOperation(state, obj) {
      state.lastOperation = { ...obj };
      console.log(`lastOperation:${state.lastOperation}`)
    },
    setActiveMenu(state, type) {
      state.activeMenu = type;
      console.log(`activeMenu:${state.activeMenu}`)
    },
    setEmailType(state, type) {
      state.emailType = type;
      console.log(`emailType:${state.emailType}`)
    },
    setEmailList(state, result) {
      state.emailList = { ...result };
    },
    setDraftEmail(state, result) {
      state.draftEmail = { ...result };
    },
    setMultipleSelection(state, data) {
      state.multipleSelection = [...data];
      console.log(`multipleSelection:${state.multipleSelection}`)
    },
    setItemList(state, data) {
      state.itemList = [...data];
      console.log(`itemList:${state.itemList}`)
    },
    setMailObj(state, obj) {
      state.mailObj = { ...obj };
    },
  },
  actions: {
    // 查询草稿箱列表
    async queryDraftEmailByPage({ commit, state }, obj = {
      searchValue: "",
      searchType: '',
      pageNum: 1
    }) {
      console.log(obj)
      let result =  await API.queryDraftEmailByPage({
        boxId: state.emailBoxData.boxId,
        searchType: obj.searchType,
        searchValue: obj.searchValue,
        pageNum: obj.pageNum,
        pageSize: 20
      })

      commit('setEmailList', result)
    },
    // 查询邮箱列表
    async queryEmailByPage({ commit, state }, obj = {
      searchValue: "",
      searchType: '',
      pageNum: 1
    }) {
      console.log(obj)
      let result =  await API.queryEmailByPage({
        boxId: state.emailBoxData.boxId,
        itemId: state.mailObj.itemId,
        itemFlag: state.mailObj.itemFlag,
        searchType: obj.searchType,
        searchValue: obj.searchValue,
        pageNum: obj.pageNum,
        pageSize: 20
      })
      commit('setEmailList', result)
    },
    // 同步邮件
    async syncMail({
      state
    }) {
      return await API.syncMail(state.emailBoxData.boxId)
    },
    async markRead({
      state,
      getters
    }) {
      return await API.markRead({
        boxId: state.emailBoxData.boxId,
        idList: getters.selectList
      })
    },
    async markUnRead({
      state,
      getters
    }) {
      return await API.markUnRead({
        boxId: state.emailBoxData.boxId,
        idList: getters.selectList
      })
    },
    async markReplyOnPlatform({
      state,
      getters
    }) {
      return await API.markReplyOnPlatform({
        boxId: state.emailBoxData.boxId,
        idList: getters.selectList
      })
    },
    async moveEmailItem({
      state,
      getters
    }, targetItemId) {

      return await API.moveEmailItem({
        boxId: state.emailBoxData.boxId,
        idList: getters.selectList,
        targetItemId
      })
    }
  }
};