<template>
  <div class="purchaseOrder_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">
          <el-tabs v-model="activeName" class="statusTabs">
            <el-tab-pane :label="'全部/'+statusTotal.all" name="0"></el-tab-pane>
            <el-tab-pane :label="'审核中/'+statusTotal.reviewing" name="5"></el-tab-pane>
            <el-tab-pane :label="'驳回/'+statusTotal.rejected" name="6"></el-tab-pane>
            <el-tab-pane :label="'进行中/'+statusTotal.underway" name="1"></el-tab-pane>
            <el-tab-pane :label="'已完成/'+statusTotal.completed" name="2"></el-tab-pane>
            <el-tab-pane :label="'关闭中/'+statusTotal.closing" name="3"></el-tab-pane>
            <el-tab-pane :label="'已关闭/'+statusTotal.closed" name="4"></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button @click="applyForPay" v-if="roleCtl.purchase_apply">申请付款</el-button>
            <el-button @click="addPurchase" type="primary" v-if="roleCtl.purchase_add">新建采购单</el-button>
          </div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="searchValue" @change="search" v-model="searchValue" placeholder="采购单/供应商/sku/产品名称"></el-input>
            <el-select filterable v-model="payStatus" @change="search" placeholder="付款状态" clearable>
              <el-option label="未完成" :value="1"></el-option>
              <el-option label="已完成" :value="2"></el-option>
            </el-select>
            <el-select filterable v-model="arrivalStatus" @change="search" placeholder="到货状态" clearable>
              <el-option label="未完成" :value="1"></el-option>
              <el-option label="已完成" :value="2"></el-option>
            </el-select>
            <el-date-picker @change="search" v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="采购单创建日期"></el-date-picker>
            <el-date-picker @change="search" v-model="arriveTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="到货日期"></el-date-picker>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column prop="purchaseId" label="采购单号" align="center" min-width="100"></el-table-column>
          <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="150"></el-table-column>
          <el-table-column label="SKU数量" align="center" min-width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toDetailPage(scope.row.purchaseId)">{{scope.row.skuCount}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="goodsAmount" label="货款总金额（元）" align="center" min-width="140"></el-table-column>
          <el-table-column prop="applyingAmount" label="申请中金额（元）" align="center" min-width="140"></el-table-column>
          <el-table-column prop="paidAmount" label="已支付货款（元）" align="center" min-width="120"></el-table-column>
          <el-table-column align="center" label="状态" width="80">
            <template slot-scope="scope">
              <div class="status">{{scope.row.purchaseStatus}}</div>
              <el-button type="text" size="small" v-if="scope.row.purchaseStatus==='关闭中' || scope.row.purchaseStatus==='已关闭' || scope.row.purchaseStatus==='审核中' || scope.row.purchaseStatus==='驳回'" @click="viewReviewDetail(scope.row.purchaseId, scope.row.purchaseStatus)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center" min-width="110"></el-table-column>
          <el-table-column prop="purchaseUserName" label="采购员" align="center" min-width="85"></el-table-column>
          <el-table-column label="备注" align="center" min-width="150">
            <template slot-scope="scope">
              <div>{{scope.row.bak.substring(0, 20)}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="150" v-if="roleCtl.purchase_query || roleCtl.purchase_arrive || roleCtl.purchase_close || roleCtl.purchase_update">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" @click="toDetailPage(scope.row.purchaseId)" v-if="roleCtl.purchase_query">详情</el-button> -->
              <a class="link" target="_self" :href="`/#/F0301/purchaseOrderDetail?purchaseId=${scope.row.purchaseId}`" v-if="roleCtl.purchase_query">查看</a>
              <el-divider v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_query && roleCtl.purchase_arrive" direction="vertical"></el-divider>
              <!-- <el-button v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_arrive" type="text" size="small" @click="toArrivePage(scope.row.purchaseId)">到货</el-button> -->
              <a class="link" target="_self" :href="`/#/F0301/arrivePage?purchaseId=${scope.row.purchaseId}`" v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_arrive">到货</a>
              <el-divider v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_close" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_close" type="text" size="small" @click="showCloseOrderDialog(scope.row.purchaseId)">关闭</el-button>
              <el-divider v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_finish" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus === '进行中' && roleCtl.purchase_finish" type="text" size="small" @click="close(scope.row.purchaseId)">完结</el-button>
              <el-divider v-if="scope.row.approveShowFlag" direction="vertical"></el-divider>
              <el-button v-if="scope.row.approveShowFlag" type="text" size="small" @click="toApprovalPage(scope.row.purchaseId, scope.row.skuCount)">审批</el-button>
              <el-divider v-if="scope.row.purchaseStatus==='驳回' && roleCtl.purchase_update" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus==='驳回' && roleCtl.purchase_update" type="text" size="small" @click="toEditPage(scope.row.purchaseId)">编辑</el-button>
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
    <el-dialog title="申请关闭采购单" :visible.sync="closeOrderVisible" width="35%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="关闭原因：" prop="reason">
          <el-input maxlength="100" v-model="ruleForm.reason" type="textarea" :rows="4" placeholder="请输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div class="hint">发起申请后您将无权操作此订单，解除异常后才能操作。请联系主管尽快处理！</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmApplyForClose">发起申请</el-button>
      </div>
    </el-dialog>
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
        name: '采购管理',
        path: '/F0301/F030101'
      }, {
        name: '采购单',
        path: ''
      }],

      activeName: "0", //采购单状态Tab
      searchValue: "", //购单、供应商、sku、产品名称
      payStatus: null, //付款状态
      arrivalStatus: null, //到货状态
      createTimeRange: [], //采购单创建日期
      arriveTimeRange: [], //到货日期

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],
      multipleSelection: [], //批量选中的项

      statusTotal: {
        underway: 0, //进行中
        completed: 0, //已完成
        closing: 0, //关闭中
        closed: 0, //已关闭
        all: 0, //全部
        reviewing: 0, //审核中
        rejected: 0 //驳回
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
    activeName() {
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
        purchaseStatus: Number(this.activeName) ? Number(this.activeName) : null,
        payStatus: this.payStatus,
        arrivalStatus: this.arrivalStatus,
        createTimeBegin: this.createTimeRange ? this.createTimeRange[0] : null,
        createTimeEnd: this.createTimeRange ? this.createTimeRange[1] : null,
        arriveTimeBegin: this.arriveTimeRange ? this.arriveTimeRange[0] : null,
        arriveTimeEnd: this.arriveTimeRange ? this.arriveTimeRange[1] : null,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.post('/purchase/queryPurchaseInfoByPage', params);
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        // 采购单状态
        switch (item.purchaseStatus) {
          case 1:
            item.purchaseStatus = "进行中";
            break;
          case 2:
            item.purchaseStatus = "已完成";
            break;
          case 3:
            item.purchaseStatus = "关闭中";
            break;
          case 4:
            item.purchaseStatus = "已关闭";
            break;
          case 5:
            item.purchaseStatus = "审核中";
            break;
          case 6:
            item.purchaseStatus = "驳回";
            break;
        }

      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 采购单列表-查询汇总数据
    async queryStatusTotal() {
      let data = await window.axios.get('/purchase/queryCountGroupByPurchaseStatus');
      if (data.code !== 0) return
      data.data.map((item) => {
        if (item.purchaseStatus === 1) { //进行中
          this.statusTotal.underway = item.count;
        } else if (item.purchaseStatus === 2) { //已完成
          this.statusTotal.completed = item.count;
        } else if (item.purchaseStatus === 3) { //关闭中
          this.statusTotal.closing = item.count;
        } else if (item.purchaseStatus === 4) { //已关闭
          this.statusTotal.closed = item.count;
        } else if (item.purchaseStatus === 5) { //审核中
          this.statusTotal.reviewing = item.count;
        } else if (item.purchaseStatus === 6) { //驳回
          this.statusTotal.rejected = item.count;
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

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 查看详情
    toDetailPage(purchaseId) {
      window.open(`/#/F0301/purchaseOrderDetail?purchaseId=${purchaseId}`);
    },

    // 到货
    toArrivePage(purchaseId) {
      window.open(`/#/F0301/arrivePage?purchaseId=${purchaseId}`);
    },

    toEditPage(purchaseId) {
      this.$router.push({path:`/F0301/editPage`, query: {purchaseId: purchaseId}});
    },

    // 查看审核详情
    viewReviewDetail(purchaseId, purchaseStatus) {
      this.reviewDetailData = [];
      this.dialogTableVisible = true;
      const applyType = (purchaseStatus === '关闭中' || purchaseStatus === '已关闭') ? 'purchase.close' : 'purchase.add';
      window.axios.get(`/approve/queryBussinessApproveDetail?bussinessNo=${purchaseId}&applyType=${applyType}`).then((data) => {
        if (data.code !== 0) return
        data.data.map((item) => {
          if (item.approveResult === "agree") {
            item.approveResult = "同意"
          } else if (item.approveResult === "disagree") {
            item.approveResult = "驳回"
          }
        })
        // data.data = data.data.filter((item) => {
        //   return item.approveResult !== null;
        // })
        this.reviewDetailData = data.data;
      })
    },

    // 显示申请关闭采购单弹窗
    showCloseOrderDialog(purchaseId) {
      this.closeOrderId = purchaseId;
      this.ruleForm.reason = "";
      this.closeOrderVisible = true;
    }, 

    // 申请关闭采购单
    confirmApplyForClose() {
      let _this = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          console.log('submit!');
          let params = {
            purchaseId: _this.closeOrderId,
            reason: _this.ruleForm.reason
          }
          window.axios.post("/apply/applyClose", params).then((data) => {
            if (data.code !== 0) return
            _this.$message.success("操作成功");
            _this.closeOrderVisible = false;
            _this.queryList();
            _this.queryStatusTotal();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    close (_id) { // 完结
      this.$confirm('确定要手动完结当前采购单吗?完结后采购单状态变更为已完成，同时会移除当前采购单在途库存与供应商欠款。', '完结采购单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let data = await window.axios.get(`/purchase/finishPurchase/${_id}`);
        if (data.code === 0) {
          this.$message({
            message: data.message,
            type: 'success'
          });
          this.queryList();
        }
      });
    },
    
    // 审批
    toApprovalPage(purchaseId, skuCount) {
      window.open(`/#/F0301/approvalPage?purchaseId=${purchaseId}&skuCount=${skuCount}`);
    },

    // 申请付款
    applyForPay() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请选择采购单");
      }
      
      let flag = true;
      let firstSupplierName = this.multipleSelection[0].supplierName;
      let firstSupplierId = this.multipleSelection[0].supplierId;
      this.multipleSelection.map((item) => {
        if (item.purchaseStatus !== "进行中") {
          this.$message.warning("只能对进行中的采购单申请付款");
          flag = false;
          return;
        } else if (item.supplierName !== firstSupplierName) {
          this.$message.warning("请选择同一家供应商");
          flag = false;
          return;
        }
      })
      if (flag) {
        let arr = [];
        this.multipleSelection.map((item) => {
          arr.push(item.purchaseId);
        })
        let ids = encodeURI(JSON.stringify(arr));
        let name = encodeURI(firstSupplierName);
        window.open(`/#/F0301/applyForPay?purchaseIds=${ids}&supplierName=${name}&supplierId=${firstSupplierId}`);
      }
    },

    addPurchase () {
      this.$router.push('/addPurchase');
    }
  },
};
</script>
<style lang="less" scoped>
.purchaseOrder_wrap {
  .link {
    color:#1ABC9C;
    cursor: pointer;
    user-select: none;
  }
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