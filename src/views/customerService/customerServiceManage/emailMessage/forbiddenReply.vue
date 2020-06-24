<template>
  <section class="emailContent"  :class="{'setContent':isSelectEmail}">
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      }"></unselectEmail>
    <div
      v-if="isSelectEmail"
      class="main"
    >
      <p class="title">
        <span class="name">{{emailDetail.fromAlias}}</span>
        <span class="formAddr">{{emailDetail.fromAddr}}</span>
      </p>
      <p class="toAddr">
        收件人:
        <span class="toAddr">{{emailDetail.toAddr}}</span>
      </p>
      <p class="subject">
        <span>{{emailDetail.subjectName}}</span>
        <span>{{emailDetail.sentDate}}</span>
      </p>
      <input id="copyInput" />
      <div class="content">
        <p class="tips">为防止账号关联，当前邮件所有链接已禁用；点击链接可复制，请在常用网络环境打开。</p>
        <div class="frame">
          <iframe src frameborder="0" id="myframe" style="width:100%"></iframe>
        </div>
      </div>
      <div class="tip1">为防止账号关联，当前邮件已禁止在ERP中回复，请在常用网络环境或亚马逊后台回复</div>
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
      emailDetail: null
    };
  },
  created() {},
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
  methods: {
    ...mapMutations("email", ["setIsSelectEmail"]),
    // 查询邮件详情
    queryEmailDetails(messageId) {
      this.replyMessageId = messageId;
      this.API.queryEmailDetails(messageId).then(res => {
        if (res.code === 0 && res.data) {
          this.$nextTick(() => {
            this.emailDetail = { ...res.data };
            // this.emailDetail = res.data.contentHtml;
            this.setIsSelectEmail(true);
          });
        }
      });
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
  background: #f6f7f9;
  color: #ccc;
  padding: 20px 10px 0;
  transition: 0.3s;
  p {
    margin: 0;
  }
  .main {
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    color: #666;
    .title {
      font-weight: 650;
      height: 24px;
      line-height: 24px;
      &span:nth-of-type(1) {
        font-size: 14px;
      }
      &span:nth-of-type(2) {
        color: #999999;
      }
    }
    .toAddr {
      height: 26px;
      line-height: 26px;
      background: #f6f7f9;
      color: #bcbcbc;
      span {
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
    }
    #copyInput {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: -10;
    }
    .content {
      border: 1px solid #e4e4e4;
      height: 575px;
      padding: 8px;

      .tips {
        height: 27px;
        line-height: 27px;
        color: #ff0000;
        border: 1px solid rgba(255, 0, 0, 1);
        background-color: rgba(255, 204, 204, 1);
        text-indent: 10px;
        box-sizing: border-box;
        margin: 0;
      }
      .frame {
        padding: 4px 0;
        height: calc(100% - 20px);
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
      }
    }
    .tip1 {
      margin-top: 20px;
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
.setContent {
  background: #fff;
}
</style>