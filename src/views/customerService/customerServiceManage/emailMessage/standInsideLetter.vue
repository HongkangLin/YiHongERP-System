<template>
  <section class="emailContent" :class="{'setContent':isSelectEmail}">
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      }"></unselectEmail>
    <el-container v-if="isSelectEmail" style="height:100%">
      <el-container class="left" v-if="emailInfoList!=null&&emailInfoList.length">
        <el-header>
          <p class="infotitle">
            <span class="name" :class="{'resetName':otherAlias}">{{otherAlias}}</span>
            <span class="formAddr hideTxt">{{otherAddr}}</span>
          </p>
          <p
            class="subjectName hideTxt"
            v-if="emailInfoList[0].subjectName"
          >{{emailInfoList[0].subjectName}}</p>
        </el-header>
        <el-main
          style="border-bottom: 1px solid #e4e4e4;padding: 10px; transform: scale(1,1); "
          :style="resetCss"
          ref="main"
        >
          <div
            class="loadMore"
            @click="loadMore"
            v-if="emailInfoList.length<copyData.length"
          >{{loadingTxt}}</div>
          <div class="chatRoom setScrollbar">
            <div
              class="chatItem"
              :class="{itemRight:item.side=='right'}"
              v-for="(item,index) in emailInfoList"
              :key="index"
            >
              <span class="sentDate">{{item.sentDate}}</span>
              <div class="chatContent">
                <div
                  v-html="item.type==2?item.str:item.contentText"
                  class="chatTxt"
                  :ref="'txt_'+index"
                ></div>
                <div
                  v-if="item.contentText.length>300"
                  @click="toggle(item,index)"
                  class="toggle"
                  :ref="'toggle_'+index"
                >展开显示更多</div>
              </div>
              <div v-if="item.attachList.length" class="attachList">
                <i class="el-icon-paperclip"></i>
                <span>{{parseStr(item.attachList)}}</span>
                <img
                  class="download"
                  @click="downloadAll(item.attachList)"
                  src="../../../../assets/image/svg/download.svg"
                />
              </div>
            </div>
          </div>
        </el-main>
        <el-footer style="height:140px;padding: 0 10px 10px;" v-if="roleCtl.mail_sendMail">
          <div style="position:relative">
            <selectTemplate @handleChange="handleChange" style="margin-top:8px" :key="isResouceShow"></selectTemplate>
            <p class="txt">{{reply.length}}/{{maxlen}}</p>

            <el-input
              type="textarea"
              :rows="textareaRow"
              placeholder="请将你的回复限制在4000字符以内"
              :maxlength="maxlen"
              v-model="reply"
              id="txt"
              @blur="handleInputBlur($event)"
            ></el-input>
            <div class="email-operate">
              <el-upload
                class="upload-demo"
                action="/erp/file/upload"
                :headers="{'x-token': token}"
                :before-upload="beforeUpload"
                :on-remove="onRemove"
                :on-error="() => {this.$message.error('上传失败')}"
                :on-success="onSuccess"
                accept="pdf, doc, docx, xls, xlsx, jpg, gif, png, jpeg, txt"
                :file-list="attachList"
              >
                <el-button size="small" class="el-icon-upload">上传附件</el-button>
              </el-upload>
              <div class="btn">
                <el-button
                  size="small"
                  @click="markUnRead"
                  v-if='emailType.includes("all")||emailType.includes("needReply")'
                >标记未读</el-button>
                <el-button
                  size="small"
                  @click="markReplyOnPlatform"
                  v-if='emailType.includes("standInsideLetter")&&!emailType.includes("replied")'
                >已在平台回复</el-button>
                <el-button
                  size="small"
                  @click="replyInsideMail"
                  :disabled="reply.length==0"
                  :class="reply.length==0?'disable':'able'"
                >发送</el-button>
              </div>
            </div>
          </div>
        </el-footer>
      </el-container>
      <el-aside width="240px" class="right"  v-if="emailInfoList!=null&&emailInfoList.length">
        <div class="title">订单信息</div>
        <el-form label-position="top" label-width="80px" :model="formData">
          <el-form-item label="ASIN" class="asin">
            <div @click="jump('asin')" style="color: #3bb19c;height: 32px;">{{formData.asin}}</div>
            <img src="../../../../assets/image/svg/pen.svg" @click="openPrompt('asin')" />
          </el-form-item>
          <el-form-item label="订单号" class="orderNo">
            <div @click="jump('orderNo')" style="color: #3bb19c;height: 32px;">{{formData.orderNo}}</div>
            <img src="../../../../assets/image/svg/pen.svg" @click="openPrompt('orderNo')" />
          </el-form-item>
          <el-form-item label="下单时间">
            <div>{{formData.orderTime||'--'}}</div>
          </el-form-item>
          <el-form-item label="发货时间">
            <div>{{formData.deliveryTime||'--'}}</div>
          </el-form-item>
          <el-form-item label="收货时间">
            <div>{{formData.receiveTime||'--'}}</div>
          </el-form-item>
          <el-form-item label="产品" class="productDesc">
            <div>{{formData.productDesc||'--'}}</div>
            <img
              src="../../../../assets/image/svg/pen.svg"
              @click="openPrompt('productDesc')"
              :class="{'productImg':formData.productDesc}"
            />
          </el-form-item>
          <el-form-item label="数量">
            <div>{{formData.amount||'--'}}</div>
          </el-form-item>
          <el-form-item label="客服备注">
            <el-input
              v-model="formData.customerBak"
              type="textarea"
              maxlength="200"
              :rows="6"
              @blur="saveEmailOrder()"
              placeholder="请输入200字以内备注"
              style="resize:none"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-aside>
    </el-container>
  </section>
</template>
<script>
import unselectEmail from "./unselectEmail";
import { mapMutations, mapState, mapActions } from "vuex";
import { downloadFile, getCurrentDate } from "@/lib/utils/common";
import selectTemplate from "../components/selectTemplate";
export default {
  components: {
    unselectEmail,
    selectTemplate
  },
  name: "standInsideLetter",
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      token: localStorage.getItem("token"),
      reply: "",
      maxlen: 4000,
      formData: {
        id: "",
        messageId: "",
        asin: "",
        orderNo: "",
        orderTime: "",
        deliveryTime: "",
        receiveTime: "",
        productDesc: "",
        customerBak: "",
        amount: ""
      },
      emailInfoList: [], //展示的数据
      copyData: [], // 原数据
      complaintLevelOneId: "",
      complaintLevelTwoId: "",
      templateId:"",
      attachList: [],
      replyMessageId: "",
      originalId: "",
      messageId: "",
      allFileSize: 0,
      size: 4, // 默认显示4条, 加载更多增加4条
      i: 1,
      loading: false,
      otherAlias: "",
      otherAddr: "",
      isResouceShow:0
    };
  },
  created() {},
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData,
      curReply: state => state.curReply
    }),
    loadingTxt() {
      return this.loading ? "加载中..." : "加载更多";
    },
    textareaRow() {
      return this.reply ? 10 : 1;
    },
    resetCss() {
      let h;
      if (this.reply && !this.attachList.length) {
        h = "height:calc(100% - 210px - 171px);flex: initial;";
      } else if (this.attachList.length && !this.reply) {
        h = "height:calc(100% - 210px - 52px);flex: initial;";
      } else if (this.reply && this.attachList.length) {
        h = "height:calc(100% - 210px - 171px - 52px);flex: initial;";
      } else {
        h = "";
      }
      return h;
    }
  },
  watch: {},
  methods: {
    ...mapMutations("email", [
      "setIsSelectEmail",
      "setMultipleSelection",
      "openDetailResetAsideNum"
    ]),
    ...mapActions("email", ["queryEmailByPage", "queryItemList"]),
    queryChatRoom(messageId) {
      this.initData();
      ++this.isResouceShow;
      this.messageId = messageId;
      this.API.queryChatRoom(messageId).then(res => {
        if (res.code === 0) {
          res.data.emailList.forEach(item => {
            let contentText = item.contentText == null ? "" : item.contentText;
            item.contentText  = contentText.replace(/^\s+|\s+$/g,"")
            if (item.contentText && item.contentText.length > 300) {
              item.str = item.contentText.substr(0, 300);
              item.str1 = item.contentText.substr(300);
              item.type = 2; // 长度大于300
            } else {
              item.type = 1; // 全部
            }
          });
          this.replyMessageId =
            res.data.emailList[res.data.emailList.length - 1].messageId;
          this.originalId = res.data.emailList[0].messageId;
          this.otherAddr = res.data.emailList[0].fromAddr; // 收件人邮箱
          this.otherAlias = res.data.emailList[0].fromAlias; // 收件人别名
          this.copyData = [...res.data.emailList];
          if (this.i * this.size > this.copyData.length) {
            this.emailInfoList.unshift(
              ...this.copyData.slice(0, this.copyData.length)
            );
          } else {
            this.emailInfoList.unshift(
              ...this.copyData.slice(
                this.copyData.length - this.i * this.size,
                this.copyData.length
              )
            );
            this.i++;
          }
          this.formData = Object.assign(this.formData, res.data.order);
          this.setIsSelectEmail(true);
        }
        // console.log(this.formData);
      }).catch(()=>{
        this.$message.error('网络故障!')
      });
    },
    initData() {
      this.formData = {
        id: "",
        messageId: "",
        asin: "",
        orderNo: "",
        orderTime: "",
        deliveryTime: "",
        receiveTime: "",
        productDesc: "",
        customerBak: "",
        amount: ""
      };
      this.emailInfoList = []; //展示的数据
      this.copyData = []; // 原数据
      this.reply = "";
      this.complaintLevelOneId = "";
      this.complaintLevelTwoId = "";
      this.templateId = "",
      this.attachList = [];
      this.allFileSize = 0;
      this.i = 1;
      this.loading = false;
    },
    toggle(item, index) {
      this.$nextTick(() => {
        // 2长度大于300 1全部
        if (item.type == 2) {
          item.type = 1;
          this.$refs[`toggle_${index}`][0].innerText = "收起";
        } else {
          item.type = 2;
          this.$refs[`toggle_${index}`][0].innerText = "展开显示更多";
        }
      });
    },
    downloadAll(list) {
      for (let i = 0; i < list.length; i++) {
        downloadFile(list[i].url, list[i].fileName);
      }
    },
    parseStr(item) {
      let arr = [];
      item.map(list => {
        arr.push(list.fileName);
      });
      return arr.join(",");
    },
    loadMore() {
      this.loading = true;
      this.$nextTick(() => {
        if (this.i * this.size > this.copyData.length) {
          setTimeout(() => {
            this.emailInfoList.unshift(
              ...this.copyData.slice(
                0,
                this.copyData.length - this.size * (this.i - 1)
              )
            );
            this.loading = false;
          }, 600);
        } else {
          setTimeout(() => {
            this.emailInfoList.unshift(
              ...this.copyData.slice(
                this.copyData.length - this.i * this.size,
                this.copyData.length - this.size * (this.i - 1)
              )
            );
            this.i++;
            this.loading = false;
          }, 600);
        }
      });
    },
    markUnRead() {
      this.API.markUnRead({
        idList: [this.curReply.uid],
        boxId: this.emailBoxData.boxId
      }).then(res => {
        if (res.code === 0) {
          this.cb();
          this.$message.success("标记未读成功");
        }
      });
    },
    markReplyOnPlatform() {
      this.API.markReplyOnPlatform({
        idList: [this.curReply.uid],
        boxId: this.emailBoxData.boxId
      }).then(res => {
        if (res.code === 0) {
          this.cb();
          this.$message.success("标记已在平台回复成功");
        }
      });
    },
    cb() {
      this.setMultipleSelection([]);
      this.setIsSelectEmail(false);
      this.queryItemList();
    },
    openPrompt(type) {
      this.$prompt("请输入", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator(value) {
          if (value) {
            return true;
          } else {
            return false;
          }
        },
        inputErrorMessage: "请输入内容"
      })
        .then(({ value }) => {
          this.formData = Object.assign(this.formData, { [type]: value });
          this.saveEmailOrder();
        })
        .catch(() => {});
    },
    saveEmailOrder() {
      let data = { ...this.formData };
      data.messageId = this.messageId;
      this.API.saveEmailOrder(data).then(res => {
        if(res.code==0&&res.data!=null){
          this.formData.id = res.data
        }
      });
    },
    jump(type) {
      if (this.formData[type] == "" || this.formData[type] == "--") return;
      let jumpRule = {
        asin: `https://www.amazon.com/dp/${this.formData[type]}`,
        orderNo: `https://sellercentral.amazon.com/orders-v3/order/${this.formData[type]}`
      };
      window.open(`${jumpRule[type]}`);
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
    // 上传成功
    onSuccess(response) {
      if (response.code === 0) {
        this.attachList.push({
          name: response.data.fileName,
          url: response.data.originUrl,
          fileSize: response.data.fileSize
        });
      }
    },
    // 删除
    onRemove(file, fileList) {
      this.attachList = fileList;
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
        this.reply =
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
        this.reply += val;
      }
    },
    handleChange(data) {
      let str = this.replacePlaceholder(data.templateContent);
      this.complaintLevelOneId = data.complaintLevelOneId;
      this.complaintLevelTwoId = data.complaintLevelTwoId;
      this.templateId = data.id;
      this.insertTxt(str || "");
    },
    replacePlaceholder(str) {
      return str
        .replace(
          new RegExp(`\\{{买家昵称\\}}`, "g"),
          this.otherAlias||this.otherAddr|| ""
        )
        .replace(
          new RegExp(`\\{{店铺名称\\}}`, "g"),
          this.emailBoxData.shopName || ""
        )
        .replace(
          new RegExp(`\\{{订单编号\\}}`, "g"),
          this.formData.orderNo || "订单编号"
        )
        .replace(
          new RegExp(`\\{{亚马逊商品编号\\}}`, "g"),
          this.formData.asin || "亚马逊商品编号"
        );
    },
    replyInsideMail() {
      let data = {
        originalId: this.originalId,
        replyMessageId: this.replyMessageId,
        bocomplaintLevelOneIdxId: this.complaintLevelOneId,
        bocomplaintLevelTwoIdxId: this.complaintLevelTwoId,
        templateId:this.templateId,
        boxId: this.emailBoxData.boxId,
        subject: this.emailInfoList[0].subjectName,
        fromAddr: this.emailBoxData.emailUsername,
        toAddr: this.otherAddr,
        html: `<html>${this.reply}</html>`
      };
      let attachList = [];
      this.attachList.forEach(item => {
        attachList.push({
          originUrl: item.url,
          fileName: item.name,
          fileSize: item.fileSize
        });
      });
      data.attachList = attachList;

      this.$loading({ text: "发送中...", background: "rgba(0, 0, 0, 0.8)" });
      this.API.replyInsideMail(data)
        .then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            // 回复成功改变侧边啦数字
            if (
              this.curReply.messageId == this.messageId &&
              this.curReply.replyFlag == 0
            ) {
              this.openDetailResetAsideNum({ type: "needReply" });
            }
          }
          this.$loading().close();
          this.queryChatRoom(this.originalId);
        })
        .catch(() => {
          this.$loading().close();
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.emailContent {
  position: absolute;
  top: 60px;
  background: #f6f7f9;
  color: #ccc;
  transition: 0.3s;
  left: 500px;
  width: calc(100% - 500px);
  height: calc(100% - 60px);
  .main {
    display: flex;
  }
  .left {
    font-style: normal;
    font-size: 12px;
    color: #666;
    border-right: 1px solid #e4e4e4;
    width: calc(100% - 240px);
    .el-header {
      border-bottom: 1px solid #e4e4e4;
      padding: 5px 10px;
      font-weight: 650;
      height: auto !important;
      .infotitle {
        display: flex;
        height: 24px;
        line-height: 24px;
        span:nth-child(1) {
          font-size: 16px;
          color: #000;
          min-width: fit-content;
        }
        span:nth-child(2) {
          color: #999999;
        }
        .resetName {
          margin-right: 10px;
        }
      }
      .subjectName {
        color: #999999;
        height: 24px;
        line-height: 24px;
      }
    }
    .el-footer {
      height: 150px;
      .upload-demo {
        display: inline-block;
        margin-right: 10px;
      }

      .email-operate {
        height: 48px;
        padding-right: 10px;
        background-color: #fafafa;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        /deep/.el-icon-upload {
          color: rgba(59, 177, 156, 1);
        }
        .disable {
          background: #fff;
          color: #999;
        }
        .able {
          background: @themeColor;
          color: #fff;
        }
      }

      .el-textarea {
        margin: 10px 0;
        /deep/.el-textarea__inner {
          resize: none;
          min-height: 30px;
        }
      }
      /deep/.el-upload-list {
        position: absolute;
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
    }
    .loadMore {
      position: fixed;
      transform: translateX(-50%);
      left: 50%;
      background: #fff;
      z-index: 9;
      font-family: "PingFangSC-Regular", "PingFang SC";
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #3bb19c;
      width: 100%;
      text-align: center;
      cursor: pointer;
    }
    .chatRoom {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
      .chatItem {
        width: 45%;
        line-height: 18px;
        margin: 15px 0;
        .sentDate {
          font-weight: 650;
          font-style: normal;
          font-size: 12px;
          color: #999999;
          height: 24px;
          line-height: 24px;
          display: inline-block;
        }
        .chatContent {
          border: 1px solid #e4e4e4;
          border-radius: 4px;
          background: #f8f8f8;
          .chatTxt {
            transition: 0.3s;
            white-space: pre-wrap;
            padding: 8px;
            line-height: 16px;
            word-wrap: break-word;
            word-break: break-word;
          }
          .toggle {
            text-align: center;
            border-top: 1px solid #e4e4e4;
            height: 22px;
            line-height: 22px;
            cursor: pointer;
          }
        }
        .attachList {
          max-width: 50%;
          position: relative;
          background: #e4e4e4;
          height: 20px;
          line-height: 20px;
          margin-top: 10px;
          position: relative;
          i {
            width: 16px;
            height: 16px;
            position: absolute;
            text-align: center;
            top: 6px;
          }
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            width: calc(100% - 16px);
            padding-left: 16px;
          }
          .download {
            width: 10%;
            text-align: center;
            width: 16px;
            height: 16px;
            top: 2px;
            position: absolute;
            color: @themeColor;
          }
        }
      }
      .itemRight {
        align-self: flex-end;
      }
    }

    .txt {
      position: absolute;
      top: 28px;
      right: 0;
      color: #999;
    }
  }
  .right {
    font-size: 14px;

    padding: 8px;
    /deep/.el-form {
      width: 220px;
      .title {
        color: rgba(102, 102, 102, 0.647058823529412);
      }
      /deep/.el-form-item {
        margin-bottom: 0;

        /deep/.el-form-item__label {
          padding: 0;
          line-height: 26px;
          font-weight: 650;
          color: #666666;
        }
        // /deep/.el-form-item__content{
        //   height: 32px;
        // }
        /deep/.el-input__inner {
          color: #3bb19c;
          border: none;
          outline: none;
          padding: 0;
        }
      }

      .asin,
      .orderNo {
        .el-form-item__content {
          display: flex;
          cursor: pointer;
          div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &:hover {
            img {
              display: inline-block;
            }
          }

          img {
            display: none;
            width: 16px;
            height: 32px;
          }
        }
      }
      .productDesc {
        .el-form-item__content {
          display: flex;
          cursor: pointer;
          div {
            font-family: "PingFangHK-Semibold", "PingFang HK Semibold",
              "PingFang HK";
            font-weight: 650;
            font-style: normal;
            font-size: 12px;
            line-height: 20px;
            color: #3bb19c;
            text-align: left;
          }
          &:hover {
            img {
              display: inline-block;
            }
          }
          .productImg {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
          img {
            display: none;
            width: 16px;
            height: 18px;
          }
        }
      }
    }
  }
}
.setContent {
  background: #fff;
}
</style>