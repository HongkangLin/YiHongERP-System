<template>
  <section class="emailContent" :class="{'setContent':isSelectEmail}">
    <!-- 未选择邮件 -->
    <unselectEmail :opt="{
      isSelectEmail,
      }"></unselectEmail>
    <el-container v-if="isSelectEmail" style="height:100%">
      <el-container class="left" v-if="emailInfoList!=null&&emailInfoList.length">
        <el-header>
          <p class="p1">
            <span class="name">{{emailInfoList[0].fromAlias}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="formAddr">{{emailInfoList[0].fromAddr}}</span>
          </p>
          <p class="p11">{{emailInfoList[0].subjectName}}</p>
        </el-header>
        <el-main
          style="border-bottom: 1px solid #e4e4e4;padding: 10px; transform: scale(1,1); "
          :style="resetCss"
          ref="main"
        >
          <div class="more" @click="more" v-if="emailInfoList.length<copyData.length">{{loadingTxt}}</div>
          <div class="dialog">
            <div
              class="dialogItem"
              :class="{itemRight:item.side=='right'}"
              v-for="(item,index) in emailInfoList"
              :key="index"
            >
              <span class="sentDate">{{item.sentDate}}</span>
              <div class="d1">
                <div v-html="item.type==2?item.str:item.contentText" class="d2" :ref="'txt_'+index"></div>
                <div
                  v-if="item.contentText.length>300"
                  @click="toggle(item,index)"
                  class="d3"
                  :ref="'toggle_'+index"
                >展开显示更多</div>
              </div>
              <div v-if="item.attachList.length" class="attachList">
                <i class="el-icon-paperclip"></i>
                <span>{{parseStr(item.attachList)}}</span>
                <img
                  class="download"
                  @click="downloadAll(item.attachList)"
                  style="color: #1ABC9C;"
                  src="../../../../assets/image/svg/download.svg"
                />
              </div>
            </div>
          </div>
        </el-main>
        <el-footer style="height:140px;padding: 0 10px 10px;" v-if="roleCtl.mail_sendMail">
          <div style="position:relative">
            <el-cascader
              placeholder="请选择模板"
              :options="options"
              :props="{ expandTrigger: 'click'}"
              @change="handleChange"
              style="margin-top: 8px;"
            ></el-cascader>
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
            <el-button size="small" @click="markUnRead">标记未读</el-button>
            <el-button size="small" @click="markReplyOnPlatform">已在平台回复</el-button>
            <el-button
              size="small"
              @click="replyInsideMail"
              :disabled="reply.length==0"
              :class="reply.length==0?'disable':'able'"
            >发送</el-button>
          </div>
        </el-footer>
      </el-container>
      <el-aside width="240px" class="right" v-if="formData">
        <div class="title">订单信息</div>
        <el-form label-position="top" label-width="80px" :model="formData">
          <el-form-item label="ASIN" >
            <div @click="openPrompt('asin')" style="color: #3bb19c;height: 32px;">{{formData.asin}}</div>
          </el-form-item>
          <el-form-item label="订单号"  >
            <div @click="openPrompt('orderNo')" style="color: #3bb19c;height: 32px;">{{formData.orderNo}}</div>
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
            <span @click="openPrompt('productDesc')">{{formData.productDesc||'--'}}</span>
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
              @blur="blur('customerBak')"
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
import mixin from "./mixin/selectTemplate";
// import { type } from "os";
import { downloadFile } from "@/lib/utils/common";
let mock = [
  {
    side: "left",
    subjectName: "RE: Broken Containers Received",
    fromAlias: "Gonzalez, Karen 158",
    fromAddr: "Karen.Gonzalez@FreshPoint.com",
    toAddr: "support <support@hoojo.net>",
    sentDate: "2020-06-12 01:49:51",
    contentText:
      "This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was",
    attachList: [
      {
        id: 34,
        messageId: 48,
        sort: 1,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAai6HAAAkvquL8BE882.png?attname=image001.png",
        fileName: "image001.png",
        draftFlag: 1
      },
      {
        id: 35,
        messageId: 48,
        sort: 2,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAfwCnAAAC5WCrUAg126.jpg?attname=image002.jpg",
        fileName: "image002.jpg",
        draftFlag: 1
      }
    ]
  },
  {
    side: "left",
    subjectName: "RE: Broken Containers Received",
    fromAlias: "Gonzalez, Karen 158",
    fromAddr: "Karen.Gonzalez@FreshPoint.com",
    toAddr: "support <support@hoojo.net>",
    sentDate: "2020-06-12 01:49:51",
    contentText:
      "This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards",
    attachList: [
      {
        id: 34,
        messageId: 48,
        sort: 1,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAai6HAAAkvquL8BE882.png?attname=image001.png",
        fileName: "image001.png",
        draftFlag: 1
      },
      {
        id: 35,
        messageId: 48,
        sort: 2,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAfwCnAAAC5WCrUAg126.jpg?attname=image002.jpg",
        fileName: "image002.jpg",
        draftFlag: 1
      }
    ]
  },
  {
    side: "right",
    subjectName: "RE: Broken Containers Received",
    fromAlias: "Gonzalez, Karen 158",
    fromAddr: "Karen.Gonzalez@FreshPoint.com",
    toAddr: "support <support@hoojo.net>",
    sentDate: "2020-06-12 01:49:51",
    contentText:
      "This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards",
    attachList: [
      {
        id: 34,
        messageId: 48,
        sort: 1,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAai6HAAAkvquL8BE882.png?attname=image001.png",
        fileName: "image001.png",
        draftFlag: 1
      },
      {
        id: 35,
        messageId: 48,
        sort: 2,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAfwCnAAAC5WCrUAg126.jpg?attname=image002.jpg",
        fileName: "image002.jpg",
        draftFlag: 1
      }
    ]
  },
  {
    side: "left",
    subjectName: "RE: Broken Containers Received",
    fromAlias: "Gonzalez, Karen 158",
    fromAddr: "Karen.Gonzalez@FreshPoint.com",
    toAddr: "support <support@hoojo.net>",
    sentDate: "2020-06-12 01:49:51",
    contentText:
      "This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards This is Jessica the associate who received your email and I hope that you are doing fine today. Sorry to know that one of the lid was missing. Please accept our sincere apologies for the inconvenience caused. I am afraid that we don't have extra lid to replace the faulty one at the moment since all of our goods are stocked as a whole set at amazon warehouse. To make things right for you, how about we refund you 5 USD as compensation? Or if you have other thoughts? please do let me know. Looking forward to hearing from you soon. Once again, please accept our sincere apology for the inconvenience caused! Warmest Regards",
    attachList: [
      {
        id: 34,
        messageId: 48,
        sort: 1,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAai6HAAAkvquL8BE882.png?attname=image001.png",
        fileName: "image001.png",
        draftFlag: 1
      },
      {
        id: 35,
        messageId: 48,
        sort: 2,
        type: 2,
        url:
          "http://47.112.213.96/group1/M00/00/15/rBLP3l7nJkOAfwCnAAAC5WCrUAg126.jpg?attname=image002.jpg",
        fileName: "image002.jpg",
        draftFlag: 1
      }
    ]
  }
];
export default {
  mixins: [mixin],
  components: {
    unselectEmail
  },
  name: "standInsideLetter",
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      token: localStorage.getItem("token"),
      reply: "",
      maxlen: 4000,
      formData: null,
      emailInfoList: [], //展示的数据
      copyData: [], // 原数据
      handData: [], // 处理后的数据
      options: [],
      complaintLevelOneId: "",
      complaintLevelTwoId: "",
      attachList: [],
      replyMessageId: "",
      originalId:'',
      allFileSize: 0,
      size: 2, // 默认显示4条, 加载更多增加4条
      i: 1,
      loading: false
    };
  },
  created() {
    console.log(1);
  },
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      isSelectEmail: state => state.isSelectEmail,
      emailBoxData: state => state.emailBoxData
    }),
    loadingTxt() {
      return this.loading ? "加载中..." : "加载更多";
    },
    textareaRow() {
      return this.reply ? 10 : 1;
    },
    resetCss() {
      let h;
      if(this.reply&&!this.attachList.length){
        h = "height:calc(100% - 210px - 171px);flex: initial;"
      }else if(this.attachList.length&&!this.reply){
        h = "height:calc(100% - 210px - 52px);flex: initial;"
      }else if(this.reply&&this.attachList.length){
        h = "height:calc(100% - 210px - 171px - 52px);flex: initial;"
      }else{
        h = ""
      }
      return h
    }
  },
  watch: {
  },
  methods: {
    ...mapMutations("email", ["setIsSelectEmail", "setMultipleSelection"]),
    ...mapActions("email", ["queryEmailByPage"]),
    queryChatRoom(messageId) {
      // let id = 107;
      this.originalId = messageId;
      this.initData();
      this.API.queryChatRoom(messageId).then(res => {
        if (res.code === 0) {
          this.formData = { ...res.data.order };
          res.data.emailList.forEach(item => {
            if (item.contentText && item.contentText.length > 300) {
              item.str = item.contentText.substr(0, 300);
              item.str1 = item.contentText.substr(300);
              item.type = 2; // 长度大于300
            } else {
              item.type = 1; // 全部
            }
          });
          // this.copyData = [...res.data.emailList];
          this.copyData = [...mock];
          this.replyMessageId = this.copyData[this.copyData.length-1].id
          this.emailInfoList.push(
            ...this.copyData.slice(
              this.copyData.length - this.size * this.i
            )
          );
          this.i++;
          this.setIsSelectEmail(true);
        }
      });
    },
    initData() {
      this.reply = "";
      this.formData = {};
      this.emailInfoList = []; //展示的数据
      this.copyData = []; // 原数据
      this.handData = []; // 处理后的数据
      this.options = [];
      this.complaintLevelOneId = "";
      this.complaintLevelTwoId = "";
      this.attachList = [];
      this.replyMessageId = "";
      this.originalId = "",
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
    more() {
      console.log("加载更多");
      this.loading = true;
      if (this.i * this.size - 1 == this.copyData.length) {
        setTimeout(() => {
          this.emailInfoList.unshift(...this.copyData.slice(0, 1));
          this.loading = false;
        }, 1200);
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
        }, 1200);
      }
    },
    markUnRead() {
      this.setMultipleSelection([]);
      this.markUnRead({ messageId: this.originalId }).then(res => {
        if (res.code === 0) {
          this.cb();
          this.$message.success("标记未读成功");
        }
      });
    },
    markReplyOnPlatform() {
      this.setMultipleSelection([]);
      this.markReplyOnPlatform({ messageId: this.originalId }).then(res => {
        if (res.code === 0) {
          this.cb();
          this.$message.success("标记已在平台回复成功");
        }
      });
    },
    cb() {
      this.setMultipleSelection([]);
      this.queryEmailByPage({ pageNum: 1 });
    },
    blur(){
        this.saveEmailOrder();
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
          this.formData[type] = value;
          console.log(this.formData);
          this.saveEmailOrder();
        })
        .catch(() => {});
    },
    saveEmailOrder() {
      this.API.saveEmailOrder(this.formData).then(res => {});
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
    handleChange(val) {
      this.complaintLevelOneId = val[0];
      this.complaintLevelTwoId = val[1] || "";
      this.options.forEach(item => {
        if (
          val[0] == item.complaintLevelOneId &&
          val[1] == item.complaintLevelTwoId &&
          val[2] == item.id
        ) {
          let str = this.replacePlaceholder(item.templateContent);
          this.insertTxt(str);
        }
      });
    },
    replacePlaceholder(str) {
      return str
        .replace(
          new RegExp(`\\{{买家昵称\\}}`, "g"),
          this.emailBoxData.emailUsername
        )
        .replace(
          new RegExp(`\\{{店铺名称\\}}`, "g"),
          this.emailBoxData.shopName
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
        complaintLevelOneId: this.complaintLevelOneId,
        complaintLevelTwoId: this.complaintLevelTwoId,
        boxId: this.emailBoxData.boxId,
        subject: this.emailInfoList[0].subjectName,
        fromAddr: this.emailBoxData.emailUsername,
        toAddr: this.emailInfoList[0].fromAddr,
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
      // data.boxId = 13;
      // data.fromAddr = "18927464275@189.cn";
      // 测试
      this.API.replyInsideMail(data).then(res => {
       
      });
    }
  }
};
</script>

<style lang="less" scoped>
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
      .p1 {
        height: 24px;
        line-height: 24px;
        span:nth-child(1) {
          font-size: 14px;
        }
        span:nth-child(2) {
          color: #999999;
        }
      }
    }
    // /deep/.el-main{
    //   height: calc((100% - 260px) - 171px);
    // }
    .el-footer {
      height: 150px;
      .upload-demo {
        display: inline-block;
        margin-right: 10px;
      }
      /deep/.el-icon-upload {
        color: rgba(59, 177, 156, 1);
      }
      .disable {
        background: #fff;
        color: #999;
      }
      .able {
        background-color: #1abc9c;
        color: #fff;
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
    .more {
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
    .dialog {
      display: flex;
      flex-direction: column;
      height: 100%;
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

      .dialogItem {
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
        .d1 {
          border: 1px solid #e4e4e4;
          border-radius: 4px;
          background: #f8f8f8;
          .d2 {
            padding: 8px 5px 5px;
            transition: 0.3s;
          }
          .d3 {
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
          }
        }
      }
      .itemRight {
        align-self: flex-end;
      }
    }

    .p11 {
      color: #999999;
      height: 24px;
      line-height: 24px;
    }
    .p2 {
      height: 26px;
      line-height: 26px;
    }
    .p3 {
      font-weight: 650;
      text-align: justify;
      height: 24px;
      line-height: 24px;
    }
    .content {
      border: 1px solid #e4e4e4;
      height: 575px;
      padding: 8px;
      .p4 {
        height: 27px;
        line-height: 27px;
        color: #ff0000;
        border: 1px solid rgba(255, 0, 0, 1);
        background-color: rgba(255, 204, 204, 1);
        text-indent: 10px;
        box-sizing: border-box;
      }
      .p5 {
        padding: 40px 8px 0;
      }
    }
    .p6 {
      margin-top: 20px;
      text-indent: 10px;
      color: #bcbcbc;
      height: 36px;
      line-height: 36px;
      border: 1px solid rgba(228, 228, 228, 1);
      background-color: rgba(242, 242, 242, 1);
      box-sizing: border-box;
    }
    .txt {
      position: absolute;
      top: 16px;
      right: 0;
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
      .productDesc span {
        font-family: "PingFangHK-Semibold", "PingFang HK Semibold",
          "PingFang HK";
        font-weight: 650;
        font-style: normal;
        font-size: 12px;
        line-height: 24px;
        color: #3bb19c;
        text-align: left;
      }
    }
  }
}
.setContent {
  background: #fff;
}
</style>