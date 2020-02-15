<template>
  <div>
    <!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="applyForPay_wrap">
      <div class="header">申请付款</div>
      <div class="contentArea">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="付款单号：" prop="payNum">
            <el-input maxlength="100" v-model="ruleForm.payNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="物流商：" prop="expcompName">
            <el-input maxlength="100" v-model="ruleForm.expcompName" disabled></el-input>
          </el-form-item>
          <el-form-item label="收款账号：" prop="accountInfo">
            <el-select filterable v-model="ruleForm.accountInfo" placeholder="请选择收款账号">
              <el-option v-for="(item, index) in accountList" :key="index" :label="item.accountBankname" :value="`${item.accountNo},${item.accountBankname},${item.accountName}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="note">
          <span class="name">备注：</span>
          <el-input maxlength="100" v-model="bak" class="bak" placeholder="请输入付款备注"></el-input>
        </div>
        <el-table :data="orderList" border show-summary :summary-method="getSummaries" style="width: 100%">
          <el-table-column label="物流单号" min-width="125">
            <template slot-scope="scope">
              <div class="number" @click="showSKU(scope.row.expOrderId)">{{scope.row.expOrderId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalCostAmount" label="物流总费用（元）" min-width="90"></el-table-column>
          <el-table-column prop="paidAmount" label="已支付（元）" min-width="90"></el-table-column>
          <el-table-column prop="applyingAmount" label="申请中费用（元）" min-width="120"></el-table-column>
          <el-table-column prop="applyAmount" min-width="130">
            <template slot="header">
              <span class="star">*</span>
              <span class="tableHeader">本次申请费用（元）</span>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.applyAmount" :min="0" :max="scope.row.unpaidAmount" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="bak" label="备注" min-width="240">
            <template slot-scope="scope">
              <el-input maxlength="100" v-model="scope.row.bak" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="openDialog" class="submitBtn">提交申请</el-button>
      </div>
    </div>
    <!-- 确认提交弹窗 -->
    <el-dialog title="确认提交" :visible.sync="dialogVisible" width="35%">
      <div class="dialogContent">确认提交吗？提交后将生成付款单，你可以在财务/应付费管理中查看审批流程以及付款单</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit" :loading="loading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- SKU信息弹框 -->
    <el-dialog title="采购单详情" :visible.sync="skuVisible" width="70%">
      <el-table
        :data="info"
        border
        show-summary
        :summary-method="getSummaries1"
        style="width: 100%">
        <el-table-column
          label="图片"
          align="center">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.goodsPicUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="fnskuId"
          label="品牌"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodsSku"
          label="SKU"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="产品名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="外箱尺寸(cm)"
          align="center">
          <template slot-scope="scope">{{scope.row.cartonLength + '*' + scope.row.cartonWidth + '*' + scope.row.cartonHeight}}</template>
        </el-table-column>
        <el-table-column
          prop="fullLoadWeight"
          label="整箱重量(kg)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="fullLoadQuantity"
          label="装箱数(套/箱)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="件数"
          align="center">
        </el-table-column>
        <el-table-column
          label="可用库存"
          align="center">
          --
        </el-table-column>
        <el-table-column
          prop="count"
          label="本次出库"
          align="center">
        </el-table-column>
        <el-table-column
          label="总体积(m³)"
          align="center">
          <template slot-scope="scope">{{scope.row.cartonLength * scope.row.cartonWidth * scope.row.cartonHeight}}</template>
        </el-table-column>
        <el-table-column
          label="总总量(kg)"
          align="center">
          <template slot-scope="scope">{{scope.row.fullLoadWeight * scope.row.quantity}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '物流',
        path: '/F0701/F070101'
      }, {
        name: '物流订单',
        path: '/F0701/F070101'
      }, {
        name: '申请付款',
        path: ''
      }],

      expcompId: null, //供应商id
      ruleForm: {
        payNum: "提交后自动生成", //付款单号
        expcompName: "", //供应商
        accountInfo: "", //收款账号
      },
      bak: "", //备注

      rules: {
        payNum: [
          { required: true, message: '请输入付款单号', trigger: 'blur' }
        ],
        expcompName: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        accountInfo: [
          { required: true, message: '请选择收款账号', trigger: 'change' }
        ]
      },
      info: [], // sku信息
      skuVisible: false, // sku详情
      accountList: [], //收款账号下拉
      orderList: [], //采购单号表格数据

      dialogVisible: false,

      loading: false
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.ruleForm.expcompName = decodeURI(this.$route.query.expcompName);
      this.expcompId = this.$route.query.expcompId;
      this.getTableData();
      this.getAccountList();
    },
    handleDelete (index) { // 移除操作
      this.orderList.splice(index, 1);
    },
    async showSKU (_id) { // 显示sku信息
      let data = await window.axios.get(`/express/order/goodsDetail/${_id}`);
      this.info = data.data;
      this.skuVisible = true;
    },
    getSummaries1 (param) { // 计算汇总
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        if (index === 2) {
          sums[index] = '共' + data.length + '类SKU';
          return;
        }
        if (index === 1 || index === 3 || index === 4) {
          sums[index] = '';
          return;
        }
        if (index === 5) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].fullLoadWeight) {
              sum += data[i].fullLoadWeight;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 6) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].fullLoadQuantity) {
              sum += data[i].fullLoadQuantity;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 7) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].quantity) {
              sum += data[i].quantity;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 9) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].count) {
              sum += data[i].count;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 11) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].fullLoadWeight && data[i].quantity) {
              sum += data[i].fullLoadWeight * data[i].quantity;
            }
          }
          sums[index] = sum || 0;
          return;
        }
      });

      return sums;
    },

    // 收款账号下拉
    getAccountList() {
      window.axios.get(`/express/getSettleInfo/${this.expcompId}`).then((data) => {
        if (data.code !== 0) return
        this.accountList = data.data.settleInfo;
      })
    },

    // 获取表格数据
    getTableData() {
      let ids = JSON.parse(decodeURI(this.$route.query.ids));
      window.axios.get(`/express/order/toApplyPay?ids=${ids.join(',')}`).then((data) => {
        if (data.code !== 0) return
        this.orderList = data.data;
      })
    },

    // 表格汇总计算
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = sums[index].toFixed(2); 
        } else {
          sums[index] = '';
        }
      });
      let calc = Number(sums[2]) + Number(sums[3]) + Number(sums[4]);
      sums[sums.length - 3] = '本次申请金额汇总：' + calc.toFixed(2);
      return sums;
    },

    // 打开弹窗
    openDialog() {
      let _this = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          for (let index = 0; index < this.orderList.length; index++) {
            const element = this.orderList[index];
            // if (element.unpaidAmount === 0) {
            //   return _this.$message.warning("未支付货款为0")
            // }
            if (element.applyAmount === undefined) {
              return _this.$message.warning("请输入本次申请费用")
            }
          }
          this.dialogVisible = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 提交申请
    confirmSubmit() {
      this.loading = true;
      let accountInfoArr = this.ruleForm.accountInfo.split(",");
      let params = {
        expCompId: this.expcompId,
        accountNo: accountInfoArr[0].trim(),
        accountBankName: accountInfoArr[1].trim(),
        accountName: accountInfoArr[2].trim(),
        bak: this.bak,
        expOrders: []
      }
      this.orderList.map((item) => {
        params.expOrders.push({
          id: item.expOrderId,
          applyAmount: item.applyAmount,
          bak: item.bak
        })
      })
      window.axios.post("/express/order/commitApplyPay", params).then((data) => {
        this.loading = false;
        if (data.code !== 0) return
        this.$message.success("申请付款成功");
        this.$router.push({
          path: "/F0701/F070101"
        })
      })
    }
  },
};
</script>
<style lang="less" scoped>
.applyForPay_wrap {
  .number {
    cursor: pointer;
    color: #1ABC9C;
  }
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  min-height: calc(100% - 50px);
  font-size: 12px;
  .header {
    color: #666666;
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    padding-left: 20px;
    border: 1px solid #e4e4e4;
  }
  .contentArea {
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: none;
    padding: 10px 30px;
    padding-bottom: 100px;
    .el-form {
      display: flex;
      justify-content: space-between;
      /deep/.el-form-item__content {
        >.el-input,
        >.el-select {
          width: 240px;
        }
      }
    }
    .note {
      display: flex;
      align-items: center;
      .name {
        text-align: right;
        color: #606266;
        font-size: 14px;
        width: 100px;
        padding-right: 12px;
      }
      .bak {
        flex: 1;
      }
    }
    .el-table {
      margin-top: 20px;
      .el-table__header-wrapper {
        .star {
          color: red;
          margin-right: 3px;
        }
      }
      /deep/.el-table__body-wrapper {
        .el-input-number {
          width: 100%;
        }
        .el-input__inner {
          text-align: left;
          border: none;
          &::placeholder {
            text-align: left;
          }
        }
      }
    }
    .submitBtn {
      float: right;
      margin-right: 10px;
      margin-top: 30px;
    }
  }
}
</style>