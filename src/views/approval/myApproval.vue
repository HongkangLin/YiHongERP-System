<template>
  <div>
    <!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="purchaseOrder_wrap">
      <div class="order_main">
        <!-- 顶部区域 -->
        <div class="search">
          <div class="head">
            <el-tabs v-model="activeName" class="statusTabs">
              <el-tab-pane :label="'我发起的/'+statusTotal.own" name="0"></el-tab-pane>
              <el-tab-pane :label="'待我审批/'+statusTotal.waiting" name="1"></el-tab-pane>
              <el-tab-pane :label="'我已审批/'+statusTotal.approved" name="2"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="content">
            <div class="inputDiv">
              <el-input maxlength="100" class="searchValue" @change="search" v-model="searchValue" placeholder="审批编号/付款单号/采购单号"></el-input>
              <el-select v-if="activeName !== '1'" filterable v-model="applyStatus" @change="search" placeholder="审批状态" clearable>
                <el-option label="审核中" :value="1"></el-option>
                <el-option label="审核通过" :value="2"></el-option>
                <el-option label="驳回" :value="3"></el-option>
              </el-select>
            </div>
            <div class="sel" @click="search">查询</div>
          </div>
        </div>
        <!-- 列表区域 -->
        <section class="tableArea">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="applyNo" label="审批编号" align="center" min-width="100"></el-table-column>
            <el-table-column prop="bussinessNo" label="业务单号" align="center" min-width="150"></el-table-column>
            <el-table-column prop="creatorName" label="发起人" align="center" min-width="140"></el-table-column>
            <el-table-column prop="applyType" label="审批名称" align="center" min-width="140"></el-table-column>
            <el-table-column align="center" label="审批状态" width="80">
              <template slot-scope="scope">
                <div class="status">{{scope.row.applyStatus}}</div>
                <el-button type="text" size="small" @click="viewReviewDetail(scope.row.applyNo)">审核详情</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发起日期" align="center" min-width="110"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button v-if="activeName === '1'" type="text" size="small" @click="toDetailPage(scope.row.id, scope.row.applyType, scope.row.bussinessNo, 'me')">审批</el-button>
                <el-button v-else type="text" size="small" @click="toDetailPage(scope.row.id, scope.row.applyType, scope.row.bussinessNo)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="bottom">
            <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
          </div>
        </section>
      </div>
      <!-- 审核详情弹窗 -->
      <el-dialog title="审核详情" :visible.sync="dialogTableVisible" border width="45%">
        <el-table :data="reviewDetailData">
          <el-table-column property="approveTime" label="审核时间" min-width="150"></el-table-column>
          <el-table-column property="approveUserName" label="审核人员" min-width="100"></el-table-column>
          <el-table-column property="approveResult" label="审核结果" min-width="100"></el-table-column>
          <el-table-column property="feedbackReason" label="反馈详情" min-width="200"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pageination from '#/pagination/pagination.vue';
export default {
  components: {
    Pageination
  },
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      crumbList: [{ // 面包屑
        name: '审批',
        path: '/F0301/F030101'
      }, {
        name: '我的审批',
        path: ''
      }],

      activeName: "0", // 状态Tab
      searchValue: "", // 审批编号/付款单号/采购单号
      applyStatus: null, // 审批状态

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],

      statusTotal: {
        own: 0, // 我发起的
        waiting: 0, // 待我审批
        approved: 0 // 我已审批
      },

      dialogTableVisible: false, //审核详情弹窗
      reviewDetailData: []
    }
  },
  created() {
    this.queryList();
    this.queryStatusTotal();
  },
  watch: {
    activeName() {
      this.searchValue = ""; 
      this.applyStatus = null; 
      this.pageNum = 1;
      this.queryList();
    }
  },
  methods: {
    async queryList () { 
      let params = {
        applyFlag: ['own', 'waiting', 'approved'][this.activeName],
        searchValue: this.searchValue,
        applyStatus: this.applyStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.post('/apply/queryApplyListByPage', params);
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        // 审批状态
        switch (item.applyStatus) {
          case 1:
            item.applyStatus = "审核中";
            break;
          case 2:
            item.applyStatus = "审核通过";
            break;
          case 3:
            item.applyStatus = "驳回";
            break;
        }
      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 采购单列表-查询汇总数据
    async queryStatusTotal() {
      let data = await window.axios.post('/apply/queryApplySummary');
      if (data.code !== 0) return
      data.data.map((item) => {
        if (item.applyFlag === 'own') { // 我发起的
          this.statusTotal.own = item.count;
        } else if (item.applyFlag === 'waiting') { // 待我审批
          this.statusTotal.waiting = item.count;
        } else if (item.applyFlag === 'approved') { // 我已审批
          this.statusTotal.approved = item.count;
        }
      })
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
    },

    // 改变页码
    changeNum (num) { 
      this.pageNum = num;
      this.queryList();
    },
    
    // 改变每页条数
    changePageSize (size) { 
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },

    // 查看详情
    toDetailPage(id, type, bussinessNo, doing) {
      switch (type) {
        case 'purchase.pay':
          this.$router.push(`/F0801/F080101/myApprovalPayDetail?id=${id}&bussinessNo=${bussinessNo}&doing=${doing}`);
          break;
        case 'purchase.close':
          this.$router.push(`/F0801/F080101/myApprovalCloseDetail?id=${id}&bussinessNo=${bussinessNo}&doing=${doing}`);
          break;
      }
    },

    // 查看审核详情
    viewReviewDetail(applyNo) {
      this.reviewDetailData = [];
      this.dialogTableVisible = true;
      window.axios.get(`/approve/queryApproveDetail/${applyNo}`).then((data) => {
        if (data.code !== 0) return
        data.data.map((item) => {
          if (item.approveResult === "agree") {
            item.approveResult = "同意"
          } else if (item.approveResult === "disagree") {
            item.approveResult = "驳回"
          }
        })
        this.reviewDetailData = data.data;
      })
    }
  }
};
</script>
<style lang="less" scoped>
.purchaseOrder_wrap {
  .order_main {
    box-sizing: border-box;
    padding: 20px 60px;
    background-color: #f6f7f9;
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    font-size: 12px;
    .search {
        width: 100%;
        border: 1px solid rgb(228, 228, 228);
      .head {
        display: flex;
        justify-content: space-between;
        height: 50px;
        background-color: #f3f3f3;
        box-sizing: border-box;
        padding: 9px 20px;
        .el-tabs {
          /deep/.el-tabs__header {
            .el-tabs__nav-wrap::after {
              display: none!important;
            }
            .el-tabs__nav {
              margin-left: 20px;
              .el-tabs__item {
                padding: 0 40px;
                &:nth-child(2) {
                  padding-left: 16px;
                }
                &:last-child {
                  padding-right: 16px;
                }
              }
            }
          }
        }
      }
      .content {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        height: 60px;
        border-top: 1px solid rgb(228, 228, 228);
        box-sizing: border-box;
        padding: 12.5px 20px;
        div {
          line-height: 32px;
          &.sel {
            width: 80px;
            font-size: 14px;
            border: 1px solid #1ABC9C;
            border-radius: 4px;
            color: #1ABC9C;
            cursor: pointer;
            text-align: center;
          }
          &.searchValue {
            width: 200px;
            border-radius: 4px;
            color: #1ABC9C;
            margin-right: 10px;
          }
          &.el-select {
            margin-right: 10px;
            width: 110px;
          }
          &.el-date-editor {
            margin-right: 10px;
            width: 260px;
          }
          
        }
      }
    }
    .tableArea {
      background-color: #fff;
      margin-top: 25px;
      .bottom {
        border: 1px solid #ebeef4;
        border-top: none;
      }
    }
  }
  .el-dialog__wrapper {
    /deep/.el-dialog {
      .hint {
        font-size: 12px;
        color: #999999;
        margin-left: 100px;
        line-height: 16px;
      }
    }
  }
}
</style>