<template>
  <div class="logisticsOrder_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">
          <el-tabs v-model="activeName" class="statusTabs">
            <el-tab-pane :label="'全部/'+statusTotal.all" name="0"></el-tab-pane>
            <el-tab-pane :label="'未生成/'+statusTotal.underway" name="1"></el-tab-pane>
            <el-tab-pane :label="'已生成/'+statusTotal.generate" name="2"></el-tab-pane>
            <el-tab-pane :label="'审核中/'+statusTotal.examine" name="3"></el-tab-pane>
            <el-tab-pane :label="'待付款/'+statusTotal.payment" name="4"></el-tab-pane>
            <el-tab-pane :label="'已完成/'+statusTotal.completed" name="5"></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button @click="merge" plain v-if="roleCtl.express_order_merge">合并订单</el-button>
            <el-button @click="applyForPay" type="primary" v-if="roleCtl.express_order_applyPay">申请付款</el-button>
          </div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="searchValue" @change="search" v-model="idKeyword" placeholder="物流单号/运单号"></el-input>
            <el-select filterable v-model="deliverMethod" @change="search" placeholder="运输方式" clearable>
              <el-option v-for="(item, idx) in way" :key="idx" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select filterable v-model="expcompId" @change="search" placeholder="物流商" clearable>
              <el-option v-for="(item, idx) in expcompList" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-date-picker @change="search" v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="请选择发货日期"></el-date-picker>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column align="center" type="selection" width="55" fixed :selectable="row => {return row.status === '未生成' || row.status === '已生成'}"></el-table-column>
          <el-table-column prop="id" label="物流单号" align="center" min-width="100"></el-table-column>
          <el-table-column prop="expcompName" label="物流商" align="center" min-width="150">
            <template slot-scope="scope">
              {{scope.row.expcompName || '--'}}
            </template>
          </el-table-column>
          <el-table-column prop="deliverSn" label="运单号" align="center" min-width="150"></el-table-column>
          <el-table-column prop="totalQuantity" label="数量（件）" align="center" min-width="100"></el-table-column>
          <el-table-column prop="deliverMethod" label="运输方式" align="center" min-width="150"></el-table-column>
          <el-table-column prop="totalCostAmount" label="物流总费用（元）" align="center" min-width="140"></el-table-column>
          <el-table-column prop="applyingAmount" label="申请中费用（元）" align="center" min-width="140"></el-table-column>
          <el-table-column prop="paidAmount" label="已支付（元）" align="center" min-width="120"></el-table-column>
          <el-table-column align="center" label="订单类型" width="80">
            <template slot-scope="scope">
              <div class="status">{{scope.row.mergeType === 0 ? '常规订单' : '合并订单'}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="80">
            <template slot-scope="scope">
              <div class="status">{{scope.row.status}}</div>
              <el-button type="text" size="small" v-if="scope.row.status==='审核中'" @click="viewReviewDetail(scope.row.id)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="deliverDate" label="发货日期" align="center" min-width="110"></el-table-column>
          <el-table-column prop="applier" label="申请人" align="center" min-width="85"></el-table-column>
          <el-table-column label="备注" align="center" min-width="150">
            <template slot-scope="scope">
              <div>{{scope.row.bak ? scope.row.bak.substring(0, 20) : ''}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <a class="link" target="_self" :href="`/#/F0701/editLogisticsOrder?id=${scope.row.id}`" type="text" size="small" v-if="(scope.row.status === '未生成' || scope.row.status === '已生成') && roleCtl.express_order_update">编辑</a>
              <el-divider v-if="scope.row.status === '已生成' && roleCtl.express_order_update" direction="vertical"></el-divider>
              <a class="link" target="_self" :href="`/#/F0701/logisticsOrderDetail?id=${scope.row.id}`" type="text" size="small" v-if="scope.row.status !== '未生成'">查看</a>
              <el-divider v-if="scope.row.mergeType === 2 && roleCtl.express_order_unmerge" direction="vertical"></el-divider>
              <el-button type="text" size="small" v-if="scope.row.mergeType === 2 && roleCtl.express_order_unmerge" @click="unmergeOrder(scope.row.id)">取消合并</el-button>
              <!-- <el-divider v-if="scope.row.status === '审核中'" direction="vertical"></el-divider>
              <el-button type="text" size="small" v-if="scope.row.status === '审核中'" @click="showCloseOrderDialog(scope.row.id)">撤回</el-button> -->
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
    <!-- 撤回 -->
    <el-dialog title="撤回确认" :visible.sync="closeOrderVisible" width="35%">
      <div class="hint">确定要撤回当前付款申请吗？撤回后物流订单状态将变更为已生成，可重新编辑并申请付款</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmApplyForClose">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 合并订单确认弹窗 -->
    <el-dialog title="合并订单确认" :visible.sync="mergeOrders" width="35%">
      <div class="mergeOrders">确定要合并订单吗？合并后可在合并订单内部添加/移除物流订单；如果你发现合并出错，可在合并后取消合并；合并不会造成原始物流单数据丢失。</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mergeOrders = false">取 消</el-button>
        <el-button type="primary" @click="doMergeOrders">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 取消合并 -->
    <el-dialog title="取消合并" :visible.sync="unmergeOrders" width="35%">
      <div class="mergeOrders">确定要取消合并吗？取消后将无法找回当前合并订单，该合并订单中的所有物流订单将恢复“未生成”的原始状态，请谨慎操作！</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unmergeOrders = false">取 消</el-button>
        <el-button type="primary" @click="doUnmerge">确 定</el-button>
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
        name: '物流',
        path: '/F0701/F070101'
      }, {
        name: '物流订单',
        path: ''
      }],
      way: [],
      activeName: "0", //物流订单状态Tab
      idKeyword: "", // 物流单号
      expcompList: [], // 物流商选择列表
      expcompId: '', // 物流商id
      deliverMethod: '', // 运输方式
      createTimeRange: [], // 发货日期

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],
      multipleSelection: [], //批量选中的项

      statusTotal: {
        underway: 0, // 未完成
        generate: 0, // 已生成
        examine: 0, // 审核中
        payment: 0, // 待付款
        completed: 0, // 已完成
        all: 0 // 全部
      },

      dialogTableVisible: false, //审核详情弹窗
      reviewDetailData: [],

      closeOrderVisible: false, //申请关闭物流订单弹窗
      closeOrderId: "",

      mergeOrders: false,
      unmergeOrders: false,
      unmergeId: ''
    }
  },
  async created() {
    this.queryStatusTotal();
    await this.getExpcomp();
    await this.getWay();
    this.queryList();
  },
  watch: {
    activeName() {
      this.idKeyword = ''; 
      this.expcompId = ''; 
      this.createTimeRange = []; 
      this.pageNum = 1;
      this.queryList();
    }
  },
  methods: {
    async getWay () { // 获取运输方式
      let data = await window.axios.get('/transport_type/listAll?pageSize=999999&pageNum=1&nameKeyword=');
      this.way = data.data.list;
    },
    async getExpcomp () { // 获取物流商
      let data = await window.axios.post('/express/queryExpressCompanyInfoListAuth', {
        pageSize: 9999999,
        pageNum: 1,
        snOrNameKeyword: ''
      });
      let arr = [];
      data.data.list.forEach(item => {
        arr.push({
          label: item.companyName,
          value: item.id
        });
      });
      this.expcompList = arr;
    },
    async queryList () { // 获取列表
      let data = await window.axios.get(`/express/order/listAll?status=${this.activeName === '0' ? '' : parseInt(this.activeName) - 1}&idKeyword=${this.idKeyword}&expcompId=${this.expcompId}&deliverMethod=${this.deliverMethod}&deliverDateStart=${this.createTimeRange && this.createTimeRange[0] ? this.createTimeRange[0] : ''}&deliverDateEnd=${this.createTimeRange && this.createTimeRange[0] ? this.createTimeRange[1] : ''}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`);
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        // 物流订单状态
        switch (item.status) {
          case 0:
            item.status = "未生成";
            break;
          case 1:
            item.status = "已生成";
            break;
          case 2:
            item.status = "审核中";
            break;
          case 3:
            item.status = "待付款";
            break;
          case 4:
            item.status = "已完成";
            break;
        }
        // 运输方式
        for (let i = 0; i < this.way.length; i++) {
          if (item.deliverMethod === this.way[i].id) {
            item.deliverMethod = this.way[i].name;
          }
        }
      });
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 物流订单列表-查询汇总数据
    async queryStatusTotal() {
      let data = await window.axios.get('/express/order/countStatus');
      if (data.code !== 0) return
      data.data.map((item) => {
        switch (item.status) {
          case -1: // 全部
            this.statusTotal.all = item.count;
            break;
          case 0: // 未生成
            this.statusTotal.underway = item.count;
            break;
          case 1: // 已生成
            this.statusTotal.generate = item.count;
            break;
          case 2: // 审核中
            this.statusTotal.examine = item.count;
            break;
          case 3: // 待付款
            this.statusTotal.payment = item.count;
            break;
          case 4: // 已完成
            this.statusTotal.completed = item.count;
            break;
        }
      });
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

    // 查看审核详情
    viewReviewDetail(purchaseId) {
      this.reviewDetailData = [];
      this.dialogTableVisible = true;
      window.axios.get(`/approve/queryBussinessApproveDetail?bussinessNo=${purchaseId}&applyType=exporder.pay`).then((data) => {
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

    // 显示撤回订单弹窗
    showCloseOrderDialog(purchaseId) {
      this.closeOrderId = purchaseId;
      this.closeOrderVisible = true;
    }, 

    // 撤回订单
    confirmApplyForClose() {
      let _this = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
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
    merge() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请选择物流订单");
      }
      let flag = false;
      this.multipleSelection.map(item => {
        if (item.status !== '未生成' || item.mergeType !== 0) {
          flag = true;
        }
      });
      if (flag) {
        return this.$message.warning("仅允许“未生成”状态下的“常规订单”进行合并");
      }
      this.mergeOrders = true;
    },
    doMergeOrders() {
      // console.log(this.multipleSelection);
      let ids = [];
      this.multipleSelection.map(item => {
        ids.push(item.id);
      })
      window.axios.post("/express/order/merge", { ids }).then((data) => {
        if (data.code !== 0) return
        this.$message.success("合并订单成功");
        this.mergeOrders = false;
        this.queryList();
      })
    },
    unmergeOrder(id) {
      this.unmergeId = id;
      this.unmergeOrders = true;
    },
    doUnmerge() {
      window.axios.post("/express/order/unmerge", { id: this.unmergeId }).then((data) => {
        if (data.code !== 0) return
        this.$message.success("取消合并物流单成功");
        this.unmergeId = '';
        this.unmergeOrders = false;
        this.queryList();
      })
    },
    // 申请付款
    applyForPay() {
      if (!this.multipleSelection.length) {
        return this.$message.warning("请选择物流订单");
      }
      let flag = true;
      let firstExpcompName = this.multipleSelection[0].expcompName;
      let firstExpcompId = this.multipleSelection[0].expcompId;
      this.multipleSelection.map((item) => {
        if (item.status !== "未生成" && item.status !== "已生成") {
          this.$message.warning("只能对未生成或已生成的物流订单申请付款");
          flag = false;
          return;
        } else if (item.expcompName === '' || item.expcompName === null) {
          this.$message.warning("物流商不能为空");
          flag = false;
          return;
        } else if (item.expcompName !== firstExpcompName) {
          this.$message.warning("请选择同一家物流商");
          flag = false;
          return;
        }
      })
      if (flag) {
        let arr = [];
        this.multipleSelection.map((item) => {
          arr.push(item.id);
        })
        let ids = encodeURI(JSON.stringify(arr));
        let name = encodeURI(firstExpcompName);
        window.open(`/#/F0701/logisticsApplyForPay?ids=${ids}&expcompName=${name}&expcompId=${firstExpcompId}`);
      }
    }
  },
};
</script>
<style lang="less" scoped>
.logisticsOrder_wrap {
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
      .mergeOrders {
        line-height: 18px;
      }
    }
  }
}
</style>