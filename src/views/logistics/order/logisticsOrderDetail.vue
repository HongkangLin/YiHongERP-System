<template>
  <div>
    <div class="crumbsDiv">
      <div class="changeTab">
        <span @click="changeTab(0)" :class="active === 0 ? 'active' : ''">物流单详情</span>
        <span @click="changeTab(1)" :class="active === 1 ? 'active' : ''">付款记录</span>
      </div>
      <div class="tool">
        <span @click="refreash"><i class="el-icon-refresh"></i>&nbsp;刷新</span>
        <!-- <span @click="goBack"><i class="el-icon-arrow-left"></i>&nbsp;返回</span> -->
      </div>
    </div>
    <div class="supplierDetail" v-if="active === 0">
      <div class="title"><i class="el-icon-collection-tag"></i><span>基础信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">订单状态</div></el-col>
          <el-col :span="8"><div class="td">{{['未生成', '已生成', '审核中', '待付款', '已完成'][info.status]}}</div></el-col>
          <el-col :span="4"><div class="td label">物流单号</div></el-col>
          <el-col :span="8"><div class="td">{{info.id}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">关联出库单号</div></el-col>
          <el-col :span="8"><div class="td">{{info.stockoutOrderId}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">物流商名称</div></el-col>
          <el-col :span="8"><div class="td">{{info.expcompId}}？&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">数量（件）</div></el-col>
          <el-col :span="8"><div class="td">{{info.totalQuantity}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">发货日期</div></el-col>
          <el-col :span="8"><div class="td">{{info.deliverDate}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">运输方式</div></el-col>
          <el-col :span="8"><div class="td">{{info.deliverMethod}}?&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">出库国家</div></el-col>
          <el-col :span="8"><div class="td">{{info.outCountryId}}?&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">分区地址</div></el-col>
          <el-col :span="8"><div class="td">?&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">&nbsp;</div></el-col>
          <el-col :span="8"><div class="td">&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>订单规格</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">预估计费重（g）</div></el-col>
          <el-col :span="8"><div class="td">{{info.realWeight}}?</div></el-col>
          <el-col :span="4"><div class="td label">预估体积（m³）</div></el-col>
          <el-col :span="8"><div class="td">{{info.realVolume}}?&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">实际计费重</div></el-col>
          <el-col :span="8"><div class="td">{{info.realWeight}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">实际体积（m³）</div></el-col>
          <el-col :span="8"><div class="td">{{info.realVolume}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>费用信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">运费单价（元/g）</div></el-col>
          <el-col :span="8"><div class="td">{{info.transCostUnit}}</div></el-col>
          <el-col :span="4"><div class="td label">运费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.transCostAmount}}?&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">入仓费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.inwareCostAmount}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">报关费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.customsClearAmnt}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">关税（美元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.customsDutiesAmnt}}?&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">汇率</div></el-col>
          <el-col :span="8"><div class="td">{{info.exchRate}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">关税（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.customsDutiesAmnt}}?&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">总运费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.transCostAmount}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">费用合计（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.totalCostAmount}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">备注</div></el-col>
          <el-col :span="8"><div class="td">{{info.bak}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>产品信息</span></div>
      <el-table
        :data="info.goods"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          label="图片"
          align="center">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.goodsPicUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsId"
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
          prop="purchasePrice"
          label="外箱尺寸(cm)"
          align="center">
          <template slot-scope="scope">
            {{scope.row.cartonLength + '*' + scope.row.cartonWidth + '*' + scope.row.cartonHeight}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fullLoadWeight"
          label="整箱重量(g)"
          align="center">
        </el-table-column>
        <el-table-column
          prop="fullLoadQuantity"
          label="装箱数（套/箱）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="件数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remainArrivalAmount"
          label="可用库存"
          align="center">
        </el-table-column>
        <el-table-column
          label="本次出库"
          prop="count"
          align="center">
        </el-table-column>
        <el-table-column
          label="总体积"
          align="center">
          --
        </el-table-column>
        <el-table-column
          label="总重量(g)"
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
          label="本次申请费用（元）"
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
          label="申请时间"
          align="center">
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
      payList: [],
      payTotal: 0,
      payPageSize: 10,
      payPageNum: 1
    };
  },
  async mounted () {
    this.id = this.$route.query.id;
    this.getInfo(); // 获取详情
    this.getPay(); // 获取付款记录
  },
  methods: {
    async getInfo () { // 获取信息
      let data = await window.axios.get(`/express/order/detail/${this.id}`);
      this.info = data.data;
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
    async getPay () { // 获取付款记录
      let data = await window.axios.get(`/express/order/queryPayDetail4Exporder?id=${this.id}&pageNum=${this.payPageNum}&pageSize=${this.payPageSize}`);
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