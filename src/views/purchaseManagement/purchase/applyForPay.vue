<template>
  <div>
    <!-- 顶部面包屑 -->
    <crumbs :list="crumbList"></crumbs>
    <div class="applyForPay_wrap">
      <div class="header">申请付款</div>
      <div class="contentArea">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="付款单号：" prop="payNum">
            <el-input maxlength="100" v-model="ruleForm.payNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商：" prop="supplierName">
            <el-input maxlength="100" v-model="ruleForm.supplierName" disabled></el-input>
          </el-form-item>
          <el-form-item label="收款账号：" prop="accountInfo">
            <el-select v-model="ruleForm.accountInfo" placeholder="请选择收款账号">
              <el-option v-for="(item, index) in accountList" :key="index" :label="item.accountBankname" :value="`${item.accountNo},${item.accountBankname},${item.accountName}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="note">
          <span class="name">备注：</span>
          <el-input maxlength="100" v-model="bak" class="bak" placeholder="请输入付款备注"></el-input>
        </div>
        <el-table :data="orderList" border show-summary :summary-method="getSummaries" style="width: 100%">
          <el-table-column prop="purchaseId" label="采购单号" min-width="125"></el-table-column>
          <el-table-column prop="goodsAmount" label="货款总金额（元）" min-width="90"></el-table-column>
          <el-table-column prop="paidAmount" label="已支付货款（元）" min-width="90"></el-table-column>
          <el-table-column prop="unpaidAmount" label="未支付货款（元）" min-width="90"></el-table-column>
          <el-table-column prop="applyingAmount" label="申请中货款（元）" min-width="120"></el-table-column>
          <el-table-column prop="applyAmount" min-width="130">
            <template slot="header">
              <span class="star">*</span>
              <span class="tableHeader">本次申请货款（元）</span>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.applyAmount" :min="0" :max="scope.row.unpaidAmount" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="transportFee" label="运费（元）" min-width="120">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.transportFee" :min="0" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="otherFee" label="其它（元）" min-width="110">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.otherFee" :controls="false" placeholder="请输入"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="bak" label="备注" min-width="240">
            <template slot-scope="scope">
              <el-input maxlength="100" v-model="scope.row.bak" placeholder="请输入"></el-input>
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
        <el-button type="primary" @click="confirmSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '采购管理',
        path: '/F0301/F030101'
      }, {
        name: '采购单',
        path: '/F0301/F030101'
      }, {
        name: '申请付款',
        path: ''
      }],

      supplierId: null, //供应商id
      ruleForm: {
        payNum: "提交后自动生成", //付款单号
        supplierName: "", //供应商
        accountInfo: "", //收款账号
      },
      bak: "", //备注

      rules: {
        payNum: [
          { required: true, message: '请输入付款单号', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        accountInfo: [
          { required: true, message: '请选择收款账号', trigger: 'change' }
        ]
      },
      accountList: [], //收款账号下拉
      orderList: [], //采购单号表格数据

      dialogVisible: false,

    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.ruleForm.supplierName = decodeURI(this.$route.query.supplierName);
      this.supplierId = this.$route.query.supplierId;
      this.getTableData();
      // this.getSupplierId();
      this.getAccountList();
    },

    // 匹配供应商id
    // getSupplierId() {
    //   window.axios.get("/supplier/listAll?pageSize=999&pageNum=1").then((data) => {
    //     if (data.code !== 0) return
    //     data.data.list.map((item) => {
    //       if (item.name === this.ruleForm.supplierName) {
    //         this.supplierId = item.id;
    //         this.getAccountList();
    //         return;
    //       }
    //     })
    //   })
    // },

    // 收款账号下拉
    getAccountList() {
      window.axios.get(`/supplier/getSettleInfo?supplierId=${this.supplierId}`).then((data) => {
        if (data.code !== 0) return
        this.accountList = data.data.settleInfo;
      })
    },

    // 获取表格数据
    getTableData() {
      let purchaseIds = JSON.parse(decodeURI(this.$route.query.purchaseIds));
      window.axios.post("/purchase/toApplyPay", {purchaseIds}).then((data) => {
        if (data.code !== 0) return
        this.orderList = data.data;
      })
    },

    // 表格汇总计算
    getSummaries(param) {
      // console.log("param: ", param);
      
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
      // console.log("sums: ", sums);
      let calc = Number(sums[5]) + Number(sums[6]) + Number(sums[7]);
      sums[sums.length - 1] = '本次申请金额汇总：' + calc.toFixed(2);
      return sums;
    },

    // 打开弹窗
    openDialog() {
      let _this = this;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          for (let index = 0; index < this.orderList.length; index++) {
            const element = this.orderList[index];
            if (element.unpaidAmount === 0) {
              return _this.$message.warning("未支付货款为0")
            }
            if (element.applyAmount === undefined) {
              return _this.$message.warning("请输入本次申请货款")
            }
          }
          this.dialogVisible = true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    confirmSubmit() {
      let accountInfoArr = this.ruleForm.accountInfo.split(",");
      let params = {
        supplierId: this.supplierId,
        accountNo: accountInfoArr[0].trim(),
        accountBankName: accountInfoArr[1].trim(),
        accountName: accountInfoArr[2].trim(),
        bak: this.bak,
        purchaseList: []
      }
      this.orderList.map((item) => {
        params.purchaseList.push({
          purchaseId: item.purchaseId,
          applyAmount: item.applyAmount,
          transportFee: item.transportFee,
          otherFee: item.otherFee,
          bak: item.bak
        })
      })
      window.axios.post("/purchase/commitApplyPay", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("申请付款成功");
        this.$router.push({
          path: "/F0301/F030101"
        })
      })
    }
  },
};
</script>
<style lang="less" scoped>
.applyForPay_wrap {
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