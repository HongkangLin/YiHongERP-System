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
    multipleSelection: [], //列表选中数据
    itemList: [], //侧边栏数据
    mailObj: {}, // 当前邮件数据
    asideNum: {},
    originalAsideNum: {},
    curReply: {},
    currentId:"" // 当前点击的列表id messageid
  },
  getters: {
    // 选中的邮件id列表
    selectList: state => {
      let list = [];
      state.multipleSelection.map(item => {
        list.push(item.id || item.messageId);
      });
      return list
    },
    uidList: state => {
      let list = [];
      state.multipleSelection.map(item => {
        list.push(item.uid);
      });
      return list
    },
    originalAsideNum: state => {
      let obj = {};
      state.itemList.map(item => {
        item.childList.map(arr => {
          if (arr.name.includes("needReply")) {
            obj[arr.name] = item.needReplyCount
          }
          if (arr.name.includes("unseen")) {
            obj[arr.name] = item.unseenCount
          }
        })
      });
      return obj
    }
  },
  mutations: {
    setCurrentId(state,id){
      state.currentId = id;
    },
    setEmailBoxData(state, data) {
      state.emailBoxData = data;
    },
    setIsSelectEmail(state, flag) {
      state.isSelectEmail = flag;
    },
    setLastOperation(state, obj) {
      state.lastOperation = { ...obj };
    },
    setActiveMenu(state, type) {
      state.activeMenu = type;
    },
    setEmailType(state, type) {
      state.emailType = type;
    },
    setEmailList(state, result) {
      state.emailList = { ...result };
    },
    setDraftEmail(state, result) {
      state.draftEmail = { ...result };
    },
    setMultipleSelection(state, data) {
      state.multipleSelection = [...data];
    },
    setItemList(state, data) {
      state.itemList = [...data];
    },
    setMailObj(state, obj) {
      state.mailObj = { ...obj };
    },
    setAsideNum(state, data) {
      state.asideNum = { ...data };
    },
    openDetailResetAsideNum(state, data) {
      const obj = { ...state.asideNum };
      let arr = state.emailType.split('-');
      const needReduceType = `${arr[0]}-${data.type}`;
      if(obj[needReduceType]){
        obj[needReduceType] -= 1
      }else{
        obj[needReduceType]=0
      }
      state.asideNum = { ...obj }
    },

    setcurReply(state, obj) {
      state.curReply = { ...obj }
    }
  },
  actions: {
    async queryItemList({ commit, state ,getters}){
      await API.queryItemList(state.emailBoxData.boxId).then(res=>{
        if (res.code === 0 && res.data.length) {
          const obj = {
            站内信: "standInsideLetter",
            "Q&A": "notice",
            亚马逊邮件: "amazon",
            其他邮件: "other",
            买家邮件: "buyers",
            草稿箱: "draftBox"
          };
          let keys = Object.keys(obj);
          res.data.map((item, index, arr) => {
            // 系统邮件
            if (keys.includes(item.itemName)) {
              item.name = obj[item.itemName];
              if (item.itemName == "站内信" || item.itemName == "买家邮件") {
                item.childList = [
                  { name: `${item.name}-all`, itemName: "全部" },
                  { name: `${item.name}-needReply`, itemName: "需要回复" },
                  { name: `${item.name}-unseen`, itemName: "未读" },
                  { name: `${item.name}-replied`, itemName: "已回复" }
                ];
              } else if (item.noticeFlag) {
                item.childList = [
                  { name: `${item.name}-all`, itemName: "全部" },
                  { name: `${item.name}-unseen`, itemName: "未读" }
                ];
              } else if (item.itemName == "其他邮件") {
                item.childList = [
                  { name: `${item.name}-all`, itemName: "全部" },
                  { name: `${item.name}-unseen`, itemName: "未读" },
                  { name: `${item.name}-sended`, itemName: "已发送" }
                ];
              } else if (item.itemName == "草稿箱") {
                arr.splice(index, 1);
              }
            } else {
              // 自定义分类如果是通知，就禁回复，非通知就不禁回复
               item.name = `custom_${index}`;
              if (item.noticeFlag) {
                item.childList = [
                  { name: `${item.name}-all`, itemName: "全部" },
                  { name: `${item.name}-unseen`, itemName: "未读" },
                ];
              } else {
                item.childList = [
                  { name: `${item.name}-all`, itemName: "全部" },
                  { name: `${item.name}-unseen`, itemName: "未读" },
                  { name: `${item.name}-replied`, itemName: "已回复" }
                ];
              }
            }
          });
          commit("setItemList",res.data)
          commit("setAsideNum",getters.originalAsideNum)
        }
      })
    },
    // 查询草稿箱列表
    async queryDraftEmailByPage({ commit, state }, obj = {
      searchValue: "",
      searchType: '',
      pageNum: 1
    }) {
      let result = await API.queryDraftEmailByPage({
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
      let result = await API.queryEmailByPage({
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
        idList: getters.uidList
      })
    },
    async markUnRead({
      state,
      getters
    }) {
      return await API.markUnRead({
        boxId: state.emailBoxData.boxId,
        idList: getters.uidList
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
        messageIdList: getters.selectList,
        targetItemId
      })
    }
  }
};