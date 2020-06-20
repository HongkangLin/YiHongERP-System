<template>
  <section class="emailContent">
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      }"></unselectEmail>
    <div v-if="isSelectEmail" class="main">
      <p class="p1">
        <span class="name">{{emailDetail.fromAlias}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="formAddr">{{emailDetail.fromAddr}}</span>
      </p>
      <p class="p2">
        发件人:
        <span class="toAddr">{{emailDetail.toAddr}}</span>
      </p>
      <p class="p3">
        <span>{{emailDetail.subjectName}}</span>
        <span>{{emailDetail.sentDate}}</span>
      </p>
      <input id="copyInput" />
      <div class="content" :style="resetCss">
        <div>
          <iframe src frameborder="0" id="myframe" style="width:100%"></iframe>
        </div>
        <!-- <div v-html="emailDetail.contentHtml"></div> -->
        <div
          v-if="emailDetail.attachList!=undefined&&emailDetail.attachList.length"
          class="download"
        >
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
      <div class="reply" v-if="roleCtl.mail_sendMail">
        <el-cascader
          placeholder="请选择模板"
          :options="options"
          :props="{ expandTrigger: 'click'}"
          @change="handleChange"
        ></el-cascader>
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
import { mapMutations, mapState } from "vuex";
import mixin from "./mixin/selectTemplate";
import unselectEmail from "./unselectEmail";
import { downloadFile } from "@/lib/utils/common";
export default {
  mixins: [mixin],
  components: {
    unselectEmail
  },

  name: "notStandInsideLetter",
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      token: localStorage.getItem("token"),
      emailDetail: {},
      reply: "",
      maxlen: 4000,
      options: [],
      attachList: [],
      replyMessageId: "",
      complaintLevelOneId: "",
      complaintLevelTwoId: "",
      allFileSize: 0
    };
  },
  created() {
  },
  watch: {
    emailDetail: {
      handler(newVal) {
        let t = this;
        if (newVal && newVal.contentHtml) {
          this.$nextTick(() => {
            // let handlerImg = function(img) {
            //   let timer = setInterval(function() {
            //     img.complete &&clearInterval(timer);
            //   }, 50);
            // };
            let myframe = document.getElementById("myframe");
            if (
              myframe &&
              myframe.contentWindow &&
              myframe.contentWindow.document
            ) {
              (function() {
                myframe.contentWindow.document.open();
                myframe.contentWindow.document.close();
                let iframeHtml = myframe.contentWindow.document.getElementsByTagName(
                  "html"
                )[0];

                iframeHtml.innerHTML = t.emailDetail.contentHtml;
                myframe.height = 0;
                setTimeout(function() {
                  myframe.contentWindow.document.body.style.whiteSpace =
                    "pre-wrap";
                  myframe.height =
                    myframe.contentWindow.document.documentElement
                      .scrollHeight ||
                    myframe.contentWindow.document.body.scrollHeight;
                  iframeHtml.style.overflow = "hidden";
                  myframe.contentWindow.document.documentElement.scrollTop = 0;
                  // let imgLen = myframe.contentWindow.document.getElementsByTagName(
                  //   "img"
                  // ).length;
                  // if (imgLen)
                  //   for (let n = 0; n < imgLen; n++) {
                  //     let img = myframe.contentWindow.document.getElementsByTagName(
                  //       "img"
                  //     )[n];
                  //     handlerImg(img, function() {
                  //       myframe.height =
                  //         myframe.contentWindow.document.documentElement
                  //           .scrollHeight ||
                  //         myframe.contentWindow.document.body.scrollHeight;
                  //     });
                  //   }
                  let base = document.createElement("base");
                  base.target = "_blank";
                  myframe.contentWindow.document
                    .getElementsByTagName("head")[0]
                    .appendChild(base);
                  // 阻止默认事件
                  myframe.contentWindow.document.addEventListener(
                    "click",
                    e => {
                      e.preventDefault();
                    }
                  );
                }, 100);
                // 复制链接
                let el = myframe.contentWindow.document.getElementsByTagName(
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
                          "复制成功，请在常用店铺环境打开，以免关联"
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
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData
    }),
    textareaRow() {
      return this.reply ? 10 : 1;
    },
    resetCss() {
      let h;
      // main = this.$refs.main
      if(this.reply&&!this.attachList.length){
        h = "height:calc(100% - 134px - 84px - 171px)"
      }else if(this.attachList.length&&!this.reply){
        h = "height:calc(100% - 134px - 84px - 52px)"
      }else if(this.reply&&this.attachList.length){
        h = "height:calc(100% - 134px - 84px - 171px - 52px)"
      }else{
        h = ""
      }
      return h
    }
  },
  methods: {
    ...mapMutations("email", ["setIsSelectEmail"]),
    // 查询邮件详情
    queryEmailDetails(messageId) {
      this.replyMessageId = messageId;
      this.API.queryEmailDetails(messageId).then(res => {
        if (res.code === 0) {
          this.emailDetail = { ...res.data };
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
        complaintLevelOneId: this.complaintLevelOneId,
        complaintLevelTwoId: this.complaintLevelTwoId,
        boxId: this.emailBoxData.boxId,
        subject: this.emailDetail.subjectName,
        fromAddr: this.emailBoxData.emailUsername,
        toAddr: this.emailDetail.fromAddr,
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
      // 测试
      // data.toAddr = "729731265@qq.com";
      // data.boxId=13
      // data.fromAddr="18927464275@189.cn"
      // 测试
      this.API.replyNormalMail(data).then(res => {
        if (res.code === 0) {
          this.$message.success("操作成功");
        }
        this.setIsSelectEmail(false);
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
    handleChange(val) {
      this.complaintLevelOneId = val[0];
      this.complaintLevelTwoId = val[1] || "";
      this.options.forEach(item => {
        if (
          val[0] == item.complaintLevelOneId &&
          val[1] == item.complaintLevelTwoId &&
          val[2] == item.id
        ) {
          this.insertTxt(item.templateContent);
        }
      });
      console.log(val);
    },
    downloadAll(list) {
      for (let i = 0; i < list.length; i++) {
        downloadFile(list[i].url, list[i].fileName);
      }
    },
    downloadSingle(item) {
      downloadFile(item.url, item.fileName);
    }
  }
};
</script>

<style lang="less" scoped>
.emailContent {
  position: absolute;
  top: 60px;
  left: 500px;
  width: calc(100% - 500px);
  height: calc(100% - 60px);
  color: #ccc;
  background: #f6f7f9;
  padding: 10px 10px 0;
  transition: 0.3s;
  font-family: "PingFangHK-Semibold", "PingFang HK Semibold", "PingFang HK";
  .main {
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #666;
    height: 100%;
    #copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    .p1 {
      font-weight: 650;
      height: 24px;
      line-height: 24px;
      .formAddr {
        color: #999;
      }
    }
    .p2 {
      height: 26px;
      line-height: 26px;
      background: #f6f7f9;
      color: #bcbcbc;
      span {
        color: #666;
      }
    }
    .p3 {
      font-weight: 650;
      display: flex;
      justify-content: space-between;
      height: 24px;
      line-height: 24px;
      font-weight: 650;
      font-style: normal;
      font-size: 12px;
      color: #999999;
    }
    .content {
      border: 1px solid #e4e4e4;
      height: 505px;
      padding: 8px;
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
      margin-top: 15px;
      .len {
        position: absolute;
        top: 0;
        right: 0;
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
</style>