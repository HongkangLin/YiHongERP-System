<template>
  <div>
    <div class="crumbsDiv">
      <div class="changeTab">
        <span @click="changeTab(0)" :class="active === 0 ? 'active' : ''">物流单详情</span>
        <span @click="changeTab(1)" :class="active === 1 ? 'active' : ''">付款记录</span>
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
          <el-col :span="4"><div class="td label">订单状态</div></el-col>
          <el-col :span="8"><div class="td">{{['未生成', '已生成', '审核中', '待付款', '已完成'][info.status]}}</div></el-col>
          <el-col :span="4"><div class="td label">订单类型</div></el-col>
          <el-col :span="8"><div class="td">合并订单&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">物流单号</div></el-col>
          <el-col :span="8"><div class="td">{{info.id}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">运单号</div></el-col>
          <el-col :span="8"><div class="td">{{info.deliverSn}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">物流商名称</div></el-col>
          <el-col :span="8"><div class="td">{{info.expcompName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">发货日期</div></el-col>
          <el-col :span="8"><div class="td">{{info.deliverDate}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">运输方式</div></el-col>
          <el-col :span="8"><div class="td">{{deliverMethodList[info.deliverMethod]}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">出库国家</div></el-col>
          <el-col :span="8"><div class="td">{{['美国', '英国', '德国', '日本', '法国'][info.outCountryId]}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">分区地址</div></el-col>
          <el-col :span="8"><div class="td">{{info.subzoneWhName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">发票下载</div></el-col>
          <el-col :span="8"><div class="td">
            <el-button type="text" size="small" @click="downLoad(info.invoiceDownUrl, info.id)">点击下载</el-button>  
          </div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>订单规格</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">预估实重（kg）</div></el-col>
          <el-col :span="8"><div class="td">{{this.weight}}</div></el-col>
          <el-col :span="4"><div class="td label">预估体积（m³）</div></el-col>
          <el-col :span="8"><div class="td">{{this.volume}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">实际计费重（kg）</div></el-col>
          <el-col :span="8"><div class="td">{{info.realWeight}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">实际体积（m³）</div></el-col>
          <el-col :span="8"><div class="td">{{info.realVolume}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>费用信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">运费单价{{parseInt(info.transCostType) === 1 ? '（元/kg）：' : '（元/m³）：'}}</div></el-col>
          <el-col :span="8"><div class="td">{{info.transCostUnit}}</div></el-col>
          <el-col :span="4"><div class="td label">运费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.realWeight * info.transCostUnit).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">入仓费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.inwareCostAmount}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">报关费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.customsClearAmnt}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">其他费用（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.otherAmount}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">{{'关税（' + rateChange[info.customsDutiesCurtype] + '）'}}</div></el-col>
          <el-col :span="8"><div class="td">{{info.customsDutiesAmnt}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">汇率</div></el-col>
          <el-col :span="8"><div class="td">{{info.exchRate}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">关税（元）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.customsDutiesAmnt * info.exchRate).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">总运费（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.transCostAmount}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">费用合计（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.totalCostAmount}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">备注</div></el-col>
          <el-col :span="20"><div class="td">{{info.bak}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>产品信息</span></div>
      <el-table
        :data="info.relatedUnmergedOrders"
        border
        show-summary
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column
          label="物流单号"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="showPdt(scope.row.id)">{{scope.row.id}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockoutOrderSn"
          label="关联出库单"
          align="center">
        </el-table-column>
        <el-table-column
          prop="skuCount"
          label="sku数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalQuantity"
          label="件数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalCount"
          label="本次出库"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalVolume"
          label="总体积（m³）"
          align="center">
        </el-table-column>
        <el-table-column
          prop="totalWeight"
          label="总重量(kg)"
          align="center">
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
    <div class="addSome" v-if="showOrder">
      <div class="title">
        <span>物流订单详情</span>
        <i class="el-icon-close" @click="closeOrder"></i>
      </div>
      <div class="content">
        <el-table
          :data="goods"
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
            prop="brandName"
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
            label="整箱重量(kg)"
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
            label="可用库存"
            align="center">
            <template>--</template>
          </el-table-column>
          <el-table-column
            label="本次出库"
            prop="count"
            align="center">
          </el-table-column>
          <el-table-column
            label="总体积（m³）"
            align="center">
            <template slot-scope="scope">
              {{((scope.row.cartonLength * scope.row.cartonWidth * scope.row.cartonHeight * scope.row.quantity)/1000000).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column
            label="总重量(kg)"
            align="center">
            <template slot-scope="scope">
              {{scope.row.fullLoadWeight * scope.row.quantity}}
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      showOrder: false,
      deliverMethodList: [],
      typeList: ['', '审核中', '驳回', '待付款', '付款完成', '取消'],
      active: 0,
      id: '',
      compList: [],
      info: {},
      payList: [],
      rateChange: ['美元', '欧元', '韩元', '泰铢', '日元'],
      payTotal: 0,
      payPageSize: 10,
      payPageNum: 1,
      goods: [],
      weight: '',
      volume: ''
    };
  },
  async mounted () {
    this.id = this.$route.query.id;
    await this.getExpcomp();
    await this.getDeliverMethodList();
    this.getInfo(); // 获取详情
    this.getPay(); // 获取付款记录
  },
  methods: {
    async downLoad (url, _id) { // 下载发票
      if (!url) {
        let data = await window.axios.post(`/express/order/getInvoiceDownUrl`, {
          id: _id
        });
        url = data.data;
      }
      if (url) {
        location.href = url;
      }
    },
    async showPdt (id) {
      let data = await window.axios.get(`/express/order/goodsDetail/${id}`);
      this.goods = data.data;
      this.showOrder = true;
    },
    closeOrder () {
      this.showOrder = false;
    },
    getDeliverMethodList() {
      window.axios.get(`/transport_type/simpList`).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          let arr = [];
          data.data.forEach(item => {
            arr.push(item.name);
          });
          this.deliverMethodList = arr;
        }
      });
    },
    async getExpcomp () { // 获取物流商
      let data = await window.axios.post('/express/queryExpressCompanyInfoList', {
        pageSize: 999999,
        pageNum: 1,
        snOrNameKeyword: ''
      });
      this.compList = data.data.list;
    },
    async getInfo () { // 获取信息
      let data = await window.axios.get(`/express/order/detail/${this.id}`);
      for (let i = 0; i < this.compList.length; i++) {
        if (this.compList[i].id === data.data.expcompId) {
          data.data.expcompName = this.compList[i].companyName;
        }
      }
      let weight = 0, volume = 0;
      data.data.goods.forEach(item => {
        if (item.cartonLength && item.cartonWidth && item.cartonHeight) {
          volume += parseFloat(((item.cartonLength * item.cartonWidth * item.cartonHeight)/1000000).toFixed(3));
        }
        if (item.fullLoadWeight && item.quantity) {
          weight += item.fullLoadWeight * item.quantity;
        }
      });
      data.data.weight = weight;
      data.data.volume = volume;
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
        if (index === 2) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].skuCount) {
              sum += data[i].skuCount;
            }
          }
          sums[index] = '共' + (sum || 0) + '类SKU';
          return;
        }
        if (index === 1) {
          sums[index] = '';
          return;
        }
        if (index === 3) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].totalQuantity) {
              sum += data[i].totalQuantity;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 4) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].totalCount) {
              sum += data[i].totalCount;
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 5) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].totalVolume) {
              sum += data[i].totalVolume;
            }
          }
          sums[index] = sum.toFixed(2) || 0;
          this.volume = sum.toFixed(2) || 0;
          return;
        }
        if (index === 6) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].totalWeight) {
              sum += data[i].totalWeight;
            }
          }
          sums[index] = sum || 0;
          this.weight = sum || 0;
          return;
        }
      });

      return sums;
    },
    getSummaries1 (param) {
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
        if (index === 10) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].cartonLength && data[i].cartonWidth && data[i].cartonHeight) {
              sum += parseFloat(((data[i].cartonLength * data[i].cartonWidth * data[i].cartonHeight * data[i].quantity)/1000000).toFixed(2));
            }
          }
          this.weight = sum || 0;
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
          this.volume = sum || 0,
          sums[index] = sum || 0;
          return;
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
    goBack () {
      history.go(-1);
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
.addSome {
  position: absolute;
  z-index: 100;
  top: 100px;
  left: calc(~'50% - 500px');
  width: 1000px;
  background-color: white;
  border: 1px solid rgb(228, 228, 228);
  border-radius: 4px;
  -moz-box-shadow:0px 0px 7px rgb(228, 228, 228);
  -webkit-box-shadow:0px 0px 7px rgb(228, 228, 228);
  box-shadow:0px 0px 7px rgb(228, 228, 228);
  .pagin {
    height: 60px;
    position: relative;
    .el-pagination {
      position: absolute;
      top: 20px;
      right: 0;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    line-height: 50px;
    font-size: 16px;
    align-items: center;
    border-bottom: 1px solid rgb(228, 228, 228);
    background-color: rgba(243, 243, 243, 1);
    padding: 0 15px;
    color: #777;
    i {
      cursor: pointer;
    }
  }
  .content {
    box-sizing: border-box;
    padding: 20px;
    .search {
      width: 100px;
      margin-bottom: 10px;
      /deep/.el-input--small .el-input__inner {
        width: 200px;
        height: 35px;
        line-height: 35px;
      }
    }
  }
}
</style>