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
      <div class="content">
        <p class="tips hideTxt">为防止账号关联，当前邮件所有链接已禁用；点击链接可复制，请在常用网络环境打开。</p>
        <div class="frame setScrollbar">
          <iframe src frameborder="0" id="myframe" style="width:100%"></iframe>
        </div>
      </div>
      <div class="quick-reply">
        <div class="input_area">
          <div class="disReply hideTxt">为防止账号关联，当前邮件已禁止在ERP中回复，请在常用网络环境或亚马逊后台回复</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import unselectEmail from "./unselectEmail";
import { mapMutations, mapState } from "vuex";
export default {
  components: {
    unselectEmail
  },
  name: "forbiddenReply",
  data() {
    return {
      emailDetail: null,
      placeholder:
        "为防止账号关联，当前邮件已禁止在ERP中回复，请在常用网络环境或亚马逊后台回复",
      row: 1,
      isDisable: true
    };
  }, 
  mounted() {},
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData
    })
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
                myframe.contentWindow.document.open();
                myframe.contentWindow.document.close();
                let iframeHtml = myframe.contentWindow.document.getElementsByTagName(
                  "html"
                )[0];
                iframeHtml.innerHTML =
                  newVal.contentHtml != null
                    ? newVal.contentHtml
                    : newVal.contentText;
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
  methods: {
    ...mapMutations("email", ["setIsSelectEmail"]),
    // 查询邮件详情
    queryEmailDetails(messageId) {
      this.replyMessageId = messageId;
      this.API.queryEmailDetails(messageId).then(res => {
        if (res.code === 0 && res.data) {
          this.$nextTick(() => {
            if (res.data.attachList != null) {
              let attachList = res.data.attachList.filter(item => {
                return item.type != 2;
              });
              res.data.attachList = [...attachList];
            }
            this.emailDetail = { ...res.data };
            this.setIsSelectEmail(true);
          });
        }
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
  left: 500px;
  width: calc(100% - 500px);
  height: calc(100% - 60px);
  background: #f6f7f9;
  color: #ccc;
  transition: 0.3s;
  p {
    margin: 0;
  }
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
        span:nth-of-type(1){
         min-width: fit-content;
        }
        span:nth-of-type(2) {
          color: #666;
        }
      }
      .subject {
        font-weight: 650;
        display: flex;
        justify-content: space-between;
        height: 24px;
        line-height: 24px;
        color: #999999;
        span:nth-of-type(2){
          min-width: fit-content;
        }
      }
    }

    #copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    .content {
      overflow-y: auto;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      .tips {
        height: 27px;
        line-height: 27px;
        color: #ff0000;
        border: 1px solid rgba(255, 0, 0, 1);
        background-color: rgba(255, 204, 204, 1);
        text-indent: 10px;
        box-sizing: border-box;
        margin: 8px;
      }
      .frame {
        padding: 4px 0;
        height: calc(100% - 20px);
        overflow-y: auto;
      }
    }
    .quick-reply {
      border-top: 1px solid #ddd;
      width: 100%;
      background-color: #fff;
      z-index: 100;
      .input_area {
        padding: 8px 10px;
        .is-disabled {
          /deep/.el-textarea__inner {
            resize: none;
            min-height: 30px;
          }
        }
        .disReply {
          text-indent: 10px;
          color: #bcbcbc;
          height: 36px;
          line-height: 36px;
          border: 1px solid rgba(228, 228, 228, 1);
          background-color: rgba(242, 242, 242, 1);
          box-sizing: border-box;
        }
      }
    }
  }
}
.setContent {
  background: #fff;
}
</style>