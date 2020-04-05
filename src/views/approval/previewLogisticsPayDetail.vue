<template>
  <div>
    <div class="approvalPage_wrap" v-if="showHtml" id="sharePicBox">
      <div class="header">物流订单付款申请</div>
      <div class="contentArea">
        <!-- 采购单信息 -->
        <div class="content-header"> <i class="el-icon-collection-tag"></i> 物流订单信息</div>
         <el-table :data="tableData.expordersSimpInfo" border style="width: 100%">
          <el-table-column align="center" prop="exporderId" label="物流单号" min-width="120"></el-table-column>
          <el-table-column align="center" prop="accountName" label="收款单位" min-width="170"></el-table-column>
          <el-table-column align="center" prop="totalQuantity" label="数量（件）" min-width="150"></el-table-column>
          <el-table-column align="center" prop="totalCostAmount" label="物流总费用（元）" min-width="160"></el-table-column>
          <el-table-column align="center" prop="applyingAmount" label="申请中费用（元）" min-width="130"></el-table-column>
          <el-table-column align="center" prop="paidAmount" label="已支付货款（元）" min-width="130"></el-table-column>
          <el-table-column align="center" prop="deliverDate" label="发货日期" min-width="130"></el-table-column>
          <el-table-column align="center" prop="creatorName" label="采购员" min-width="100"></el-table-column>
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
        <el-table :data="tableData.approveList" border style="width: 100%">
          <el-table-column align="center" prop="approveTime" label="审核时间" min-width="230"></el-table-column>
          <el-table-column align="center" prop="approveUserName" label="审核人员" min-width="130"></el-table-column>
          <el-table-column align="center" prop="approveResult" label="审核结果" min-width="130"></el-table-column>
          <el-table-column align="center" prop="feedbackReason" label="反馈详情" min-width="540"></el-table-column>
        </el-table>
        <!-- 按键区 -->
        <div class="submit" v-if="doing === 'me'">
          <el-button type="primary" @click="dialogVisible = true" class="submitBtn">立即审批</el-button>
          <el-button class="cancelBtn" @click="backToList">取 消</el-button>
        </div>
      </div>
    </div>
    <img :src="imgSrc" v-else alt="打印预览" class="previewImg">
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
import  html2canvas  from  'html2canvas'
export default {
  data() {
    return {
      showHtml: true,
      imgSrc: "",
      crumbList: [{ // 面包屑
        name: '审批',
        path: '/F0801/F080101'
      }, {
        name: '审批中心',
        path: '/F0801/F080101'
      }, {
        name: '物流订单付款申请',
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
        {col1: "付款单号", col2: "payId", col3: "收款单位", col4: "accountName"},
        {col1: "收款账号", col2: "accountNo", col3: "备注", col4: "bak"},
        {col1: "本次申请费用（元）", col2: "applyAmount", col3: "总计", col4: "totalAmount"}
      ],

      dialogVisible: false,
      ruleForm: {
        approveResult: "agree",
        nextApproveUserId: null,
        feedbackReason: ""
      },
      peopleList: [], //下一审批人下拉
      showPrintPreview: false
    }
  },
  created() {
    this.doing = this.$route.query.doing;
    this.id = this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      let bussinessNo = this.$route.query.bussinessNo;
      let _this = this;
      axios.all([
        axios.get(`/express/order/queryPayApproveDetail/${bussinessNo}`),
        axios.get("/user/queryOtherUserList")
      ])
      .then(axios.spread(function (approvalInfoData, peopleListData) {
        _this.getApprovalInfo(approvalInfoData.data);
        _this.peopleList = peopleListData.data;
        _this.$nextTick(() => {
          _this.convertToImg();
        })
      }));
    },
    getApprovalInfo(obj) {
      // 审核详情-审核结果
      obj.approveList.map((item) => {
        if (item.approveResult === "agree") {
          item.approveResult = "通过"
        } else if (item.approveResult === "disagree") {
          item.approveResult = "驳回"
        }
      })
      this.tableData = obj;
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
    },
    convertToImg() {
      let htmlDom = document.querySelector('#sharePicBox')
      html2canvas( htmlDom , {
        allowTaint: false,   
        taintTest: true,    
        useCORS: true,      
        background: "#fff",
      }).then((canvas) => {
        //将图片转为base64
        let imgBlob = canvas.toDataURL( 'image/jpeg', 1.0 );
        // console.log(imgBlob);
        this.imgSrc = imgBlob;
        this.showHtml = false;
        setTimeout(() => {
          window.print();
        }, 100);
      })
    }
  },
};
</script>
<style lang="less" scoped>
.previewImg {
  width: 100%;
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