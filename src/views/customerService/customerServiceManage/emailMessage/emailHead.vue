<template>
  <el-header class="emailHead" v-if="emailType!='draftBox'">
    <el-button size="medium" style="background-color: #1ABC9C;color:#fff" @click="synchronous" v-if="isShowSync">同步邮件</el-button>
    <el-button size="medium" @click="handlerEmail('markRead')"  v-if="isShowMarkRead">标记已读</el-button>
    <el-button size="medium" @click="handlerEmail('markUnRead')"   v-if="isShowMarkUnRead">标记未读</el-button>
    <el-button size="medium" @click="handlerEmail('markReplyOnPlatform')"   v-if="isShowMarkReplyOnPlatform">已在平台回复</el-button>
    <el-select
      v-model="targetItemId"
      placeholder="移动邮件分类"
      class="classify"
      @change="handlerEmail('moveEmailItem')"
       v-if="isShowMoveEmailItem"
    >
      <el-option v-for="(item,index) in simpList" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </el-header>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      targetItemId: "",
      simpList: []
    };
  },
  created() {
    this.querySimpList();
  },
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      emailBoxData: state => state.emailBoxData
    }),
    ...mapGetters("email", {
      selectList: "selectList"
    }),
    isShowSync(){
      return this.roleCtl.mail_sync&&(this.emailType.includes('standInsideLetter')||this.emailType.includes('buyers')||this.emailType.includes('notice')||this.emailType.includes('amazon')||this.emailType.includes('other'))
    },
    isShowMarkRead(){
      return this.roleCtl.mail_markRead&&(this.emailType.includes('standInsideLetter')||this.emailType.includes('buyers')||this.emailType.includes('notice')||this.emailType.includes('amazon')||this.emailType.includes('other'))
    },
    isShowMarkUnRead(){
      return this.roleCtl.mail_markUnRead&&(this.emailType.includes('standInsideLetter')||this.emailType.includes('buyers'))
    },
    isShowMarkReplyOnPlatform(){
      return this.emailType.includes('standInsideLetter')||this.emailType.includes('buyers')
    },
    isShowMoveEmailItem(){
      return this.emailType.includes('standInsideLetter')||this.emailType.includes('buyers')||this.emailType.includes('notice')||this.emailType.includes('amazon')||this.emailType.includes('other')
    },
  },
  methods: {
    ...mapMutations("email", ["setMultipleSelection"]),
    ...mapActions("email", [
      "syncMail",
      "markRead",
      "markUnRead",
      "markReplyOnPlatform",
      "moveEmailItem",
      "queryEmailByPage"
    ]),
    //查询邮件分类
    querySimpList() {
      this.API.simpList().then(res => {
        if (res.code === 0) {
          this.simpList = [...res.data];
        }
      });
    },
    // 同步邮件
    synchronous() {
      this.$loading({ text: "邮件同步中", background: "rgba(0, 0, 0, 0.8)" });
      this.syncMail()
        .then(res => {
          if (res.code === 0) {
            this.$loading().close();
            this.$message.success("同步邮件成功");
            setTimeout(() => {
              window.location.reload();
            }, 600);
          } else {
            this.$loading().close();
          }
        })
        .catch(() => {
          this.$loading().close();
          setTimeout(() => {
            this.$message.error("网络故障,请重新操作");
          }, 200);
        });
    },
    handlerEmail(type) {
      if (!this.selectList.length) {
        this.$message.warning("请选择邮件");
        return;
      }
      const msg = {
        syncMail: "同步邮件成功",
        markRead: "标记已读成功",
        markUnRead: "标记未读成功",
        markReplyOnPlatform: "标记已在平台回复成功",
        moveEmailItem: "移动邮件成功"
      };

      let data = type == "moveEmailItem" ? this.targetItemId : "";
      this[type](data).then(res => {
        if (res.code === 0) {
          this.setMultipleSelection([]);
          this.queryEmailByPage({ pageNum: 1 })
          this.$message.success(msg[type]);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
/*右侧头部样式*/
.emailHead {
  width: calc(100% - 200px);
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  .classify {
    margin-left: 10px;
    /deep/.el-input--small .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
  }
}
/*右侧头部样式*/
</style>