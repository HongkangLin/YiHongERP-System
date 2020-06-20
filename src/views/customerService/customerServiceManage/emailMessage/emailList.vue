<template>
  <el-container class="msg_right" :class="{'msg_right_1':emailType=='draftBox'}">
    <div class="batchDel bd_bt_1" v-if="emailType=='draftBox'">
      <el-button @click="batchDel">批量删除</el-button>
    </div>
    <div class="search bd_bt_1">
      <el-input v-model="searchValue" placeholder="请输入" @change="search" @keyup.enter="search">
        <el-select v-model="searchType" slot="prepend" class="select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-input>
      <i class="el-input__icon el-icon-search icon-search" @click="search" title="搜索(快捷键：回车键)"></i>
      <span class="split"></span>
      <i
        class="el-input__icon el-icon-time el-dropdown-link icon-time"
        title="筛选时间"
        @click="showDate"
      ></i>
      <el-date-picker
        v-model="rangeDate"
        type="daterange"
        align="left"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="selectDate"
        ref="datepick"
        :class="{'is-active':isActive}"
      ></el-date-picker>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @row-click="openDetails"
      :class="{'setTable':emailType=='draftBox'}"
    >
      <el-table-column type="selection" width="25"></el-table-column>
      <el-table-column label="全选">
        <template slot-scope="scope">
          <div style="text-align:justify">
            <span class="sender">
              <span
                :class="scope.row.seenFlag==1?'reply':'notReply'"
                v-if="emailType!='draftBox'"
              ></span>
              <img class="replied" src="../../../../assets/image/svg/reply.svg" v-if="scope.row.replyPlatformFlag==1&&(emailType.includes('standInsideLetter')||emailType.includes('buyers'))"/>
              {{scope.row.fromAddr||scope.row.fromAlias}}
            </span>
            <i class="el-icon-paperclip" v-if="scope.row.resourceCount"></i>
            <span class="sendTime">{{scope.row.createTime||scope.row.sentDate}}</span>
          </div>
          <div class="content">{{scope.row.subjectName||scope.row.sujectName||'&lt;无主题&gt;'}}</div>
          <div
            v-if="scope.row.replyPlatformFlag==1&&(emailType.includes('standInsideLetter')||emailType.includes('buyers'))"
            class="tips"
          >已在平台回复</div>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "emailList",
  inheritAttrs: false,
  data() {
    return {
      options: [
        { label: "主题", value: "subject" },
        { label: "发件人", value: "from" },
        { label: "订单号", value: "orderNo" },
        { label: "ASIN", value: "asin" }
      ],
      searchType: "subject",
      searchValue: "",
      tableData: [], // 列表数据
      pageData: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      curId: "",
      rangeDate: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
        // shortcuts: [
        //   {
        //     text: "今天",
        //     onClick(picker) {
        //       picker.$emit("pick", new Date());
        //     }
        //   },
        //   {
        //     text: "昨天",
        //     onClick(picker) {
        //       const date = new Date();
        //       date.setTime(date.getTime() - 3600 * 1000 * 24);
        //       picker.$emit("pick", date);
        //     }
        //   },
        //   {
        //     text: "一周前",
        //     onClick(picker) {
        //       const date = new Date();
        //       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", date);
        //     }
        //   }
        // ]
      },
      isActive: false
    };
  },
  watch: {
    emailType: {
      handler(newVal) {
        this.delData(newVal);
      }
    },
    itemList: {
      handler() {
        this.delData(this.emailType);
      }
    },
    // draftEmail: {
    //   handler(newVal) {
    //     if (newVal.code === 0) {
    //       newVal.data.list.forEach(item => {
    //         item.createTime = item.createTime.split(" ")[0];
    //       });
    //       this.tableData =
    //         newVal.data.pageNum > 1
    //           ? this.tableData.concat(newVal.data.list)
    //           : newVal.data.list;
    //       this.pageData.pageSize = newVal.data.pageSize;
    //       this.pageData.total = newVal.data.total;
    //     }
    //   },
    //   deep: true
    // }
    emailList: {
      handler(newVal) {
        if (newVal.code === 0) {
          newVal.data.list.forEach(item => {
            item.createTime = item.createTime?item.createTime.split(" ")[0]:item.sentDate.split(" ")[0];
          });
          this.tableData =
            newVal.data.pageNum > 1
              ? this.tableData.concat(newVal.data.list)
              : newVal.data.list;
          this.pageData.pageSize = newVal.data.pageSize;
          this.pageData.total = newVal.data.total;
        }
      },
      deep: true
    }
  },
  mounted() {
    let dom = document.querySelector(".el-table");
    let _this = this;
    dom.addEventListener("scroll", () => {
      const scrollDistance =
        dom.scrollHeight - dom.scrollTop - dom.clientHeight;
      if (scrollDistance <= 0) {
        //等于0证明已经到底，可以请求接口
        let totalPage = Math.ceil(
          _this.pageData.total / _this.pageData.pageSize
        );
        if (_this.pageData.pageNum < totalPage) {
          //当前页数小于总页数就请求
          _this.pageData.pageNum++; //当前页数自增
          if (this.emailType == "draftBox") {
            _this.queryDraftEmailByPage({
              pageNum: _this.pageData.pageNum,
              searchValue: _this.searchValue,
              searchType: _this.searchValue ? _this.searchType : ""
            });
          } else {
            _this.queryEmailByPage({
              pageNum: _this.pageData.pageNum,
              searchValue: _this.searchValue,
              searchType: _this.searchValue ? _this.searchType : ""
            });
          }
        }
      }
    });
  },
  computed: {
    ...mapState("email", {
      emailType: state => state.emailType,
      itemList: state => state.itemList,
      emailList:state => state.emailList,
      isSelectEmail: state => state.isSelectEmail,
      // draftEmail: state => state.draftEmail,
      emailBoxData: state => state.emailBoxData,
      itemId: state => state.mailObj.itemId,
      itemFlag: state => state.mailObj.itemFlag
    }),
    ...mapGetters("email", ["selectList"])
  },
  methods: {
    ...mapActions("email", ["queryDraftEmailByPage", "queryEmailByPage"]),
    ...mapMutations("email", [
      "setMultipleSelection",
      "setIsSelectEmail",
      "setMailObj"
    ]),
    // 展示日期组件
    showDate() {
      this.isActive = !this.isActive;
      this.$refs["datepick"].handleFocus();
    },
    // 选择日期
    selectDate(val) {
      console.log(this.rangeDate);
      console.log(val);
    },
    delData(val) {
      this.tableData = [];
      this.pageData = {
        pageNum: 1,
        pageSize: 20,
        total: 0
      };
      this.searchValue = "";
      if (val === "draftBox") {
        this.queryDraftEmailByPage({ pageNum: 1 });
      } else if (val === "newEmail") {
      } else {
        let itemId, itemFlag;
        this.itemList.forEach(item => {
          if (val.includes(item.name)) {
            itemId = item.itemId;
            item.childList.forEach(list => {
              if (val === list.name) {
                itemFlag = val.split("-")[1];
              }
            });
          }
        });
        this.setMailObj({ itemId, itemFlag });
        this.queryEmailByPage({ pageNum: 1 });
      }
    },
    // 邮件详情
    openDetails(row) {
      if (row.id || row.messageId) {
        this.curId = row.id || row.messageId;
        this.$emit("openDetails", row.id || row.messageId);
      }
    },
    // 选择邮件
    handleSelectionChange(val) {
      this.setMultipleSelection(val);
    },
    search() {
      // if (!this.searchValue) return;
      if (this.emailType == "draftBox") {
        this.queryDraftEmailByPage({
          pageNum: 1,
          searchValue: this.searchValue,
          searchType: this.searchType
        });
      } else {
        this.queryEmailByPage({
          pageNum: 1,
          searchValue: this.searchValue,
          searchType: this.searchType
        });
      }
    },
    // 删除
    batchDel(obj) {
      let list = { draftIdList: [] };
      if (obj && obj.type == "single") {
        list = { draftIdList: [obj.id] };
      } else {
        if (this.selectList.length) {
          list.draftIdList = this.selectList;
        } else {
          this.$message.warning("请选择需要删除邮件!");
          return;
        }
      }
      this.API.batchDelDraft(list).then(res => {
        if (res.code === 0) {
          // 已打开的邮件在删除的列表中需要关闭右侧详情
          if (list.draftIdList.includes(this.curId)) {
            this.setIsSelectEmail(false);
          }
          for (let j = 0; j < list.draftIdList.length; j++) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].id == list.draftIdList[j]) {
                this.tableData.splice(i, 1);
              }
            }
          }
          this.$message.success("删除邮件成功");
        }
      });
    }
  }
};
</script>

<style scoped  lang="less">
.msg_right {
  position: absolute;
  top: 60px;
  left: 200px;
  height: calc(100% - 60px);
  width: 300px;
  border-right: 1px solid #e4e4e4;
  transition: 0.5s;
  flex-direction: column;
  /* 搜索框样式*/
  .search {
    width: 300px;
    height: 50px;
    line-height: 50px;
    background: #fff;
    border-right: 1px solid #e4e4e4;
    position: relative;
    padding: 0 8px;
    &input:nth-child(2) {
      padding-right: 55px;
      padding-left: 4px;
    }
    .select {
      width: 80px;
      padding: 0;
      /deep/.el-input__suffix .el-input__icon {
        position: unset;
      }
      /deep/.el-input--suffix {
        /deep/.el-input__inner {
          padding: 0 8px;
        }
      }
    }
    .split {
      width: 1px;
      height: 16px;
      background-color: #bfbdbd;
      transform: translate(-32px, 17px);
      position: absolute;
    }
    .icon-search {
      position: absolute;
      top: 12px;
      right: 40px;
      z-index: 30;
      color: #999;
      line-height: 25px;
      width: 25px;
      height: 25px;
      font-weight: 800;
      cursor: pointer;
    }
    .icon-time {
      position: absolute;
      top: 12px;
      right: 14px;
      z-index: 30;
      color: #999;
      line-height: 25px;
      width: 25px;
      height: 25px;
      font-weight: 800;
      cursor: pointer;
    }
    /deep/.el-date-editor {
      transform: translate(-60px, 9px);
      position: absolute;
      z-index: 31;
      visibility: hidden;
    }
    /deep/input::-webkit-input-placeholder {
      /* placeholder字体大小  */
      font-size: 12px;
    }
  }
  .batchDel {
    height: 50px;
    width: 300px;
    box-sizing: border-box;

    color: #999;
    button {
      margin-left: 8px;
      margin-top: 9px;
    }
  }
  /* 搜索框样式*/

  /*修改滚动条样式*/
  /deep/.el-table::-webkit-scrollbar {
    width: 2px;
    height: 6px;
  }
  /deep/.el-table::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  /deep/.el-table::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 4px;
  }
  /deep/.el-table::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
  /deep/.el-table::-webkit-scrollbar-corner {
    background: #179a16;
  }
  /*修改滚动条样式*/

  /* 表格样式及内部样式*/
  /deep/.el-table {
    overflow-y: auto;
    height: calc(100% - 50px);
    width: 300px;
    position: absolute;
    top: 50px;
    cursor: pointer;
  }
  .setTable {
    height: calc(100% - 100px);
    top: 100px;
  }
  // 不加会有一条奇怪的横线
  /deep/.el-table::before {
    z-index: inherit;
  }
  /deep/.el-table__body {
    font-weight: 650;
    font-size: 12px;
    color: #999;
  }

  /deep/.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  /deep/.el-table-column--selection .cell {
    padding: 0;
    text-align: center;
    position: absolute;
    top: 38px;
    left: 8px;
    border: none;
  }

  /deep/.el-table__header .el-table-column--selection .cell {
    left: 0;
    top: 6px;
  }
  /deep/.el-table__row td:nth-child(2) .cell {
    padding-left: 0;
    padding-right: 0;
  }
  /deep/.el-checkbox__inner {
    width: 12px;
    height: 12px;
  }
  /deep/.el-checkbox__inner::after {
    width: 3px;
    height: 5px;
    left: 3px;
  }
  /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    top: 3px;
  }
  /deep/.el-table__row {
    position: relative;
  }
  /* 表格样式及内部样式*/
  .reply {
    background: #a5a5a5;
  }
  .notReply {
    background: #1abc9c;
  }
  .content {
    // position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sender {
    color: #666;
    font-size: 12px;
    width: 160px;
    display: inline-block;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    span {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      left: -16px;
      top: 15px;
    }
    span:nth-child(2) {
      right: 0;
    }
    .replied {
      width: 12px;
      height: 12px;
      position: absolute;
      top: 15px;
      left: -18px;
      font-size: 14px;
      font-weight: 600;
    }
  }
  /deep/.el-icon-paperclip {
    position: absolute;
    top: 15px;
    left: 88px;
    font-size: 14px;
    font-weight: 600;
  }

  .sendTime {
    position: absolute;
    right: 4px;
  }
  .tips {
    background: #a5a5a5;
    text-align: center;
    border-radius: 10px;
    font-weight: 400;
    color: #fff;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    width: 100px;
  }
}

.msg_right_1 {
  top: 0;
  height: 100%;
}
</style>