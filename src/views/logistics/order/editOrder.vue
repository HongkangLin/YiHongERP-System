<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="addSupplier">
      <div class="page">
        <div class="left firstLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            基础信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable prdLabel">
            <i class="el-icon-collection-tag"></i>
            产品信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable" :style="'top:' + (form.goods && (form.goods.length * 104 + 650)) + 'px'">
            <i class="el-icon-collection-tag"></i>
            订单规格
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable" :style="'top:' + (form.goods && (form.goods.length * 104 + 840)) + 'px'">
            <i class="el-icon-collection-tag"></i>
            费用信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="info" class="form" :model="form" :rules="rules" label-width="170px">
            <el-form-item label="订单状态：">
              <el-input disabled :value="['未生成', '已生成', '审核中', '待付款', '已完成'][form.status]"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：">
              <el-input disabled :value="form.id"></el-input>
            </el-form-item>
            <el-form-item label="关联出库单号：">
              <el-input disabled :value="form.stockoutOrderId"></el-input>
            </el-form-item>
            <el-form-item label="物流商名称：" prop="expcompId">
              <el-select filterable v-model="form.expcompId" placeholder="请选择物流商">
                <el-option
                  v-for="item in compList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量（件）：">
              <el-input disabled :value="form.totalQuantity"></el-input>
            </el-form-item>
            <el-form-item label="发货日期：">
              <el-input disabled :value="form.deliverDate"></el-input>
            </el-form-item>
            <el-form-item label="运输方式：">
              <el-input disabled :value="['海运', '空运', '快递', '快船', '铁路'][form.deliverMethod]"></el-input>
            </el-form-item>
            <el-form-item label="出库国家：">
              <el-input disabled :value="['美国', '英国', '德国', '日本', '法国'][form.outCountryId]"></el-input>
            </el-form-item>
            <el-form-item label="分区地址：" prop="subzoneWhName">
              <el-select filterable v-model="form.subzoneWhName" placeholder="请选择仓库分区地址">
                <el-option
                  v-for="item in simpList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-table
              :data="form.goods"
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
                <template slot-scope="scope">{{((scope.row.cartonLength * scope.row.cartonWidth * scope.row.cartonHeight)/1000000).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column
                label="总总量(kg)"
                align="center">
                <template slot-scope="scope">{{scope.row.fullLoadWeight * scope.row.quantity}}</template>
              </el-table-column>
            </el-table>
            <div class="spanDiv"></div>
            <el-form-item label="预估计费重（kg）：">
              <el-input disabled :value="weight"></el-input>
            </el-form-item>
            <el-form-item label="预估体积（m³）：">
              <el-input disabled :value="volume"></el-input>
            </el-form-item>
            <el-form-item label="实际计费重（kg）：" prop="realWeight">
              <el-input v-model="form.realWeight" maxlength="100" placeholder="请输入实际计费重"></el-input>
              <div><el-radio v-model="form.transCostType" label="1">设为计费标准</el-radio></div>
            </el-form-item>
            <el-form-item label="实际体积（m³）：" prop="realVolume">
              <el-input v-model="form.realVolume" maxlength="100" placeholder="请输入实际体积"></el-input>
              <div><el-radio v-model="form.transCostType" label="2">设为计费标准</el-radio></div>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item :label="'运费单价' + (form.transCostType === '1' ? '（元/kg）：' : '（元/m³）：')" prop="transCostUnit">
              <el-input v-model="form.transCostUnit" maxlength="100" placeholder="请输入运费单价"></el-input>
            </el-form-item>
            <el-form-item label="运费（元）：">
              <el-input disabled :value="trans"></el-input>
            </el-form-item>
            <el-form-item label="入仓费（元）：" prop="inwareCostAmount">
              <el-input v-model="form.inwareCostAmount" maxlength="100" placeholder="请输入入仓费，可以为0"></el-input>
            </el-form-item>
            <el-form-item label="报关费（元）：" prop="customsClearAmnt">
              <el-input v-model="form.customsClearAmnt" maxlength="100" placeholder="请输入报关费，可以为0"></el-input>
            </el-form-item>
            <el-form-item label="关税（美元）：" prop="customsDutiesAmnt">
              <el-input v-model="form.customsDutiesAmnt" maxlength="100" placeholder="请输入关税，单位随国家变化"></el-input>
            </el-form-item>
            <el-form-item label="汇率：" prop="exchRate">
              <el-input v-model="form.exchRate" maxlength="100" placeholder="请输入人民币与关税货币的汇率"></el-input>
            </el-form-item>
            <el-form-item label="关税（元）：">
              <el-input disabled :value="rate"></el-input>
            </el-form-item>
            <el-form-item label="总运费（元）：">
              <el-input disabled v-model="form.transCostAmount"></el-input>
            </el-form-item>
            <el-form-item label="费用合计（元）：">
              <el-input disabled :value="total"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" maxlength="20" :rows="7" v-model="form.bak" placeholder="请输入备注，20字以内"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="submit">提交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data';
export default {
  data () {
    // var validateNumber = (rule, value, callback) => {
    //   if (!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value))) {
    //     callback(new Error('最多保留输入两位小数'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      loading: false,
      crumbList: [{ // 面包屑
        name: '物流',
        path: '/F0701/F070101'
      }, {
        name: '物流订单',
        path: '/F0701/F070101'
      }, {
        name: '编辑',
        path: ''
      }],
      weight: 0,
      volume: 0,
      compList: [],
      options: provinceAndCityData, // 省市区选择
      simpList: [],
      form: { // form表单
      },
      rules: {
        expcompId: [
          {required: true, message: '请选择物流商', trigger: 'change'}
        ],
        subzoneWhName: [
          {required: true, message: '请选择分区地址', trigger: 'change'}
        ],
        realWeight: [
          {required: true, message: '请输入实际计费重', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        realVolume: [
          {required: true, message: '请输入实际计费体积', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        transCostUnit: [
          {required: true, message: '请输入运费单价', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        inwareCostAmount: [
          {required: true, message: '请输入入仓费', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        customsClearAmnt: [
          {required: true, message: '请输入报关费', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        customsDutiesAmnt: [
          {required: true, message: '请输入关税', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ],
        exchRate: [
          {required: true, message: '请输入汇率', trigger: 'change'},
          // { validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    trans () { // 运费
      let weight = this.form.realWeight || 0;
      let cost = this.form.transCostUnit || 0;
      return (weight * cost).toFixed(2);
    },
    rate () { // 关税
      let customsDutiesAmnt = this.form.customsDutiesAmnt || 0;
      let exchRate = this.form.exchRate || 0;
      return (customsDutiesAmnt * exchRate).toFixed(2);
    },
    total () { // 费用合计
      let transCostAmount = this.form.transCostAmount || 0;
      return parseInt(this.rate + transCostAmount).toFixed(2);
    }
  },
  async mounted () {
    await this.getSimpList();
    await this.getExpcomp();
    this.getLogistics();
  },
  methods: {
    async getSimpList () { // 获取仓库列表
      let data = await window.axios.get(`/warehouse/simpList`);
      this.simpList = data.data;
    },
    async getExpcomp () { // 获取物流商
      let data = await window.axios.post('/express/queryExpressCompanyInfoList', {
        pageSize: 999999,
        pageNum: 1,
        snOrNameKeyword: ''
      });
      this.compList = data.data.list;
    },
    async getLogistics () { // 获取物流订单数据列表
      let data = await window.axios.get(`/express/order/detail/${this.$route.query.id}`);
      data.data.transCostType = data.data.transCostType.toString();
      this.form = data.data;
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
              sum += parseFloat(((data[i].cartonLength * data[i].cartonWidth * data[i].cartonHeight)/1000000).toFixed(2));
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
    submit () { // 提交
      this.loading = true;
      this.$refs['info'].validate((valid) => {
        if (valid) {
          let subzoneId = '';
          for (let i = 0; i < this.simpList.length; i++) {
            if (this.simpList[i].name === this.form.subzoneWhName) {
              subzoneId = this.simpList[i].id;
            }
          }
          let {id, realWeight, transCostType, realVolume, inwareCostAmount, customsDutiesAmnt, transCostUnit, expcompId, exchRate, customsClearAmnt, bak} = {...this.form};
          let param = {
            id,
            realWeight,
            realVolume,
            inwareCostAmount,
            customsDutiesAmnt,
            transCostUnit,
            expcompId,
            exchRate,
            customsClearAmnt,
            subzoneId,
            transCostType,
            bak
          };
          window.axios.post('/express/order/update', param).then(data => {
            this.loading = false;
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              this.$router.replace('/F0701/F070101');
            }
          });
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addSupplier {
  position: relative;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  /deep/.el-step__head.is-success {
    color: #1ABC9C;
    border-color: #1ABC9C;
  }
  /deep/.el-step__head.is-process,/deep/.el-step__head.is-wait  {
    color: rgb(153, 153, 153);
    border-color: rgb(153, 153, 153);
  }
  /deep/.el-step__title.is-success {
    color: #1ABC9C;
  }
  /deep/.el-step__title.is-process,/deep/.el-step__title.is-wait {
    color: rgb(153, 153, 153);
  }
  .page {
    display: flex;
    border: 1px solid rgb(228, 228, 228);
    margin-top: 10px;
    .firstLeft {
      height: 2200px;
    }
    .secondLeft {
      height: 1980px;
    }
    .left {
      position: relative;
      width: 180px;
      border-right: 1px solid rgb(228, 228, 228);
      background-color: #fcfcfc;
      .lable {
        position: relative;
        top: 50px;
        height: 50px;
        line-height: 50px;
        background-color: rgb(153, 153, 153);
        color: white;
        font-size: 16px;
        text-indent: 10px;
        .hexagon {
          width: 60px;
          height: 60px;
          position: absolute;
          top: 0;
          right: -20px;
          color: black;
        }
      }
      .prdLabel {
        top: 520px;
      }
    }
    .right {
      box-sizing: border-box;
      width: calc(100% - 180px);
      padding: 100px;
      /deep/.el-table__row {
        .el-input-number--small {
          width: 100%;
        }
      }
      .form {
        /deep/.el-input--small .el-input__inner {
          width: 194px;
          height: 35px;
          line-height: 35px;
        }
        /deep/.el-input--small .el-textarea__inner {
          width: 400px;
        }
        &.last {
          /deep/.el-input--small .el-textarea__inner {
            width: 550px;
          }
          /deep/.el-input--small .el-input__inner {
            width: 550px;
            height: 35px;
            line-height: 35px;
          }
        }
        .info {
          color: rgb(153, 153, 153)
        }
      }
      .add {
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        background-color: #1ABC9C;
        text-align: center;
        color: white;
        border-radius: 4px;
        width: 100px;
        margin-bottom: 30px;
      }
      .spanDiv {
        height: 50px;
      }
      .curr {
        margin-top: 20px;
        color: #999;
        margin-bottom: 30px;
        .red {
          color: #F04844;
        }
      }
      .next {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        div {
          cursor: pointer;
          margin: 0 10px;
          width: 180px;
          height: 45px;
          line-height: 45px;
          border-radius: 4px;
          color: white;
          background-color: #1ABC9C;
          border: 1px solid #1ABC9C;
          text-align: center;
        }
        .pre {
          background-color: white;
          color: #1ABC9C;
          border: 1px solid #1ABC9C;
        }
        /deep/.el-button--small {
          background-color: #1ABC9C;
          border-color: #1ABC9C;
          width: 180px;
        }
      }
    }
  }
  .addSome {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 30%;
    width: 600px;
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
}
</style>