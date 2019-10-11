<template>
  <div class="financeIndex_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">
          <el-tabs v-model="activeName" class="statusTabs">
            <el-tab-pane :label="'全部/'+statusTotal.all" name="0"></el-tab-pane>
            <el-tab-pane :label="'审核中/'+statusTotal.underway" name="1"></el-tab-pane>
            <el-tab-pane :label="'驳回/'+statusTotal.rejected" name="2"></el-tab-pane>
            <el-tab-pane :label="'待付款/'+statusTotal.pending" name="3"></el-tab-pane>
            <el-tab-pane :label="'付款完成/'+statusTotal.paid" name="4"></el-tab-pane>
            <el-tab-pane :label="'已取消/'+statusTotal.cancel" name="5"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="searchValue" v-model="searchValue" placeholder="付款单号" clearable></el-input>
            <el-date-picker v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="请选择申请时间"></el-date-picker>
            <el-date-picker v-model="payTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="请选择付款时间"></el-date-picker>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="payId" label="付款单号" align="center" min-width="120"></el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="175"></el-table-column>
          <el-table-column prop="payAmount" label="付款单金额（元）" align="center" min-width="150"></el-table-column>
          <el-table-column align="center" label="付款单状态" min-width="160">
            <template slot-scope="scope">
              <div class="status">{{scope.row.payStatus}}</div>
              <el-button type="text" size="small" v-if="scope.row.payStatus==='审核中' || scope.row.payStatus==='驳回'" @click="viewReviewDetail(scope.row.payId)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" align="center" min-width="140"></el-table-column>
          <el-table-column prop="createName" label="申请人" align="center" min-width="100"></el-table-column>
          <el-table-column prop="payTime" label="付款时间" align="center" min-width="100"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toPrintPage(scope.row.payId)">查看</el-button>
              <el-divider v-if="scope.row.payStatus === '待付款'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.payStatus === '待付款'" type="text" size="small" @click="toArrivePage(scope.row.payId)">付款</el-button>
              <el-divider v-if="scope.row.payStatus === '待付款'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.payStatus === '待付款'" type="text" size="small" @click="showCloseOrderDialog(scope.row.payId)">取消</el-button>
              <el-divider v-if="scope.row.payStatus === '审核中' && scope.row.approveShowFlag" direction="vertical"></el-divider>
              <el-button v-if="scope.row.payStatus === '审核中' && scope.row.approveShowFlag" type="text" size="small" @click="toApprovalPage(scope.row.payId, scope.row.skuCount)">审批</el-button>
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
    <!-- 申请关闭采购单弹窗 -->
    <!-- <el-dialog title="申请关闭采购单" :visible.sync="closeOrderVisible" width="35%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="关闭原因：" prop="reason">
          <el-input v-model="ruleForm.reason" type="textarea" :rows="4" placeholder="请输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="hint">发起申请后您将无权操作此订单，解除异常后才能操作。请联系主管尽快处理！</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmApplyForClose">发起申请</el-button>
      </div>
    </el-dialog> -->
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
      crumbList: [{ // 面包屑
        name: '财务管理',
        path: '/F0501/F050101'
      }, {
        name: '应付费管理',
        path: ''
      }],

      activeName: "0", //状态Tab
      searchValue: "", //付款单号
      createTimeRange: [], //申请时间
      payTimeRange: [], //付款时间

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],

      statusTotal: {
        underway: 0, //审核中
        rejected: 0, //驳回
        pending: 0, //待付款
        paid: 0, //付款完成
        cancel: 0, //取消
        all: 0 //全部
      },

      dialogTableVisible: false, //审核详情弹窗
      reviewDetailData: [],

      closeOrderVisible: false, //申请关闭采购单弹窗
      closeOrderId: "",
      ruleForm: {
        reason: ""
      },
      rules: {
        reason: [
          { required: true, message: '请输入关闭原因', trigger: 'blur' }
        ]
      }
      
    }
  },
  created() {
    this.queryList();
    this.queryStatusTotal();
  },
  watch: {
    activeName(v) {
      this.searchValue = ""; 
      this.payStatus = null; 
      this.arrivalStatus = null; 
      this.createTimeRange = []; 
      this.arriveTimeRange = [];
      this.pageNum = 1;
      this.queryList();
    }
  },
  methods: {
    async queryList () { 
      let params = {
        searchValue: this.searchValue,
        payStatus: Number(this.activeName) ? Number(this.activeName) : null,
        createTimeStart: this.createTimeRange[0],
        createTimeEnd: this.createTimeRange[1],
        payTimeStart: this.payTimeRange[0],
        payTimeEnd: this.payTimeRange[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.post('/finance/queryPayManagePage', params);
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        // 付款状态
        switch (item.payStatus) {
          case 1:
            item.payStatus = "审核中";
            break;
          case 2:
            item.payStatus = "驳回";
            break;
          case 3:
            item.payStatus = "待付款";
            break;
          case 4:
            item.payStatus = "付款完成";
            break;
          case 5:
            item.payStatus = "取消";
            break;
        }
        item.payTime = item.payTime ? item.payTime : "--";
      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 付款单列表-查询汇总数据
    async queryStatusTotal() {
      let data = await window.axios.get('/finance/queryCountGroupByPayStatus');
      if (data.code !== 0) return
      data.data.map((item) => {
        if (item.payStatus === 1) { //审核中
          this.statusTotal.underway = item.count;
        } else if (item.payStatus === 2) { //驳回
          this.statusTotal.rejected = item.count;
        } else if (item.payStatus === 3) { //待付款
          this.statusTotal.pending = item.count;
        } else if (item.payStatus === 4) { //付款完成
          this.statusTotal.paid = item.count;
        } else if (item.payStatus === 5) { //取消
          this.statusTotal.cancel = item.count;
        } else { //全部
          this.statusTotal.all = item.count;
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
    toPrintPage(payId) {
      this.$router.push({
        path: `/F0501/viewPrint`
      })
    },

    // 到货
    // toArrivePage(purchaseId) {
    //   this.$router.push({
    //     path: `/F0301/arrivePage?purchaseId=${purchaseId}`
    //   })
    // },

    // 查看审核详情
    viewReviewDetail(payId) {
      this.reviewDetailData = [];
      this.dialogTableVisible = true;
      window.axios.get(`/finance/queryApproveRecord/${payId}`).then((data) => {
        if (data.code !== 0) return
        data.data.map((item) => {
          item.approveResult = item.approveResult === 1 ? "同意" : "驳回";
          item.feedbackReason = item.feedbackReason ? item.feedbackReason : "--";
        })
        this.reviewDetailData = data.data;
      })
    },

    // 显示申请关闭采购单弹窗
    // showCloseOrderDialog(purchaseId) {
    //   this.closeOrderId = purchaseId;
    //   this.ruleForm.reason = "";
    //   this.closeOrderVisible = true;
    // }, 

    // 申请关闭采购单
    // confirmApplyForClose() {
    //   let _this = this;
    //   this.$refs["ruleForm"].validate((valid) => {
    //     if (valid) {
    //       console.log('submit!');
    //       let params = {
    //         purchaseId: _this.closeOrderId,
    //         reason: _this.ruleForm.reason
    //       }
    //       window.axios.post("/apply/applyClose", params).then((data) => {
    //         if (data.code !== 0) return
    //         _this.$message.success("操作成功");
    //         _this.closeOrderVisible = false;
    //         _this.queryList();
    //         _this.queryStatusTotal();
    //       })
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },
    
    // 审批
    // toApprovalPage(purchaseId, skuCount) {
    //   this.$router.push({
    //     path: `/F0301/approvalPage?purchaseId=${purchaseId}&skuCount=${skuCount}`
    //   })
    // },

    // 申请付款
    // applyForPay() {
    //   if (!this.multipleSelection.length) {
    //     return this.$message.warning("请选择采购单");
    //   }
      
    //   let flag = true;
    //   let firstSupplierName = this.multipleSelection[0].supplierName;
    //   let firstSupplierId = this.multipleSelection[0].supplierId;
    //   this.multipleSelection.map((item) => {
    //     if (item.purchaseStatus !== "进行中") {
    //       this.$message.warning("只能对进行中的采购单申请付款");
    //       flag = false;
    //       return;
    //     } else if (item.supplierName !== firstSupplierName) {
    //       this.$message.warning("请选择同一家供应商");
    //       flag = false;
    //       return;
    //     }
    //   })
    //   if (flag) {
    //     let arr = [];
    //     this.multipleSelection.map((item) => {
    //       arr.push(item.purchaseId);
    //     })
    //     let ids = encodeURI(JSON.stringify(arr));
    //     let name = encodeURI(firstSupplierName);
    //     this.$router.push({
    //       path: `/F0301/applyForPay?purchaseIds=${ids}&supplierName=${name}&supplierId=${firstSupplierId}`
    //     })
    //   }
    // },

    // addPurchase () {
    //   this.$router.push('/addPurchase');
    // }
  },
};
</script>
<style lang="less" scoped>
.financeIndex_wrap {
  .order_main {
    box-sizing: border-box;
    padding: 20px 60px;
    background-color: #f6f7f9;
    width: 100%;
    height: 100%;
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