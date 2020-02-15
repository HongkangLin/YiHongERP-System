<template>
  <div class="viewPrint_wrap">
		<div class="crumbsDiv">
      <div class="crumbs">
        <span class="label"></span>
        <span class="crumbName">付款单打印页</span>
      </div>
      <div class="btns">
        <div class="return" @click="goBack"><i class="el-icon-close"></i> 关闭</div>
        <!-- <div class="return" v-print="'#printMe'"><i class="el-icon-printer"></i> 打印</div> -->
        <div class="return" @click="print"><i class="el-icon-printer"></i> 打印</div>
      </div>
    </div>
    <div class="doc">
      <!-- 打印区 -->
      <div class="printArea" id="printMe">
        <div class="title">物流付款单</div>
        <div class="table row2">
          <el-row>
            <el-col :span="4" class="bg-grey">付款单号</el-col>
            <el-col :span="8" class="content">{{printPageData.payId}}</el-col>
            <el-col :span="4" class="bg-grey">申请日期</el-col>
            <el-col :span="8" class="content">{{printPageData.createTime | timeStr}}</el-col>
          </el-row>
        </div>
        <div class="table row3">
          <el-row>
            <el-col :span="4" class="bg-grey">物流商</el-col>
            <el-col :span="8" class="content">{{printPageData.expcompName}}</el-col>
            <el-col :span="4" class="bg-grey">收款单位</el-col>
            <el-col :span="8" class="content">{{printPageData.accountName}}</el-col>
          </el-row>
        </div>
        <div class="table row3">
          <el-row>
            <el-col :span="4" class="bg-grey">银行账号</el-col>
            <el-col :span="8" class="content">{{printPageData.accountNo}}</el-col>
            <el-col :span="4" class="bg-grey">开户行</el-col>
            <el-col :span="8" class="content">{{printPageData.accountBankName}}</el-col>
          </el-row>
        </div>
        <div class="table row4">
          <el-row>
            <el-col :span="4" class="bg-grey">金额大写</el-col>
            <el-col :span="20" class="content" style="color:red;">{{numToText(String(printPageData.totalAmount))}}</el-col>
          </el-row>
        </div>
        <div class="table row5">
          <el-row>
            <el-col :span="4" class="bg-grey">金额小写</el-col>
            <el-col :span="20" class="content" style="color:red;">¥ {{printPageData.totalAmount}}</el-col>
          </el-row>
        </div>
        <div class="table row6">
          <el-row>
            <el-col :span="4" class="bg-grey">备注</el-col>
            <el-col :span="20" class="content">{{printPageData.bak}}</el-col>
          </el-row>
        </div>
        <el-table :data="printPageData.expordersSimpInfo" border  show-summary :summary-method="getSummaries" :header-cell-style="{color:'#000', borderColor: '#333'}" :cell-style="{borderColor: '#333'}">
          <el-table-column prop="exporderId" label="物流单号" align="center" ></el-table-column>
          <el-table-column prop="totalCostAmount" label="物流总费用（元）" align="center" ></el-table-column>
          <el-table-column prop="paidAmount" label="已支付（元）" align="center" ></el-table-column>
          <el-table-column prop="applyingAmount" label="本次申请费用（元）" align="center" ></el-table-column>
          <el-table-column prop="bak" label="备注" align="center" ></el-table-column>
        </el-table>
        <div class="table last">
          <el-row>
            <el-col :span="3" class="bg-grey">审核人</el-col>
            <el-col :span="3" class="content"></el-col>
            <el-col :span="3" class="bg-grey">经理</el-col>
            <el-col :span="3" class="content"></el-col>
            <el-col :span="3" class="bg-grey">财务</el-col>
            <el-col :span="3" class="content"></el-col>
            <el-col :span="3" class="bg-grey">经办人</el-col>
            <el-col :span="3" class="content">{{printPageData.creatorName}}</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 打印预览弹窗 -->
    <el-dialog :visible.sync="showPrintPreview" width="90%" top="5vh">
      <iframe :src="`/#/F0501/logisticsPrintPreviewPage?payId=${this.$route.query.payId}`" class="myIframe" v-if="showPrintPreview"></iframe>
    </el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      printPageData: {
        financePurchaseDetailList: []
      },

      showPrintPreview: false
    }
  },
  filters: {
    timeStr (str) {
      let date = new Date(str);
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }
  },
  created() {
    this.init();
  },
  methods: {  
    init() {
      window.axios.get(`/express/order/queryPayDetail4Fin/${this.$route.query.payId}`).then((data) => {
        if (data.code !== 0) return
        this.printPageData = data.data;
      })
    },

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
      sums[sums.length - 1] = "";
      return sums;
    },

    // 金额小写转大写
    numToText(money) {
      //汉字的数字
      var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
      //基本单位
      var cnIntRadice = new Array('', '拾', '佰', '仟');
      //对应整数部分扩展单位
      var cnIntUnits = new Array('', '万', '亿', '兆');
      //对应小数部分单位
      var cnDecUnits = new Array('角', '分');
      //整数金额时后面跟的字符
      var cnInteger = '整';
      //整型完以后的单位
      var cnIntLast = '元';
      // 如果为负数
      var cnIntMinus = '负';
      // 负号处理后的数字
      var cash;
      //分离金额后用的数组，预定义
      var parts;
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的中文金额字符串
      var chineseStr = '';

      // 判断空
      if (money == "") {
        return "";
      }
      // 判断正负
      if(money.charAt(0) === "-"){
        chineseStr += cnIntMinus;
        cash = money.slice(1);
      }else{
        cash = money;   
      }
      // 转换为浮点数类型,会自动去掉首尾的0
      cash = parseFloat(cash);
      if (cash == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }

      // 转换为字符串
      cash = cash.toString();
      if (cash.indexOf('.') == -1) {
        integerNum = cash;  //金额整数部分
        decimalNum = ''; //金额小数部分
      } else {
        parts = cash.split(".");
        integerNum = parts[0]; //金额整数部分
        decimalNum = parts[1].substr(0, 2); //金额小数部分
      }

      // 转换整数部分
      if (integerNum != '-' && parseInt(integerNum, 10) > 0) {
        var intLen = integerNum.length;
        var zero = 0; //标记零出现次数
        for (let i = 0; i < intLen; i++) {
          var intChar = integerNum.substr(i, 1);
          var intSlen = intLen - i - 1;
          var divided = intSlen / 4;
          var remain = intSlen % 4;

          if (intChar == "0") {
            zero++;
          } else {
            if (zero > 0) {
              chineseStr += cnNums[0];
            }
            zero = 0;
            chineseStr += cnNums[parseInt(intChar)] + cnIntRadice[remain];
          }
          if (remain === 0 && divided > 0) {
            chineseStr += cnIntUnits[divided];
          }
        }
        chineseStr += cnIntLast; //加上'元'字
      }

      if (decimalNum != ''){ // 小数部分存在时
          var decLen = decimalNum.length;
          for(let i=0; i<decLen; i++){
              var decChar = decimalNum.substr(i,1);
              if(decChar != '0'){
                  chineseStr += cnNums[parseInt(decChar)] + cnDecUnits[i];
              }
              if (decChar == '0' && parseInt(integerNum, 10) > 0){
                  chineseStr += cnNums[parseInt(decChar)] + cnDecUnits[i];
              }
          }
      }else{
          chineseStr += cnInteger;
      }
      return chineseStr;
    },
    // numToText(number) {
    //   let flag = false;
    //   if (number.startsWith("-")) {
    //     flag = true;
    //     number = number.slice(1);
    //   }
    //   let AA = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖')
    //   let BB = new Array('', '拾', '佰', '仟', '萬', '亿')
    //   let reverseStr = number.split('').reverse().join('')
    //   let result = ''
    //   let unit = 0
    //   reverseStr.replace(/\d{1,4}/g, function ($1) {
    //     if (unit !== 0) {
    //       if (unit%2 !== 0) {
    //         $1 = BB[4] + $1
    //       } else {
    //         $1 = BB[5] + $1
    //       }
    //     }
    //     $1 = $1.replace(/\d/g, function (x1, idx) {
    //       if (x1 !== '0') {
    //         let idx1 = (unit > 0) ? (idx-1) : idx
    //         return (BB[idx1] + AA[x1])
    //       } else {
    //         return AA[x1]
    //       }
    //     })
    //     result += $1
    //     unit += 1
    //   })
    //   result = result.replace(/[零]{2,}/g, function (x1) {
    //     return '零'
    //   }).split('').reverse().join('')

    //   result = result.replace(/(零仟)|(零拾)/g, function (x1) {
    //     return ''
    //   }).replace(/(零亿)|(零亿零萬)/g, function (x1) {
    //     return '亿'
    //   }).replace(/(零萬)/g, function (x1) {
    //     return '萬'
    //   }).replace(/零$/, function (x1) {
    //     return ''
    //   })

    //   result += '元整'
    //   if (flag) {
    //     result = '负' + result
    //   }
    //   return result
    // },

    // 打印
    print() {
      // window.print()
      // let win = window.open("");
      // win.location.href = `/#/F0501/printPreviewPage?payId=${this.$route.query.payId}`
      this.showPrintPreview = true;
    },
   
    // 面包屑关闭
    goBack() {
      history.go(-1);
    }
  },
};
</script>
<style lang="less" scoped>
.crumbsDiv {
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(228, 228, 228);
  background-color: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: space-between;
  .crumbs {
    margin-left: 50px;
    display: flex;
    align-items: center;
    .label {
      display: inline-block;
      vertical-align: middle;
      width: 4px;
      height: 17px;
      margin-right: 5px;
      background-color: #1ABC9C;
    }
    .crumbName {
      color: #999999;
    }
  }
  .btns {
    display: flex;
    margin-right: 50px;
    .return {
      margin: 10px 5px;
      vertical-align: middle;
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
}
.doc {
  padding: 20px 50px;
  .title {
    color: #666666;
    font-size: 20px;
    font-weight: bold;
    line-height: 80PX;
    text-align: center;
    border: 1px solid #333;
    border-bottom: none;
  }
  .table {
    &.row2 {
      border-top: 1px solid #333;
    }
    &.row6 {
      .el-row .el-col {
        border-bottom: none;
      }
    }
    font-size: 14px;
    border-left: 1px solid #333;
    .el-row {
      line-height: 45px;
      .el-col {
        height: 45px;
        border-bottom: 1px solid #333;
        border-right: 1px solid #333;
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
  .el-table--border {
    border: 1px solid #333;
  }
  /deep/.el-table__footer-wrapper td {
    border-top: 1px solid #333;
  }
  /deep/.el-table__footer-wrapper tbody td {
    background-color: white;
  }
  /deep/.el-table--border td {
    border-right: 1px solid #333;
  }
}
.el-dialog__wrapper {
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
</style>