<template>
  <section>
    <!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false" :showRefresh="true"></crumbs>
    <el-container class="container">
      <email-aside ref="emailAside"></email-aside>
      <email-head ref="emailHead"></email-head>
      <email-list @openDetails="openDetails" ref="emailList"></email-list>
      <!-- 草稿箱 新邮件 -->
      <email-main-body
        :isSelectEmail="isSelectEmail"
        ref="emailMainBody"
        @deleteDraft="deleteDraft"
        v-if="emailType.includes('newEmail')||emailType.includes('draftBox')"
      ></email-main-body>
      <!-- 禁链接回复 -->
      <email-main-reply 
      ref="forbiddenReply" 
      v-if="emailType.includes('notice')||emailType.includes('amazon')"></email-main-reply>
      <!-- 站内信 -->
      <stand-inside-letter 
      ref="standInsideLetter" 
      v-if="emailType.includes('standInsideLetter')||emailType.includes('buyers')" 
      ></stand-inside-letter>
      <!-- 非对话框形式 -->
      <notStandInsideLetter
      ref="notStandInsideLetter" 
      v-if="emailType.includes('other')" 
      ></notStandInsideLetter>
    </el-container>
  </section>
</template>


<script>
import emailAside from "./emailAside";
import emailList from "./emailList";
import emailHead from "./emailHead";
import emailMainBody from "./emailMainBody";
import emailMainReply from "./emailMainReply";
import standInsideLetter from "./standInsideLetter";
import notStandInsideLetter from "./notStandInsideLetter";
import { mapMutations, mapState } from "vuex";
export default {
  name: "emailMessage",
  components: {
    emailAside,
    emailList,
    emailHead,
    emailMainBody,
    emailMainReply,
    standInsideLetter,
    notStandInsideLetter
  },
  data() {
    return {
      crumbList: [
        {
          // 面包屑
          name: "客服中心",
          path: "/F1001/F100101"
        },
        {
          name: "邮件消息",
          path: ""
        }
      ]
    };
  },
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail
    })
  },
  methods: {
    ...mapMutations("email", ["setIsSelectEmail"]),
    openDetails(val) {
      if (this.emailType == "draftBox") {
        // 草稿
        this.$refs["emailMainBody"].queryDraftEmailById(val);
      } else if (this.emailType.includes("other")) {
        //其他邮件（对应原型上的其它邮件，就是可以回复的，邮件展示方法为普通展示的）非对话框形式
        this.$refs["notStandInsideLetter"].queryEmailDetails(val);
      } else if (
        this.emailType.includes("standInsideLetter") ||
        this.emailType.includes("buyers")
      ) {
        //买家邮件&站内信（对应原型上的对话框模式）
        this.$refs["standInsideLetter"].queryChatRoom(val);
      } else if (
        this.emailType.includes("notice") ||
        this.emailType.includes("amazon")
      ) {
        //通知类邮件（包含Q&A，还有亚马逊邮件）都是禁止回复的
        this.$refs["forbiddenReply"].queryEmailDetails(val);
      }
    },
    deleteDraft(obj) {
      this.$refs["emailList"].batchDel(obj);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  margin: 20px 50px 0;
  box-sizing: border-box;
  height: 800px;
  border: 1px solid #e4e4e4;
}
</style>

<style >
.bd_bt_1 {
  border-bottom: solid 1px #e4e4e4;
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
}
</style>