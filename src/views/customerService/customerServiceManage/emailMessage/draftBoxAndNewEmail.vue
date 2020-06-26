<template>
  <section
    class="emailContent"
    :class="{'setContent':isSelectEmail,'newEmail':emailType=='newEmail'}"
  >
    <!-- 顶部面包屑 -->
    <crumbs
      :list="crumbList"
      :showReturn="true"
      :showRefresh="false"
      v-if="emailType=='newEmail'"
      :goBack="goBack"
    ></crumbs>
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      emailType
      }"></unselectEmail>
    <div class="head" v-if="emailType=='newEmail'">
      <div class="label">新邮件</div>
    </div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
      style="padding: 20px 50px;"
      label-position="left"
      :rules="rules"
      v-if="emailType=='newEmail'||isSelectEmail"
      :class="{'newEmailTable':emailType=='newEmail'}"
    >
      <el-form-item class="el-form-item__btn">
        <el-button @click="submitForm('ruleForm','sendMail')" v-if="roleCtl.mail_sendMail">发送</el-button>
        <el-button @click="submitForm('ruleForm','saveDraft')" v-if="roleCtl.mail_sendMail">存草稿</el-button>
        <el-button
          @click="deleteDraft('single')"
          v-if="emailType=='draftBox'&&roleCtl.mail_sendMail"
        >删除</el-button>
        <el-button @click="close" v-if="emailType=='draftBox'">关闭</el-button>
      </el-form-item>
      <el-form-item label="发件人:" prop="fromAddr">
        <el-input v-model="ruleForm.fromAddr" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收件人:" prop="toAddr">
        <el-input v-model="ruleForm.toAddr" placeholder="输入多个收件人地址，多个收件人请用';'隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="抄送:" prop="ccAddr">
        <el-input v-model="ruleForm.ccAddr" placeholder="输入多个收件人地址，多个收件人请用';'隔开" clearable></el-input>
      </el-form-item>
      <el-form-item label="主题:" prop="subject">
        <el-input v-model="ruleForm.subject" placeholder="输入邮件主题" clearable></el-input>
      </el-form-item>
      <el-form-item label="正文:" prop="html" class="upload" v-if="roleCtl.mail_sendMail">
        <el-upload
          class="upload-demo"
          action="/erp/file/upload"
          :headers="{'x-token': token}"
          :before-upload="beforeUpload"
          :on-remove="onRemove"
          :on-progress="uploadProgress"
          :on-error="() => {this.$message.error('上传失败')}"
          :on-success="onSuccess"
          accept="pdf, doc, docx, xls, xlsx, jpg, gif, png, jpeg, txt"
          :show-file-list="true"
          :file-list="fileList"
        >
          <el-button size="small" class="el-icon-upload">上传附件</el-button>
        </el-upload>

        <selectTemplate @handleChange="handleChange"  :key="isResouceShow"></selectTemplate>
        <p class="txt" v-if="ruleForm&&ruleForm.html">{{ruleForm.html.length}}/{{maxlen}}</p>
      </el-form-item>
      <el-form-item v-if="roleCtl.mail_sendMail">
        <el-input
          v-model="ruleForm.html"
          :maxlength="maxlen"
          rows="16"
          id="txt"
          placeholder="请输入邮件正文"
          type="textarea"
          @blur="handleInputBlur($event)"
        ></el-input>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
import unselectEmail from "./unselectEmail";
import selectTemplate from "../components/selectTemplate";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "draftBoxAndNewEmail",
  components: {
    unselectEmail,
    selectTemplate
  },
  data() {
    let validateEmail = (rule, value, callback) => {
      if (value) {
        let list = value.replace(/；/, ";").split(";");
        if (list[list.length - 1] === "") {
          list.splice(list.length - 1, 1);
        }
        if (list.length > 10) {
          callback(new Error(`最多输入10个邮箱!`));
        }
        callback();
      } else {
        callback();
      }
    };
    return {
      roleCtl: this.$store.state.role.roleCtl,
      crumbList: [
        {
          // 面包屑
          name: "客服中心",
          path: "/F1001/F100101"
        },
        {
          name: "邮件消息",
          path: "/F1001/F100101"
        },
        {
          name: "新邮件",
          path: ""
        }
      ],
      token: localStorage.getItem("token"),
      maxlen: 4000,
      template: "",
      rules: {
        toAddr: [{ validator: validateEmail, trigger: "blur" }],
        ccAddr: [{ validator: validateEmail, trigger: "blur" }]
      },
      fileList: [],
      ruleForm: {
        boxId: this.$store.state.email.emailBoxData.boxId, //邮箱id
        subject: "", //主题
        fromAddr: this.$store.state.email.emailBoxData.emailUsername, //当前邮箱
        toAddr: "", // 发送人，以;分割
        ccAddr: "", // 抄送人，以;分割
        html: "", // 文本html
        draftId: "", // 草稿箱id,如果不为空，说明是编辑草稿
        attachList: [],
        complaintLevelTwoId: "",
        complaintLevelOneId: "",
        templateId: ""
      },
      allFileSize: 0,
      blurEndIndex: undefined,
      blurStartIndex: undefined,
      isResouceShow:0
    };
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage["emailType"]) {
      let data = JSON.parse(sessionStorage["emailBoxData"]);
      this.ruleForm.boxId = data.boxId;
      this.ruleForm.fromAddr = data.emailUsername;
      this.setEmailType(sessionStorage["emailType"]);
      this.setLastOperation(JSON.parse(sessionStorage["lastOperation"]));
      this.setEmailBoxData(data);
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    if (this.emailType === "newEmail") {
      window.addEventListener("beforeunload", this.setSession());
    }
  },
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData,
      lastOperation: state => state.lastOperation
    })
  },
  watch: {},
  methods: {
    ...mapMutations("email", [
      "setIsSelectEmail",
      "setEmailType",
      "setActiveMenu",
      "setLastOperation",
      "setEmailBoxData"
    ]),
    ...mapActions("email", ["queryDraftEmailByPage"]),
    // 清空sessionstorage
    clearSessionStorage() {
      sessionStorage.clear();
    },
    setSession() {
      window.sessionStorage["lastOperation"] = JSON.stringify(
        this.lastOperation
      );
      window.sessionStorage["emailBoxData"] = JSON.stringify(this.emailBoxData);
      window.sessionStorage["emailType"] = this.emailType;
    },
    // 返回上一页
    goBack() {
      history.go(-1);
      this.setActiveMenu(this.lastOperation.operate);
      this.setEmailType(this.lastOperation.operate);
      this.clearSessionStorage();
    },
    // 失去焦点时保存光标位置
    handleInputBlur(e) {
      this.blurStartIndex = e.srcElement.selectionStart;
      this.blurEndIndex = e.srcElement.selectionEnd;
    },
    // 在失去焦点时光标位置追加内容
    insertTxt(val) {
      const txt = document.getElementById("txt");
      if (typeof this.blurStartIndex === "number") {
        this.ruleForm.html =
          txt.value.substring(0, this.blurStartIndex) +
          val +
          txt.value.substring(this.blurEndIndex);
        this.$nextTick();
        txt.focus();
        txt.setSelectionRange(
          this.blurStartIndex + val.length,
          this.blurStartIndex + val.length
        );
      } else {
        this.ruleForm.html += val;
      }
    },
    handleChange(data) {
      let str = this.replacePlaceholder(data.templateContent);
      this.ruleForm.complaintLevelOneId = data.complaintLevelOneId;
      this.ruleForm.complaintLevelTwoId = data.complaintLevelTwoId;
      this.ruleForm.templateId = data.id;

      this.insertTxt(str || "");
    },
    replacePlaceholder(str) {
      return str
        .replace(
          new RegExp(`\\{{买家昵称\\}}`, "g"),
          "买家昵称"
        )
        .replace(
          new RegExp(`\\{{店铺名称\\}}`, "g"),
          this.emailBoxData.shopName || "店铺名称"
        )
        .replace(new RegExp(`\\{{订单编号\\}}`, "g"), "订单编号")
        .replace(new RegExp(`\\{{亚马逊商品编号\\}}`, "g"), "亚马逊商品编号");
    },
    //查询草稿箱邮件详情
    queryDraftEmailById(id) {
      this.initData();
      ++this.isResouceShow;
      this.API.queryDraftEmailById(id).then(res => {
        if (res.code === 0 && res.data) {
          if (res.data.attachList) {
            res.data.attachList.forEach(item => {
              this.fileList.push({
                name: item.fileName,
                url: item.originUrl,
                fileSize: item.fileSize ? item.fileSize : 0
              });
            });
          res.data.attachList = [];
          }
          res.data.html = res.data.text ? res.data.text : "";
          this.ruleForm = Object.assign(this.ruleForm, res.data);
          this.ruleForm.draftId = this.ruleForm.id;
          delete this.ruleForm.text;
          delete this.ruleForm.id;
          this.setIsSelectEmail(true);
        }
      });
    },

    // 上传
    beforeUpload(file) {
      const typeList = [
        "pdf",
        "docx",
        "doc",
        "xls",
        "xlsx",
        "jpg",
        "gif",
        "png",
        "jpeg",
        "txt"
      ];
      const type = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isCorrectTpye = typeList.includes(type);
      if (!isCorrectTpye) {
        this.$message({
          message:
            "上传文件只能是 pdf,doc,docx,xls,xlsx,jpg,gif,png,jpeg,txt格式!",
          type: "warning"
        });
      }
      this.allFileSize += isCorrectTpye ? file.size / 1024 / 1024 : 0;
      const isLt10M = this.allFileSize < 10;
      if (!isLt10M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "warning"
        });
      }
      return isCorrectTpye && isLt10M;
    },
    uploadProgress(event, file, fileList) {},
    // 上传成功
    onSuccess(response) {
      console.log(response)
      if (response.code === 0) {
        setTimeout(() => {
          this.fileList.push({
            name: response.data.fileName,
            url: response.data.originUrl,
            fileSize: response.data.fileSize
          });

        }, 800);
      }
    },
    // 删除
    onRemove(file, fileList) {
      this.fileList = fileList;
    },
    submitForm(formName, type) {
      if (type == "sendMail" && !this.ruleForm.toAddr) {
        this.$message.warning("请输入收件人");
        return;
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postData(type);
        } else {
          return false;
        }
      });
    },
    // 处理数据
    handleData(type) {
      const ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
      ruleForm.html = `<html>${ruleForm.html}</html>`;

      this.fileList.forEach(item => {
        ruleForm.attachList.push({
          originUrl: item.url,
          fileName: item.name,
          fileSize: item.fileSize
        });
      });
      let data = {
        boxId: ruleForm.boxId,
        subject: ruleForm.subject,
        fromAddr: ruleForm.fromAddr,
        toAddr: ruleForm.toAddr,
        ccAddr: ruleForm.ccAddr,
        html: ruleForm.html,
        attachList: ruleForm.attachList
      };
      if (this.emailType == "draftBox") {
        if (type == "saveDraft") {
          data.id = ruleForm.draftId;
        } else {
          data.draftId = ruleForm.draftId;
        }
      }
      if ( typeof ruleForm.templateId == "number") {
         data.templateId = ruleForm.templateId;
        if (type == "saveDraft") {
           data.complaintLevelOneId = ruleForm.complaintLevelOneId;
          data.complaintLevelTwoId = ruleForm.complaintLevelTwoId;
        } else {
            data.bocomplaintLevelOneIdxId = ruleForm.complaintLevelOneId;
          data.bocomplaintLevelTwoIdxId = ruleForm.complaintLevelTwoId;
        }
      }

      return data;
    },
    // 发送 草稿箱id,如果不为空，说明是在草稿箱那里发送的
    postData(type) {
      let data = this.handleData(type);
      this.$loading({
        text: `${type == "sendMail" ? "发送中..." : "存储草稿中..."}`,
        background: "rgba(0, 0, 0, 0.8)"
      });
      this.API[type](data)
        .then(res => {
          if (res.code === 0) {
            this.$loading().close();
            setTimeout(() => {
              this.$message.success(
                `${type == "sendMail" ? "发送成功" : "存储草稿成功"}`
              );
            }, 200);

            if (this.emailType == "newEmail") {
              this.$router.go(-1);
              this.setActiveMenu(this.lastOperation.operate);
              this.setEmailType(this.lastOperation.operate);
              this.clearSessionStorage();
            } else {
              this.close();
              this.queryDraftEmailByPage();
            }
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
    initData() {
      this.allFileSize = 0;
      this.fileList = [];
      this.ruleForm = {
        boxId: this.emailBoxData.boxId,
        subject: "",
        fromAddr:this.emailBoxData.emailUsername,
        toAddr: "",
        ccAddr: "",
        html: "",
        draftId: "",
        attachList: [],
        complaintLevelTwoId: "",
        complaintLevelOneId: "",
        templateId:""
      };
    },
    // 删除草稿
    deleteDraft(type) {
      this.allFileSize = 0;
      this.$emit("deleteDraft", { id: this.ruleForm.draftId, type });
    },
    // 关闭当前草稿
    close() {
      this.allFileSize = 0;
      this.setIsSelectEmail(false);
    },
    destroyed() {
      window.removeEventListener("beforeunload", this.setSession());
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.emailContent {
  position: absolute;
  left: 500px;
  width: calc(100% - 500px);
  height: calc(100%);
  background: #f6f7f9;
  color: #ccc;
  padding: 0;
  transition: 0.3s;
  .head {
    display: flex;
    justify-content: space-between;
    height: 50px;
    background-color: #f3f3f3;
    box-sizing: border-box;
    padding: 9px 50px;
    margin: 20px 50px 0;
    border: 1px solid #e4e4e4;
    div {
      display: inline-block;
      line-height: 32px;
      &.label {
        color: #666;
      }
      &.new {
        font-size: 14px;
        background-color: @themeColor;
        color: white;
        width: 100px;
        cursor: pointer;
        text-align: center;
        border-radius: 4px;
      }
    }
  }
  .el-form-item__btn {
    /deep/.el-form-item__content {
      margin-left: 0 !important;
    }
    button {
      width: 80px;
      height: 30px;
      &:nth-child(1) {
        color: #fff;
        background: @themeColor;
      }
    }
  }
}

/deep/.el-form-item__content {
  position: relative;
  /deep/.el-cascader {
    position: absolute;
    left: 100px;
    top: 0;
    margin-right: auto;
    margin-left: 10px;
  }
  .txt {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    text-align: end;
    line-height: 33px;
    color: rgb(153, 153, 153);
  }
  /deep/.el-upload-list {
    display: -ms-flexbox;
    -ms-flex-direction: row;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    /deep/.el-upload-list__item {
      height: 18px;
      font-size: 12px;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-direction: row;
      flex-direction: row;
      margin: 8px 10px 0 0;
      width: 160px;
      transition: none !important;
      /deep/.el-upload-list__item-name {
        line-height: 18px;
        padding: 0;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
      }
      /deep/.el-upload-list__item-status-label {
        position: relative;
      }
      /deep/.el-icon-close {
        position: relative;
      }
    }
  }
  /deep/.el-textarea__inner {
    resize: none;
  }
}
.setContent {
  top: 0;
  height: calc(100%);
  background: #fff;
  transition: 0.3s;
}
.newEmail {
  position: unset;
}
.newEmailTable {
  margin: 0px 50px 50px !important;
  padding: 20px 50px 0 !important;
  width: unset !important;
  border: 1px solid #e4e4e4;
  border-top: none;
  background: #fff;
  height: calc(100% - 170px);
}
</style>