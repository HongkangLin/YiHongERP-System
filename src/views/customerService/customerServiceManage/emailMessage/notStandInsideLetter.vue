<template>
  <section class="emailContent" :class="{'setContent':isSelectEmail}">
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      }"></unselectEmail>
    <div v-if="isSelectEmail&&emailDetail!=null" class="main">
      <div class="head">
        <p class="title">
          <span class="name" :class="{'resetName':emailDetail.fromAlias}">{{emailDetail.fromAlias}}</span>
          <span class="formAddr hideTxt">{{emailDetail.fromAddr}}</span>
        </p>
        <p class="toAddr">
          <span>收件人:</span>
          <span class="hideTxt">{{emailDetail.toAddr}}</span>
        </p>
        <p class="subject">
          <span class="hideTxt">{{emailDetail.subjectName}}</span>
          <span>{{emailDetail.sentDate}}</span>
        </p>
      </div>
      <input id="copyInput" />
      <div class="content setScrollbar" :style="resetCss">
        <div  class="frame">
          <iframe src frameborder="0" id="myframe" style="width:100%"></iframe>
        </div>
        <div v-if="emailDetail.attachList!=null&&emailDetail.attachList&&emailDetail.attachList.length" class="download" >
          <div>
            <span class="el-icon-paperclip">附件({{emailDetail.attachList.length}}个)</span>&nbsp;&nbsp;
            <span class="downloadAll" @click="downloadAll(emailDetail.attachList)">全部下载</span>
          </div>
          <ul class="fileList">
            <li v-for="(item,i) in emailDetail.attachList" :key="i">
              <img src="../../../../assets/image/svg/document.svg" />
              <div>
                <span :class="{fileName:item.fileSize==null}">{{item.fileName}}</span>
                <span v-if="item.fileSize!=null">{{byteConvert(item.fileSize)}}</span>
              </div>
              <img src="../../../../assets/image/svg/download1.svg" @click="downloadSingle(item)" />
            </li>
          </ul>
        </div>
      </div>
      <div class="reply" v-if="roleCtl.mail_sendMail&&isShowReply">
        <selectTemplate @handleChange="handleChange" :key="isResouceShow"></selectTemplate>
        <p class="len">{{reply.length}}/{{maxlen}}</p>
        <el-input
          type="textarea"
          :rows="textareaRow"
          placeholder="请将你的回复限制在4000字符以内"
          :maxlength="maxlen"
          v-model="reply"
          id="txt"
          @blur="handleInputBlur($event)"
        ></el-input>
        <div class="btn">
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
          <el-button
            size="medium"
            @click="replyNormalMail"
            :disabled="reply.length==0"
            :class="{dis:reply.length==0}"
            class="send"
          >发送</el-button>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import unselectEmail from "./unselectEmail";
import { downloadFile, getCurrentDate, escape } from "@/lib/utils/common";
import selectTemplate from "../components/selectTemplate";
export default {
  components: {
    unselectEmail,
    selectTemplate
  },
  name: "notStandInsideLetter",
  data() {
    let _this = this;
    return {
      roleCtl: this.$store.state.role.roleCtl,
      token: localStorage.getItem("token"),
      emailDetail: {},
      reply: "",
      maxlen: 4000,
      attachList: [],
      replyMessageId: "",
      complaintLevelOneId: "",
      complaintLevelTwoId: "",
      templateId:"",
      allFileSize: 0,
      isShowReply: true,
      resizeTimeout:"",
      isResouceShow:0
    };
  },
    computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData,
      itemList: state => state.itemList,
      curEmailObj: state => state.curEmailObj
    }),
    textareaRow() {
      return this.reply ? 10 : 1;
    },
    resetCss() {
      let h;
      if (this.reply && !this.attachList.length) {
        h = "height:calc(100% - 134px - 84px - 171px)";
      } else if (this.attachList.length && !this.reply) {
        h = "height:calc(100% - 134px - 84px - 52px)";
      } else if (this.reply && this.attachList.length) {
        h = "height:calc(100% - 134px - 84px - 171px - 52px)";
      } else {
        h = "";
      }
      return h;
    }
  },
  watch: {
    emailDetail: {
      handler(newVal) {
        let t = this;
        if (newVal) {
          this.$nextTick(() => {
            let myframe = document.getElementById("myframe");
            if (
              myframe &&
              myframe.contentWindow &&
              myframe.contentWindow.document
            ) {
              (function() {
                let doc =  myframe.contentWindow.document;
                doc.open();
                doc.close();
                let iframeHtml = doc.getElementsByTagName(
                  "html"
                )[0];
                iframeHtml.innerHTML =
                  newVal.contentHtml != null
                    ? newVal.contentHtml.replace(/\s+\r/g,'\n')
                    : newVal.contentText;
                myframe.height = 0;
                setTimeout(function() {
                  
                  doc.body.style.wordBreak = "break-word";
                  let  reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
                  let iframeBody = doc.getElementsByTagName("body")[0];
                  if(!reg.test(iframeBody.innerHTML)){
                    doc.body.style.whiteSpace =
                    "pre-wrap";
                  }
              
                  let height =  Math.max(doc.documentElement.getBoundingClientRect().height,doc.body.getBoundingClientRect().height)||doc.documentElement.scrollHeight ||doc.body.scrollHeight;
                   myframe.height = height;
                  iframeHtml.style.overflow = "hidden";
                  doc.documentElement.scrollTop = 0;
                  let base = document.createElement("base");
                  base.target = "_blank";
                  doc
                    .getElementsByTagName("head")[0]
                    .appendChild(base);
                  // 阻止默认事件
                  doc.addEventListener(
                    "click",
                    e => {
                      e.preventDefault();
                    }
                  );
                }, 100);
                // 复制链接
                let el = doc.getElementsByTagName(
                  "a"
                );
                let copyInput = document.querySelector("#copyInput");
                for (let i in el) {
                  try {
                    if (el[i].href) {
                      el[i].onclick = function() {
                        copyInput.value = el[i].href;
                        copyInput.select();
                        document.execCommand("copy");
                        t.$message.success(
                          "复制成功，请在常用网络环境打开，以免关联"
                        );
                      };
                    }
                  } catch (i) {
                    this.$message.error("复制失败,请手动复制");
                  }
                }
              })();
            }
          });
        }
      }
    }
  },
  mounted(){
     window.addEventListener("resize", this.resizeThrottler, false);
  },
  methods: {
    ...mapMutations("email", ["setIsSelectEmail"]),
    resizeThrottler(){
      let myframe = document.getElementById("myframe"); 
      if ( !this.resizeTimeout ) {
        this.resizeTimeout = setTimeout(()=> {
          this.resizeTimeout = null;
          if (
                myframe &&
                myframe.contentWindow &&
                myframe.contentWindow.document
              ){
                myframe.height= 0;
                let doc =  myframe.contentWindow.document;
                let height =  Math.max(doc.documentElement.getBoundingClientRect().height,doc.body.getBoundingClientRect().height)||doc.documentElement.scrollHeight ||doc.body.scrollHeight;
                myframe.height =  height
              }
        },66);
      }
    },
    // 查询邮件详情
    queryEmailDetails(messageId) {
      this.initData();
      ++this.isResouceShow;
      this.replyMessageId = messageId;
      this.API.queryEmailDetails(messageId).then(res => {
        if (res.code === 0) {
          if (res.data.attachList != null) {
            let attachList = res.data.attachList.filter(item => {
              return item.type != 2;
            });
            res.data.attachList = [...attachList];
          }
          this.emailDetail = { ...res.data };
          this.setIsSelectEmail(true);
          this.showReply();
        }
      });
    },
    showReply() {
      this.itemList.forEach(item => {
        item.childList.forEach(list => {
          if (this.emailType == list.name) {
            this.isShowReply = !item.noticeFlag;
          }
        });
      });
    },
    initData() {
      this.attachList = [];
      this.allFileSize = 0;
      this.reply = "";
      this.complaintLevelOneId = "";
      this.templateId = "";
      this.complaintLevelTwoId = "";
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
    //回复邮件
    replyNormalMail() {
      let data = {
        replyMessageId: this.replyMessageId,
        bocomplaintLevelOneIdxId: this.complaintLevelOneId,
        bocomplaintLevelTwoIdxId: this.complaintLevelTwoId,
        templateId:this.templateId,
        boxId: this.emailBoxData.boxId,
        subject: this.emailDetail.subjectName
      };
      if (
        this.emailType.includes("replied") ||
        this.emailType.includes("sended")
      ) {
        data.fromAddr = this.emailDetail.fromAddr;
        data.toAddr = this.emailDetail.toAddr;
      } else {
        data.fromAddr = this.emailDetail.toAddr;
        data.toAddr = this.emailDetail.fromAddr;
      }
      if(data.fromAddr==this.curEmailObj.fromAddr){
          data.fromAlias = this.curEmailObj.fromAlias
          data.toMainAlias = this.curEmailObj.toMainAlias
      }else{
          data.fromAlias = this.curEmailObj.toMainAlias
          data.toMainAlias = this.curEmailObj.fromAlias
      }
      let quoteData = {
        from: escape(this.emailDetail.fromAddr),
        to: escape(this.emailDetail.toAddr),
        sendTime: getCurrentDate(2),
        subject: this.emailDetail.subjectName
      };
      let innerHTML = document.getElementById("myframe").contentWindow.document
        .body.innerHTML;
      let str = `<html><div>${this.reply}</div><div>&nbsp;</div><hr style="WIDTH: 210px; HEIGHT: 1px" color="#b5c4df" size="1" align="left"><div><span><div style="MARGIN: 10px; FONT-FAMILY: verdana; FONT-SIZE: 10pt"><div>${escape(data.fromAddr)}</div></div></span></div><span style="font: 14px/1.5 'Lucida Grande';color:#333;"><br><span><div class="" style="font: 12px/1.5 'Lucida Grande';padding:2px 0 2px 0;"><hr style=" HEIGHT: 1px" color="#b5c4df" size="1" align="left"></div><div style="font: 12px/1.5 'Lucida Grande';background:#efefef;color:#666666;padding:8px;"><div><b style="color:#999;">From:</b>&nbsp;${quoteData.from}</div><div><b style="color:#999;">to:</b>&nbsp;${quoteData.to}</div><div><b style="color:#999;">Date:</b>&nbsp;${quoteData.sendTime}</div><div><b style="color:#999;">subject:</b>&nbsp;${quoteData.subject}</div></div><br>${innerHTML}</html>`;
      data.html = str;
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
      this.API.replyNormalMail(data)
        .then(res => {
          if (res.code === 0) {
            this.$message.success("操作成功");
          }
          this.setIsSelectEmail(false);
          this.$loading().close();
        })
        .catch(() => {
          this.$loading().close();
        });
    },
    byteConvert(bytes) {
      if (isNaN(bytes)) {
        return "";
      }
      const symbols = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var exp = Math.floor(Math.log(bytes) / Math.log(2));
      if (exp < 1) {
        exp = 0;
      }
      var i = Math.floor(exp / 10);
      bytes = bytes / Math.pow(2, 10 * i);

      if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2);
      }
      return bytes + " " + symbols[i];
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
      let alias;
      if (
        this.emailType.includes("replied") ||
        this.emailType.includes("sended")
      ) {
          alias = this.emailDetail.toAddr;
      } else {
         alias =this.emailDetail.fromAlias|| this.emailDetail.fromAddr;
      }
      return str
        .replace(
          new RegExp(`\\{{买家昵称\\}}`, "g"),
          alias || "买家昵称"
        )
        .replace(
          new RegExp(`\\{{店铺名称\\}}`, "g"),
          this.emailBoxData.shopName || "店铺名称"
        )
        .replace(new RegExp(`\\{{订单编号\\}}`, "g"), "订单编号")
        .replace(new RegExp(`\\{{亚马逊商品编号\\}}`, "g"), "亚马逊商品编号");
    },
    downloadAll(list) {
      for (let i = 0; i < list.length; i++) {
        downloadFile(list[i].url, list[i].fileName);
      }
    },
    downloadSingle(item) {
      downloadFile(item.url, item.fileName);
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.resizeThrottler)
  },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
.emailContent {
  position: absolute;
  top: 60px;
  left: 500px;
  width: calc(100% - 500px);
  height: calc(100% - 60px);
  color: #ccc;
  background: #f6f7f9;
  transition: 0.3s;
  .main {
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #666;
    height: 100%;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    min-width: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    #copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    .head {
      padding: 8px 10px 0;
      background: #fff;
      border-bottom: 1px solid #ddd;
      font-weight: 650;
      .title {
        height: 24px;
        line-height: 24px;
        display: flex;
        .name {
          font-size: 16px;
          min-width: fit-content;
        }
        .formAddr {
          color: #999999;
        }
        .resetName {
          margin-right: 10px;
        }
      }
      .toAddr {
        display: flex;
        line-height: 24px;
        height: 24px;
        background: #f6f7f9;
        color: #bcbcbc;
        font-weight: 400;
        span:nth-of-type(1) {
          min-width: fit-content;
        }
        span:nth-of-type(2) {
          color: #666;
        }
      }
      .subject {
        display: flex;
        justify-content: space-between;
        height: 24px;
        line-height: 24px;
        font-style: normal;
        font-size: 12px;
        color: #999999;
        span:nth-of-type(2) {
          min-width: fit-content;
        }
      }
    }

    .content {
      padding: 8px;
      overflow-y: auto;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      .download {
        font-size: 14px;
        font-weight: 200;
        padding: 40px 0;
        div:nth-child(1) {
          height: 40px;
          line-height: 40px;
        }
        .downloadAll {
          color: #3bb19c;
          cursor: pointer;
        }
        .fileList {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          li {
            background-color: rgba(242, 242, 242, 1);
            width: 180px;
            height: 60px;
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            div {
              display: flex;
              flex-direction: column;
              width: 100px;

              span {
                height: 30px;
                line-height: 30px;
                overflow: hidden; //超出的文本隐藏
                text-overflow: ellipsis; //溢出用省略号显示
                white-space: nowrap; //溢出不换行
              }
              .fileName {
                height: 60px;
                line-height: 60px;
              }
            }
            img {
              font-size: 40px;
              line-height: 60px;
              cursor: pointer;
            }
            img:nth-of-type(1) {
              width: 40px;
            }
            img:nth-of-type(2) {
              width: 22px;
            }
            i:nth-of-type(2) {
              color: #3bb19c;
            }
          }
        }
      }
    }
    .reply {
      position: relative;
      border-top: 1px solid #e4e4e4;
      padding: 8px 10px;
      .len {
        position: absolute;
        top: 28px;
        right: 10px;
        color: #999999;
      }
      .el-textarea {
        margin: 10px 0;
        /deep/.el-textarea__inner {
          resize: none;
          min-height: 30px;
        }
      }

      /deep/.el-icon-upload {
        color: rgba(59, 177, 156, 1);
      }
      .btn {
        display: flex;
        justify-content: space-between;
        .send {
          background-color: rgba(59, 177, 156, 1);
          color: #fff;
        }
        .dis {
          background: #fff;
          color: #999;
        }
        .upload-demo {
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
      }
    }
  }
}
.setContent {
  background: #fff;
}
</style>