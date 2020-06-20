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
        <el-dropdown trigger="click" @command="handleShopName">
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
        <p>邮箱</p>
        <el-dropdown trigger="hover" @command="handleEmail">
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
      </div>
      <el-menu
        :default-openeds="lastOperation.type"
        background-color="#f3f3f3"
        active-text-color="#1ABC9C"
        :default-active="activeMenu"
        @select="handleSelect"
        v-if="itemList.length"
        style="padding-bottom: 20px;"
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
                v-if="(child.itemName=='需要回复'&&item.needReplyCount !=null)||(child.itemName=='未读'&& item.unseenCount  !=null)"
              >（{{delData(child.itemName,item)}}）</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="draftBox" class="draftBox">
          <i></i>
          <span slot="title">草稿箱</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      // activeMenu: "standInsideLetter-all",
      shopList: [],
      emailList: [],
      curShopObj: {},
      curEmailObj: {},
      itemList: []
    };
  },
  created() {
    this.queryShopNameList();
  },
  computed: {
    ...mapState("email", {
      activeMenu: state => state.activeMenu,
      lastOperation: state => state.lastOperation
    })
  },
  methods: {
    ...mapMutations("email", [
      "setEmailType",
      "setIsSelectEmail",
      "setMultipleSelection",
      "setEmailBoxData",
      "setLastOperation",
      "setItemList"
    ]),
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
    async queryItemList(boxId) {
      await this.API.queryItemList(boxId).then(res => {
        if (res.code === 0 && res.data.length) {
          const obj = {
            站内信: "standInsideLetter",
            "Q&A": "notice",
            亚马逊邮件: "amazon",
            其他邮件: "other",
            买家邮件: "buyers",
            自定义: "custom",
            草稿箱: "draftBox"
          };
          res.data.map((item, index, arr) => {
            item.name = obj[item.itemName];
            item.itemName = item.itemName == "Q&A" ? "Q&A通知" : item.itemName;
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
            } else if (item.itemName == "自定义") {
              item.childList = [
                { name: `${item.name}-all`, itemName: "全部" },
                { name: `${item.name}-unseen`, itemName: "未读" },
                { name: `${item.name}-replied`, itemName: "已回复" }
              ];
            }
          });
          this.itemList = [...res.data];
          this.setItemList([...res.data]);
        }
      });
    },
    // 查询店铺列表
    queryShopNameList() {
      this.API.queryShopNameList().then(res => {
        if (res.code === 0 && res.data.length) {
          this.shopList = res.data;
          this.curShopObj = res.data[0];
          this.queryBoxInfoByShopId({ shopId: this.curShopObj.shopId });
        }
      });
    },
    queryBoxInfoByShopId(data) {
      this.API.queryBoxInfoByShopId(data).then(res => {
        if (res.code === 0 && res.data.length) {
          this.emailList = res.data;
          this.handleEmail(res.data[0]);
        }
      });
    },

    //新邮件
    createEmail() {},
    handleSelect(i) {
      console.log(i);
      const data = [
        "standInsideLetter-all",
        "standInsideLetter-needReply",
        "standInsideLetter-unseen",
        "standInsideLetter-replied",
        "notice-all",
        "notice-unseen",
        "amazon-all",
        "amazon-unseen",
        "buyers-all",
        "buyers-needReply",
        "buyers-unseen",
        "buyers-replied",
        "custom-all",
        "custom-unseen",
        "custom-replied",
        "other-all",
        "other-unseen",
        "other-sended",
        "draftBox",
        "newEmail"
      ];
      let index = data.findIndex(val => {
        return val == i;
      });
      if (data[index] == "newEmail") {
        if (!this.emailList.length) {
          this.$message.warning("请先绑定邮箱!");
          return;
        }
        this.setLastOperation({
          type: [data[index].split("-")[0]],
          operate: this.$store.state.email.emailType
        });
        this.$router.push("/emailMainBody");
      }
      // 切换选项时,需要重置一些数据
      this.setEmailType(data[index]);
      this.setIsSelectEmail(false);
      this.setMultipleSelection([]);
    },
    handleShopName(command) {
      this.curShopObj = command;
      this.queryBoxInfoByShopId({ shopId: command });
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
.emailAside {
  overflow: hidden;
  box-sizing: border-box;
  font-size: 12px;
  width: 200px;

  .msg_left {
    height: 100%;
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
    .msg_left_top_btn {
      color: #fff;
      background: #1abc9c;
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
    padding-left: 14px;
    text-align: left;
    overflow-y: auto;
    /*修改滚动条样式*/
    &::-webkit-scrollbar {
      width: 2px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #333;
    }
    &::-webkit-scrollbar-corner {
      background: #179a16;
    }
    /*修改滚动条样式*/
    .num {
      display: contents;
    }
  }
  /deep/.el-menu-item {
    padding-left: 30px !important;
    min-width: 0px !important ;
    height: 36px;
    line-height: 36px;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #666;
  }
  .draftBox {
    margin-left: 23px;
    padding-left: 0 !important;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333333;
  }
  /deep/.el-submenu__title:hover,
  /deep/.el-menu-item:hover {
    background: none !important;
  }
  /deep/.el-submenu__title {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333333;
    padding-left: 0 !important;
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