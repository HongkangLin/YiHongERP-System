<template>
  <el-aside width="200px" class="emailAside">
    <div class="msg_left">
      <div class="msg_left_top bd_bt_1">
        <el-button
          class="msg_left_top_btn"
          icon="el-icon-s-promotion"
          size="medium"
          @click="handleSelect('newEmail')"
        >新邮件</el-button>
        <p>店铺</p>
        <el-dropdown trigger="click" @command="handleShopName" v-if="curShopObj.shopName">
          <span class="el-dropdown-link">
            <span class="el-dropdown-info">{{curShopObj.shopName}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="ad-dropdown-select">
            <el-dropdown-item
              v-for="(item, index) in shopList"
              :key="index"
              :command="item"
            >{{item.shopName}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <p v-else class="noData">暂无店铺</p>
        <p>邮箱</p>
        <el-dropdown trigger="hover" @command="handleEmail" v-if="curEmailObj.emailUsername">
          <span class="el-dropdown-link">
            <span class="el-dropdown-info">{{curEmailObj.emailUsername}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="ad-dropdown-select">
            <el-dropdown-item
              v-for="(item, index) in emailList"
              :key="index"
              :command="item"
            >{{item.emailUsername}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <p v-else class="noData">暂无邮箱</p>
      </div>
      <el-menu
        :default-openeds="openeds"
        background-color="#f3f3f3"
        active-text-color="#1ABC9C"
        :default-active="activeMenu"
        @select="handleSelect"
        v-if="itemList.length"
        class="setScrollbar"
      >
        <el-submenu :index="item.name" class="bd_bt_1" v-for="(item,i) in itemList" :key="i">
          <template slot="title">
            <i class="el-icon-caret-bottom el-submenu__icon-arrow el-icon-arrow-down"></i>
            {{item.itemName}}
          </template>
          <el-menu-item-group v-if="item.childList">
            <el-menu-item :index="child.name" v-for="(child,j) in item.childList" :key="j">
              {{child.itemName}}
              <span
                class="num"
                v-if="child.itemName=='需要回复'&&item.needReplyCount !=null"
              >（{{asideNum[child.name]}}）</span>
              <span
                class="num"
                v-if="child.itemName=='未读'&& item.unseenCount !=null"
              >（{{asideNum[child.name]}}）</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="draftBox" class="draftBox">
          <i></i>
          <span slot="title">草稿箱</span>
        </el-menu-item>
      </el-menu>
      <div class="noAsideData" v-else>暂无数据</div>
    </div>
  </el-aside>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      shopList: [],
      emailList: [],
      curShopObj: {},
      curEmailObj: {}
    };
  },
  created() {
    if(this.roleCtl.mail_query){
        this.queryShopNameList();
    }else{
      this.$message.warning("无权查看")
    }
  
  },
  computed: {
    ...mapState("email", {
      activeMenu: state => state.activeMenu,
      asideNum: state => state.asideNum,
      itemList: state => state.itemList
    }),
    ...mapGetters("email", ["originalAsideNum"]),
    openeds() {
      let arr = [];
      this.itemList.forEach(item => {
        arr.push(item.name);
      });
      return arr;
    }
  },
  methods: {
    ...mapMutations("email", [
      "setEmailType",
      "setIsSelectEmail",
      "setMultipleSelection",
      "setEmailBoxData",
      "setLastOperation",
      "setItemList",
      "setAsideNum"
    ]),
    ...mapActions("email", ["queryItemList"]),
    delData(itemName, item) {
      if (itemName === "需要回复") {
        if (item.needReplyCount != null) {
          return item.needReplyCount;
        }
      } else if (itemName === "未读") {
        if (item.unseenCount != null) {
          return item.unseenCount;
        }
      }
    },
    // 查询店铺列表
    queryShopNameList() {
      this.API.queryShopNameList().then(res => {
        if (res.code === 0 && res.data.length) {
          this.shopList = res.data;
          this.curShopObj = res.data[0];
          this.queryBoxInfoByShopId({ shopId: this.curShopObj.shopId });
        } else {
          this.$message.error("没有数据");
          return;
        }
      });
    },
    queryBoxInfoByShopId(data) {
      this.API.queryBoxInfoByShopId(data).then(res => {
        if (res.code === 0 && res.data.length) {
          this.emailList = res.data;
          this.handleEmail(res.data[0]);
        } else {
          this.$message.error("没有数据");
          return;
        }
      });
    },
    handleSelect(i) {
      let keys = [];
      let list = [...this.itemList];
      list.map((item, k) => {
        if (item.childList && item.childList.length) {
          item.childList.map(arr => {
            keys.push(arr.name);
          });
        }
      });
      keys.push(...["draftBox", "newEmail"]);
      let index = keys.findIndex(val => {
        return val == i;
      });
      if (keys[index] == "newEmail") {
        if (!this.emailList.length) {
          this.$message.warning("请先绑定邮箱!");
          return;
        }
        this.setLastOperation({
          operate: this.$store.state.email.emailType
        });
        this.$router.push("/draftBoxAndNewEmail");
      }
      // 切换选项时,需要重置一些数据
      this.setEmailType(keys[index]);
      this.setIsSelectEmail(false);
      this.setMultipleSelection([]);
    },
    handleShopName(command) {
      this.curShopObj = command;
      this.queryBoxInfoByShopId({ shopId: command.shopId });
    },
    handleEmail(command) {
      this.curEmailObj = command;
      let obj = { ...command };
      obj.shopName = this.curShopObj.shopName;
      this.setEmailBoxData(obj);
      this.queryItemList(command.boxId);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.emailAside {
  overflow: hidden;
  box-sizing: border-box;
  font-size: 12px;
  width: 200px;
  border-right: 1px solid #e4e4e4;
  .msg_left {
    height: 100%;
    display: flex;
    flex-direction: column;
    .noAsideData {
      background: #f3f3f3;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #666666;
      flex: 1 1 auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .msg_left_top {
    width: 200px;
    background: #f3f3f3;
    color: #adadad;
    padding: 14px 0 14px 14px;
    text-align: left;
    font-size: 14px;
    p {
      margin: 0 !important;
      height: 20px;
      line-height: 20px;
    }
    .noData {
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #5e5e5e;
    }
    .msg_left_top_btn {
      color: #fff;
      background: @themeColor;
      width: calc(162px - 28px);
      font-size: 12px;
    }
    /deep/.el-dropdown {
      cursor: pointer;
      .el-dropdown-info {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 155px;
        display: inline-block;
      }
      .el-dropdown-link {
        color: #5e5e5e;
        font-size: 14px;
        font-weight: 400;
        height: 24px;
        line-height: 24px;
        i {
          vertical-align: super;
          font-size: 14px;
        }
      }
      .ad-dropdown-select {
        text-align: center;
      }
    }
  }

  /deep/.el-menu {
    max-width: 200px;
    border-right: none !important;
    height: calc(100% - 150px);
    font-size: 12px;
    color: rgba(0, 0, 0, 0.647058823529412);
    text-align: left;
    overflow-y: auto;
    .num {
      display: contents;
    }
  }
  .draftBox {
    margin-left: 23px;
    padding-left: 0 !important;
    height: 36px;
    line-height: 36px;
    font-size: 14px !important;
    color: #333333;
  }
  /deep/.el-submenu__title:hover,
  /deep/.el-menu-item:hover {
    background: none !important;
  }
  /deep/.el-menu-item {
    padding-left: 30px;
    min-width: 0px;
    height: 32px;
    line-height: 32px;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #666;
  }
  /deep/.el-submenu__title {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #333333;
    padding-left: 14px !important;
  }
  /deep/.el-menu--inline {
    /deep/.el-menu-item {
      padding-left: 58px !important ;
    }
  }
  /deep/.el-submenu__title i:nth-last-of-type(1) {
    display: none;
  }
  /deep/.el-submenu__icon-arrow {
    position: relative !important;
    top: 0;
    right: 0;
    margin-top: 0;
  }
  /deep/.el-submenu [class^="el-icon-"] {
    width: 18px;
  }
  /deep/.el-menu-item-group__title {
    padding: 0 !important;
  }
}
</style>