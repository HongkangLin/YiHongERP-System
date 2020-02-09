<template>
  <div>
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList"></crumbs>
    <div class="approvalPage_wrap">
      <div class="header">付款审批</div>
      <div class="contentArea">
        <!-- 采购单信息 -->
        <div class="content-header"> <i class="el-icon-collection-tag"></i> 采购单信息</div>
         <el-table :data="tableData.financePurchaseDetailList" border style="width: 100%">
          <el-table-column align="center" prop="id" label="采购单号" min-width="120"></el-table-column>
          <el-table-column align="center" prop="supplierName" label="收款单位" min-width="170"></el-table-column>
          <el-table-column align="center" prop="skucount" label="SKU数量" min-width="150"></el-table-column>
          <el-table-column align="center" prop="goodsAmount" label="货款总金额（元）" min-width="160"></el-table-column>
          <el-table-column align="center" prop="paidAmount" label="已支付货款（元）" min-width="130"></el-table-column>
          <el-table-column align="center" prop="purchaseStatus" label="状态" min-width="100"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建日期" min-width="130"></el-table-column>
          <el-table-column align="center" prop="purchaseName" label="采购员" min-width="100"></el-table-column>
        </el-table>
        <!-- 付款单信息 -->
        <div class="content-header"> <i class="el-icon-collection-tag"></i> 付款单信息</div>
         <section class="table">
          <el-row v-for="(item, index) in table1List" :key="index" type="flex" align="stretch">
            <el-col :span="4" class="bg-grey">{{item.col1}}</el-col>
            <el-col :span="8"><div class="content">{{tableData[item.col2]}}</div></el-col>
            <el-col :span="4" class="bg-grey">{{item.col3}}</el-col>
            <el-col :span="8"><div class="content">{{tableData[item.col4]}}</div></el-col>
          </el-row>
        </section>
        <!-- 审核详情 -->
        <div class="content-header"> <i class="el-icon-collection-tag"></i> 审核详情</div>
        <el-table :data="tableData.purPayApproveRecordList" border style="width: 100%">
          <el-table-column align="center" prop="approveTime" label="审核时间" min-width="230"></el-table-column>
          <el-table-column align="center" prop="approverName" label="审核人员" min-width="130"></el-table-column>
          <el-table-column align="center" prop="approveStatus" label="审核结果" min-width="130"></el-table-column>
          <el-table-column align="center" prop="feedback" label="反馈详情" min-width="540"></el-table-column>
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
        name: '采购单付款申请',
        path: ''
      }],
      id: '',
      doing: '',
      tableData: {
        financePurchaseDetailList: [],
        purPayApproveRecordList: []
      }, 
      
      //付款单信息
      table1List: [
        {col1: "付款单号", col2: "id", col3: "收款单位", col4: "supplierName"},
        {col1: "收款账号", col2: "accountNo", col3: "备注", col4: "bak"},
        {col1: "本次申请货款（元）", col2: "applyAmount", col3: "运费（元）", col4: "transportFee"},
        {col1: "其它（元）", col2: "otherFee", col3: "总计", col4: "calTotal"},
      ],

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
    getApprovalInfo() {
      let bussinessNo = this.$route.query.bussinessNo;
      window.axios.get(`/finance/queryPayApproveDetail/${bussinessNo}`).then((data) => {
        if (data.code !== 0) return

        let obj = data.data;
        obj.financePurchaseDetailList.map((item) => {
          // 采购状态
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
          }
        })
        obj.calTotal = obj.applyAmount + obj.transportFee + obj.otherFee;
        // 审核结果
        obj.purPayApproveRecordList.map((item) => {
          if (item.approveStatus === 1) {
            item.approveStatus = "同意"
          } else if (item.approveStatus === 2) {
            item.approveStatus = "驳回"
          }
        })
        this.tableData = obj;
      })
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
    },

    backToList() {
      history.go(-1);
    }
  },
};
</script>
<style lang="less" scoped>
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