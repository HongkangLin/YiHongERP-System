<template>
  <div class="doc">
    <!-- 打印区 -->
    <div class="printArea" v-if="showHtml" id="sharePicBox">
      <div class="title">采购付款单</div>
      <div class="table row2">
        <el-row>
          <el-col :span="4" class="bg-grey">付款单号</el-col>
          <el-col :span="8" class="content">{{printPageData.id}}</el-col>
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
          <el-col :span="20" class="content">{{amount_word}}</el-col>
        </el-row>
      </div>
      <div class="table row5">
        <el-row>
          <el-col :span="4" class="bg-grey">金额小写</el-col>
          <el-col :span="20" class="content">¥ {{amount_num}}</el-col>
        </el-row>
      </div>
      <div class="table row6">
        <el-row>
          <el-col :span="4" class="bg-grey">备注</el-col>
          <el-col :span="20" class="content">这里是备注内容</el-col>
        </el-row>
      </div>
      <el-table :data="printPageData.financePurchaseDetailList" border  show-summary :summary-method="getSummaries">
        <el-table-column prop="id" label="采购单号" align="center" ></el-table-column>
        <el-table-column prop="goodsAmount" label="货款总金额（元）" align="center" ></el-table-column>
        <el-table-column prop="paidAmount" label="已支付货款（元）" align="center" ></el-table-column>
        <el-table-column prop="unpaidAmount" label="未支付货款（元）" align="center" ></el-table-column>
        <el-table-column prop="applyingAmount" label="本次申请货款（元）" align="center" ></el-table-column>
        <el-table-column prop="transportFee" label="运费（元）" align="center" ></el-table-column>
        <el-table-column prop="otherFee" label="其它费用（元）" align="center" ></el-table-column>
        <el-table-column prop="bak" label="备注" align="center" ></el-table-column>
      </el-table>
      <div class="table last">
        <el-row>
          <el-col :span="3" class="bg-grey">审核人</el-col>
          <el-col :span="5" class="content"></el-col>
          <el-col :span="3" class="bg-grey">经理</el-col>
          <el-col :span="5" class="content"></el-col>
          <el-col :span="3" class="bg-grey">财务</el-col>
          <el-col :span="5" class="content"></el-col>
        </el-row>
      </div>
    </div>
    <img :src="imgSrc" v-else alt="打印预览" class="previewImg">
  </div>
</template>

<script>
import  html2canvas  from  'html2canvas'
export default {
  data() {
    return {
      showHtml: true,
      imgSrc: "",
      printPageData: {
        financePurchaseDetailList: []
      },
      amount_num: 0,
      amount_word: ""
    }
  },
  created() {
    this.init();
  },
  methods: {  
    init() {
      window.axios.get(`/finance/queryPurchasePayDetail/${this.$route.query.payId}`).then((data) => {
        if (data.code !== 0) return
        // console.log(data.data);
        this.printPageData = data.data;
        this.$nextTick(() => {
          // window.print();
          this.convertToImg();
        })
      })
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
        this.$nextTick(() => {
          window.print();
        })
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
      // console.log("sums: ", sums);
      let num = Number(sums[4]) + Number(sums[5]) + Number(sums[6]);
      this.amount_num = num.toFixed(2);
      this.amount_word = this.numToText(String(num));
      sums[sums.length - 1] = "";
      return sums;
    },

    // 金额小写转大写
    numToText(number) {
      let AA = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖')
      let BB = new Array('', '拾', '佰', '仟', '萬', '亿')
      let reverseStr = number.split('').reverse().join('')
      let result = ''
      let unit = 0
      reverseStr.replace(/\d{1,4}/g, function ($1) {
        if (unit !== 0) {
          if (unit%2 !== 0) {
            $1 = BB[4] + $1
          } else {
            $1 = BB[5] + $1
          }
        }
        $1 = $1.replace(/\d/g, function (x1, idx) {
          if (x1 !== '0') {
            let idx1 = (unit > 0) ? (idx-1) : idx
            return (BB[idx1] + AA[x1])
          } else {
            return AA[x1]
          }
        })
        result += $1
        unit += 1
      })
      result = result.replace(/[零]{2,}/g, function (x1) {
        return '零'
      }).split('').reverse().join('')

      result = result.replace(/(零仟)|(零拾)/g, function (x1) {
        return ''
      }).replace(/(零亿)|(零亿零萬)/g, function (x1) {
        return '亿'
      }).replace(/(零萬)/g, function (x1) {
        return '萬'
      }).replace(/零$/, function (x1) {
        return ''
      })

      result += '元整'
      return result
    }
  },
};
</script>
<style lang="less" scoped>
.doc {
  padding: 20px 50px;
  .previewImg {
    width: 100%;
  }
  .title {
    color: #666666;
    font-size: 20px;
    font-weight: bold;
    line-height: 80PX;
    text-align: center;
    border: 1px solid #e4e4e4;
    border-bottom: none;
  }
  .table {
    &.row2 {
      border-top: 1px solid #e4e4e4;
    }
    &.row6 {
      .el-row .el-col {
        border-bottom: none;
      }
    }
    font-size: 14px;
    border-left: 1px solid #e4e4e4;
    .el-row {
      line-height: 45px;
      .el-col {
        height: 45px;
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
}
</style>