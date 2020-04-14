<template>
  <div>
    <div class="crumbsDiv">
      <div class="changeTab">
        <span @click="changeTab(0)" :class="active === 0 ? 'active' : ''">采购单详情</span>
        <span @click="changeTab(1)" :class="active === 1 ? 'active' : ''">入库记录</span>
        <span @click="changeTab(2)" :class="active === 2 ? 'active' : ''">付款记录</span>
      </div>
      <div class="tool">
        <span @click="refreash"><i class="el-icon-refresh"></i>&nbsp;刷新</span>
        <span @click="goBack"><i class="el-icon-arrow-left"></i>&nbsp;返回</span>
      </div>
    </div>
    <div class="supplierDetail" v-if="active === 0">
      <div class="title"><i class="el-icon-collection-tag"></i><span>基础信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">采购单号</div></el-col>
          <el-col :span="8"><div class="td">{{id}}</div></el-col>
          <el-col :span="4"><div class="td label">供应商</div></el-col>
          <el-col :span="8"><div class="td">{{info.supplierName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">供应商编号</div></el-col>
          <el-col :span="8"><div class="td">{{info.supplierSn}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">采购员</div></el-col>
          <el-col :span="8"><div class="td">{{info.purchaseUserName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">仓库</div></el-col>
          <el-col :span="8"><div class="td">{{info.warehouseName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">预计交期</div></el-col>
          <el-col :span="8"><div class="td">{{info.expectDueTime}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">备注</div></el-col>
          <el-col :span="8"><div class="td"><a>{{info.bak}}</a>&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">合同</div></el-col>
          <el-col :span="8"><div class="td"><a target="_black" :href="info.contractUrl">点击下载</a>&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>产品信息</span></div>
      <el-table
        :data="info.productList"
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
      <div class="spanDiv"></div>
    </div>
    <div class="pdt" v-if="active === 1">
      <div class="title">
        <i class="el-icon-s-operation"></i>数据列表
      </div>
      <el-table
        :data="checkinList"
        key="checkin"
        border
        style="width: 100%">
        <el-table-column
          prop="checkinTime"
          label="入库时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sku"
          label="SKU"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="产品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="checkinCount"
          label="入库数量（套）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="checkinId"
          label="入库单号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="checkinUserName"
          label="操作人"
          align="center">
        </el-table-column>
      </el-table>
      <div class="splitPage"><pageination :pageNum="checkinPageNum" :total="checkinTotal" :pageSize="checkinPageSize" @changePageSize="changeCheckinPageSize" @changePageNum="changeCheckinNum"></pageination></div>
    </div>
    <div class="pdt" v-if="active === 2">
      <div class="title">
        <i class="el-icon-s-operation"></i>数据列表
      </div>
      <el-table
        :data="payList"
        key="pay"
        border
        style="width: 100%">
        <el-table-column
          prop="payId"
          label="付款单号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="applyAmount"
          label="本次申请货款（元）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="taxFee"
          label="税金"
          align="center">
        </el-table-column>
        <el-table-column
          prop="transportFee"
          label="运费（元）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="otherFee"
          label="其它费用（元）"
          align="center">
        </el-table-column>
        <el-table-column
          label="付款单状态"
          align="center">
          <template slot-scope="scope">
            <div>{{typeList[scope.row.payStatus]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="payTime"
          label="付款时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="applyUserName"
          label="申请人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bak"
          label="备注"
          align="center">
        </el-table-column>
      </el-table>
      <div class="splitPage"><pageination :pageNum="payPageNum" :total="payTotal" :pageSize="payPageSize" @changePageSize="changePayPageSize" @changePageNum="changePayNum"></pageination></div>
    </div>
  </div>
</template>

<script>
import pageination from '#/pagination/pagination.vue';
export default {
  components: {
    'pageination': pageination
  },
  data () {
    return {
      typeList: ['', '审核中', '驳回', '待付款', '付款完成', '取消'],
      active: 0,
      id: '',
      info: {},
      checkinList: [],
      checkinTotal: 0,
      checkinPageSize: 10,
      checkinPageNum: 1,
      payList: [],
      payTotal: 0,
      payPageSize: 10,
      payPageNum: 1
    };
  },
  async mounted () {
    this.id = this.$route.query.purchaseId;
    this.getInfo(); // 获取详情
    this.getCheckin(); // 获取入库记录
    this.getPay(); // 获取付款记录
  },
  methods: {
    async getInfo () { // 获取信息
      let data = await window.axios.get(`/purchase/queryPurchaseDetail/${this.id}`);
      this.info = data.data;
    },
    async getCheckin () { // 获取入库记录
      let data = await window.axios.post('/purchase/queryCheckinRecord4Purchase', {
        purchaseId: this.id,
        pageNum: this.checkinPageNum,
        pageSize: this.checkinPageSize
      });
      this.checkinTotal = data.data.total;
      this.checkinList = data.data.list;
    },
    changeCheckinPageSize (num) { // 改变每页条数
      this.checkinPageNum = 1;
      this.checkinPageSize = num;
      this.getCheckin();
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
    changeCheckinNum (num) { // 改变页码
      this.checkinPageNum = num;
      this.getCheckin();
    },
    async getPay () { // 获取付款记录
      let data = await window.axios.post('/purchase/queryPayRecord4Purchase', {
        purchaseId: this.id,
        pageNum: this.payPageNum,
        pageSize: this.payPageSize
      });
      this.payTotal = data.data.total;
      this.payList = data.data.list;
    },
    changePayPageSize (num) { // 改变每页条数
      this.payPageNum = 1;
      this.payPageSize = num;
      this.getPay();
    },
    changePayNum (num) { // 改变页码
      this.payPageNum = num;
      this.getPay();
    },
    changeTab (idx) { // 改变tab
      this.active = idx;
    },
    refreash () {
      location.reload();
    },
    goBack () { // 返回
      history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.img {
  width: 100px;
  height: 100px;
}
.crumbsDiv {
  position: fixed;
  z-index: 10;
  width: calc(100% - 64px);
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(228, 228, 228);
  background-color: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgb(228, 228, 228);
    padding: 0 10px;
    border-radius: 3px;
    color: #666;
    background-color: white;
    cursor: pointer;
  }
  .changeTab {
    span {
      margin-right: 10px;
    }
    span.active {
      background-color: #1ABC9C;
      color: white;
      border: 1px solid #1ABC9C;
    }
  }
  .tool {
    span {
      margin-left: 10px;
    }
  }
}
.supplierDetail {
  box-sizing: border-box;
  margin: 70px 50px 20px;
  border: 1px solid rgb(228, 228, 228);
  padding: 0 30px;
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
  .spanDiv {
    width: 100%;
    height: 30px;
  }
}
.pdt {
  box-sizing: border-box;
  margin: 70px 50px 20px;
  color: #666;
  .title {
    height: 50px;
    line-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    background-color: rgba(243, 243, 243, 1);
    text-indent: 10px;
  }
  .imgDiv {
    width: 100%;
    border: 1px solid rgb(228, 228, 228);
    padding: 20px;
    > img {
      display: inline-block;
      margin-right: 10px;
      width: 100px;
      height: 100px;
      cursor: pointer;
    }
  }
}
</style>