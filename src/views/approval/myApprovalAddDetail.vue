<template>
  <div>
		<!-- 顶部面包屑 -->
    <div class="top">
      <crumbs :list="crumbList"></crumbs>
      <div class="printBtn" @click="refreash"><i class="el-icon-refresh"></i> 刷新</div>
    </div>
    <div class="approvalPage_wrap">
      <div class="header">采购单新增申请</div>
      <div class="contentArea">
        <div class="title"><i class="el-icon-collection-tag"></i><span>基础信息</span></div>
        <div class="info">
          <el-row>
            <el-col :span="4"><div class="td label">采购单号</div></el-col>
            <el-col :span="8"><div class="td">{{id}}</div></el-col>
            <el-col :span="4"><div class="td label">供应商</div></el-col>
            <el-col :span="8"><div class="td">{{info.purchaseInfo.supplierName}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">供应商编号</div></el-col>
            <el-col :span="8"><div class="td">{{info.purchaseInfo.supplierSn}}&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">采购员</div></el-col>
            <el-col :span="8"><div class="td">{{info.purchaseInfo.purchaseUserName}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">仓库</div></el-col>
            <el-col :span="8"><div class="td">{{info.purchaseInfo.warehouseName}}&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">预计交期</div></el-col>
            <el-col :span="8"><div class="td">{{info.purchaseInfo.expectDueTime}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">备注</div></el-col>
            <el-col :span="8"><div class="td"><a>{{info.purchaseInfo.bak}}</a>&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">合同</div></el-col>
            <el-col :span="8"><div class="td"><a target="_black" :href="info.purchaseInfo.contractUrl">点击下载</a>&nbsp;</div></el-col>
          </el-row>
        </div>
        <div class="title"><i class="el-icon-collection-tag"></i><span>产品信息</span></div>
        <el-table
          :data="info.productListOfPurchase"
          border
          show-summary
          :summary-method="getSummaries"
          style="width: 100%">
          <el-table-column
            label="图片"
            align="center">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.mainPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="skuId"
            label="SKU"
            align="center">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="产品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchasePrice"
            label="采购价（元）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchaseAmount"
            label="采购数量（套）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="goodsAmount"
            label="货款总金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="remainArrivalAmount"
            label="剩余到货数"
            align="center">
          </el-table-column>
          <el-table-column
            label="未支付货款（元）"
            align="center">
            --
          </el-table-column>
        </el-table>
        <!-- 审核信息 -->
        <div class="content-header"> <i class="el-icon-collection-tag"></i> 审核信息</div>
        <el-table :data="info.approveList" border style="width: 100%">
          <el-table-column align="center" prop="approveTime" label="审核时间" min-width="230"></el-table-column>
          <el-table-column align="center" prop="approveUserName" label="审核人员" min-width="130"></el-table-column>
          <el-table-column align="center" label="审核结果" min-width="130">
            <template slot-scope="scope">
              <span>{{scope.row.approveResult === 'agree' ? '通过' : scope.row.approveResult === 'disagree' ? '驳回' : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="feedbackReason" label="反馈详情" min-width="540"></el-table-column>
        </el-table>
        <!-- 按键区 -->
        <div class="submit" v-if="doing === 'me'">
          <el-button type="primary" @click="dialogVisible = true" class="submitBtn">立即审批</el-button>
          <el-button class="cancelBtn" @click="backToList">取 消</el-button>
        </div>
      </div>
    </div>
    <!-- 审核弹窗 -->
    <el-dialog title="审核" :visible.sync="dialogVisible" width="45%">
      <el-form :model="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="审核结果：" prop="approveResult">
          <el-radio-group v-model="ruleForm.approveResult">
            <el-radio label="agree">通过</el-radio>
            <el-radio label="disagree">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下一审批人：" prop="nextApproveUserId" v-if="ruleForm.approveResult === 'agree'">
          <el-select filterable v-model="ruleForm.nextApproveUserId" placeholder="选择下一审批人" clearable>
            <el-option v-for="item in peopleList" :key="item.id" :label="item.userName" :value="item.id"></el-option>
          </el-select>
          <div class="hint">不选下一审批人流程将终止并结束审批流程</div>
        </el-form-item>
        <el-form-item label="反馈原因：" prop="feedbackReason">
          <el-input maxlength="100" v-model="ruleForm.feedbackReason" type="textarea" :rows="4" placeholder="请输入反馈原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmApprove">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '审批',
        path: '/F0801/F080101'
      }, {
        name: '审批中心',
        path: '/F0801/F080101'
      }, {
        name: '采购单新增申请',
        path: ''
      }],
      id: '',
      info: {
        purchaseInfo: {},
        productListOfPurchase: [],
        approveList: []
      },
      doing: '',
      dialogVisible: false,
      ruleForm: {
        approveResult: "agree",
        nextApproveUserId: null,
        feedbackReason: ""
      },
      peopleList: [] //下一审批人下拉
    }
  },
  created() {
    this.doing = this.$route.query.doing;
    this.id = this.$route.query.id;
    this.getApprovalInfo();
    this.getPeopleList();
  },
  methods: {
    refreash () {
      location.reload();
    },

    getApprovalInfo() {
      let bussinessNo = this.$route.query.bussinessNo;
      window.axios.get(`/apply/queryApproveInfo4Add/${bussinessNo}`).then((data) => {
        if (data.code !== 0) return

        this.info = data.data;
      })
    },
    getSummaries (param) { // 计算汇总
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        if (index === 1) {
          sums[index] = '共' + data.length + '类SKU';
          return;
        }
        if (index === 2 || index === 3) {
          sums[index] = '';
          return;
        }
        if (index === 4) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].purchaseAmount) {
              sum += parseInt(data[i].purchaseAmount);
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 5) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].goodsAmount) {
              sum += data[i].goodsAmount;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 6) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].remainArrivalAmount) {
              sum += data[i].remainArrivalAmount;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 7) {
          sums[index] = this.info.unpaidAmount;
        }
      });

      return sums;
    },
    backToList() {
      history.go(-1);
    },

    // 下一审批人下拉
    getPeopleList() {
      window.axios.get("/user/queryOtherUserList").then((data) => {
        if (data.code !== 0) return
        this.peopleList = data.data;
      })
    },
    // 确认审核
    confirmApprove() {
      let params = {
        applyId: parseInt(this.id),
        approveResult: this.ruleForm.approveResult,
        nextApproveUserId: this.ruleForm.nextApproveUserId,
        feedbackReason: this.ruleForm.approveResult === "agree" && this.ruleForm.feedbackReason === "" ? "同意" : this.ruleForm.feedbackReason
      }
      window.axios.post("/approve/executeApprove", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("已提交");
        history.go(-1);
      })
    }
  },
};
</script>
<style lang="less" scoped>
.top {
  position: relative;
  .printBtn {
    position: absolute;
    right: 132px;
    top: 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    width: 70px;
    color: #999;
    cursor: pointer;
    border-radius: 4px;
    background-color: white;
    border: 1px solid rgb(228, 228, 228);
  }
}
.printWindow.el-dialog__wrapper {
  /deep/.el-dialog__header {
    height: 54px;
  }
  /deep/.el-dialog__body {
    padding: 0;
    height: calc(90vh - 54px);
    .myIframe {
      width: 100%;
      height: 100%;
    }
  }
}
.approvalPage_wrap {
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
    color: #666;
    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 50px;
      margin-top: 20px;
      span {
        margin-left: 5px;
      }
    }
    .info {
      line-height: 45px;
      border-top: 1px solid rgb(228, 228, 228);
      border-left: 1px solid rgb(228, 228, 228);
      .td {
        border-right: 1px solid rgb(228, 228, 228);
        border-bottom: 1px solid rgb(228, 228, 228);
        box-sizing: border-box;
        padding: 0 10px;
      }
      .label {
        background-color: #f2f2f2;
        text-align: right;
      }
    }
    .content-header {
      color: #666666;
      font-size: 16px;
      font-weight: bold;
      line-height: 58px;
      .el-icon-collection-tag {
        font-size: 18px;
      }
    }
    .table {
      font-size: 14px;
      border-top: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
      margin-bottom: 15px;
      .el-row {
        line-height: 40px;
        .el-col {
          border-bottom: 1px solid #e4e4e4;
          border-right: 1px solid #e4e4e4;
        }
        .bg-grey {
          text-align: right;
          background-color: #f9fafc;
          padding-right: 20px;
        }
        .content {
          padding-left: 10px;
        }
      }
    }
    .submit {
      padding-top: 60px;
      height: 100px;
      .submitBtn,
      .cancelBtn {
        float: right;
        margin-right: 20px;
      }
    }
    
  }
}
.el-dialog__wrapper {
  /deep/.el-dialog {
    .hint {
      font-size: 12px;
      color: #999999;
      margin-top: 6px;
    }
  }
}
</style>