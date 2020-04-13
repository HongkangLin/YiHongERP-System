<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addConst">
      <div class="page">
        <div class="left secondLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            基础信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable moneyLabel">
            <i class="el-icon-collection-tag"></i>
            规格信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable compLabel">
            <i class="el-icon-collection-tag"></i>
            费用信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable ruleLabel">
            <i class="el-icon-collection-tag"></i>
            销售信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="form" class="form" :model="form" :rules="rules" label-width="220px">
            <el-form-item label="SKU：">
              <el-input maxlength="100" v-model="form.skuId" placeholder="请输入SKU"></el-input>
            </el-form-item>
            <el-form-item label="核算编号：">
              <el-input maxlength="100" disabled v-model="form.accountCostId" placeholder="提交后自动生成"></el-input>
            </el-form-item>
            <el-form-item label="产品名称：">
              <el-input maxlength="100" v-model="form.goodsName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="产品图片：">
              <el-upload
                action="/erp/file/upload"
                list-type="picture-card"
                :headers="{'x-token': token}"
                accept=".jpg, .png"
                :limit="1"
                :file-list="form.mainPicUrl"
                :on-exceed="() => {this.$message.warning('上传失败，只能上传一张图片哦～')}"
                :before-upload="checkSize"
                :on-error="() => {this.$message.error('上传失败')}"
                :on-success="up"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                <div class="info" slot="tip">只能上传jpg/png格式文件，文件不能超过2M</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="产品包装尺寸（cm）：" class="inline" prop="goodsLength">
              <el-input min="0" type="number" @blur="() => {if (this.form.goodsLength < 0) {this.form.goodsLength = 0} else if (this.form.goodsLength > 99999) {this.form.goodsLength = 99999}}" v-model="form.goodsLength" placeholder="长"></el-input>
              <el-input min="0" type="number" @blur="() => {if (this.form.goodsWide < 0) {this.form.goodsWide = 0} else if (this.form.goodsWide > 99999) {this.form.goodsWide = 99999}}" v-model="form.goodsWide" class="leftSpan" placeholder="宽"></el-input>
              <el-input min="0" type="number" @blur="() => {if (this.form.goodsHigh < 0) {this.form.goodsHigh = 0} else if (this.form.goodsHigh > 99999) {this.form.goodsHigh = 99999}}" v-model="form.goodsHigh" class="leftSpan" placeholder="高"></el-input>
            </el-form-item>
            <el-form-item label="产品包装尺寸（in）：" class="inline">
              <el-input disabled v-model="goodsLengthInch" placeholder="-"></el-input>
              <el-input disabled v-model="goodsWideInch" class="leftSpan" placeholder="-"></el-input>
              <el-input disabled v-model="goodsHighInch" class="leftSpan" placeholder="-"></el-input>
            </el-form-item>
            <el-form-item label="单个产品重量：" class="inline" prop="goodsWeight">
              <el-input min="0" type="number" @blur="() => {if (this.form.goodsWeight < 0) {this.form.goodsWeight = 0} else if (this.form.goodsWeight > 1000000000) {this.form.goodsWeight = 1000000000}}" v-model="form.goodsWeight" placeholder="">
                <template slot="append">g</template>
              </el-input>
              <el-input disabled v-model="goodsWeightPound" type="number" class="leftSpan" placeholder="-">
                <template slot="append">lb</template>
              </el-input>
            </el-form-item>
            <el-form-item label="亚马逊计费体积重（lb）：">
              <el-input maxlength="100" disabled v-model="goodsVolumeInch" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="FBA出库实际重量（lb）：">
              <el-input maxlength="100" disabled v-model="goodsActualWeight" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="空运体积重（g）：">
              <el-input maxlength="100" disabled v-model="airTransportWeight" placeholder="--"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item class="append" label="海运单价：" prop="shippingUnitPrice">
              <el-input min="0" type="number" @blur="() => {if (this.form.shippingUnitPrice < 0) {this.form.shippingUnitPrice = 0} else if (this.form.shippingUnitPrice > 1000000000) {this.form.shippingUnitPrice = 1000000000}}" v-model="form.shippingUnitPrice" placeholder="">
                <template slot="append">¥/m³</template>
              </el-input>
            </el-form-item>
            <el-form-item class="append" label="空运单价：" prop="airTransportUnitPrice">
              <el-input min="0" type="number" @blur="() => {if (this.form.airTransportUnitPrice < 0) {this.form.airTransportUnitPrice = 0} else if (this.form.airTransportUnitPrice > 1000000000) {this.form.airTransportUnitPrice = 1000000000}}" v-model="form.airTransportUnitPrice" placeholder="">
                <template slot="append">¥/kg</template>
              </el-input>
            </el-form-item>
            <el-form-item label="海运费（$）：">
              <el-input maxlength="100" disabled v-model="shippingCost" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="空运费（$）：">
              <el-input maxlength="100" disabled v-model="airTransportCost" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="FBA费（$）：">
              <el-input maxlength="100" disabled v-model="goodsFbaFee" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="采购成本（¥）：" prop="purchaseCostRmb">
              <el-input maxlength="100" v-model="form.purchaseCostRmb" placeholder="请输入采购成本"></el-input>
            </el-form-item>
            <el-form-item label="汇率：" prop="exchangeRate">
              <el-input maxlength="100" v-model="form.exchangeRate" placeholder="请输入汇率"></el-input>
            </el-form-item>
            <el-form-item label="采购成本（$）：">
              <el-input maxlength="100" disabled v-model="purchaseCostDollar" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="30%利润售价（$）：" class="inline">
              <el-input min="0" disabled type="number" v-model="profitSellingPriceAir" placeholder="-">
                <template slot="append">空运</template>
              </el-input>
              <el-input disabled v-model="profitSellingPriceShip" type="number" class="leftSpan" placeholder="-">
                <template slot="append">海运</template>
              </el-input>
            </el-form-item>
            <el-form-item label="当前售价（$）：" prop="currentSellingPrice">
              <el-input maxlength="100" v-model="form.currentSellingPrice" placeholder="请输入指定售价"></el-input>
            </el-form-item>
            <el-form-item label="利润率：" class="inline">
              <el-input min="0" disabled type="number" v-model="profitRateAir" placeholder="-">
                <template slot="append">空运</template>
              </el-input>
              <el-input disabled v-model="profitRateShip" type="number" class="leftSpan" placeholder="-">
                <template slot="append">海运</template>
              </el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="目标售价（$）：">
              <el-input maxlength="100" v-model="form.goodsGoalPrice" placeholder="请输入目标售价"></el-input>
            </el-form-item>
            <el-form-item label="比价链接：">
              <el-input maxlength="100" v-model="form.goodsUrlCompare" placeholder="请输入比价链接"></el-input>
            </el-form-item>
            <el-form-item label="竞品价格（$）：">
              <el-input maxlength="100" v-model="form.goodsComparePrice" placeholder="请输入竞品价格"></el-input>
            </el-form-item>
            <el-form-item label="下单数量（套）：">
              <el-input maxlength="100" v-model="form.orderQuantity" placeholder="请输入下单数量"></el-input>
            </el-form-item>
            <el-form-item label="采购总金额（¥）：">
              <el-input maxlength="100" disabled v-model="purchaseAmountSum" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="营业额（$）：">
              <el-input maxlength="100" disabled v-model="turnoverSum" placeholder="--"></el-input>
            </el-form-item>
            <el-form-item label="是否销售：">
              <el-switch
                v-model="form.salesFlag"
                active-color="#1ABC9C"
                active-text="是"
                inactive-text="否"
                inactive-color="#ccc">
              </el-switch>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input maxlength="100" type="textarea" :rows="7" v-model="form.bak" placeholder="请输入备注，200字以内"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="submit">保存</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      token: localStorage.getItem('token'),
      id: '',
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060103'
      }, {
        name: '成本核算',
        path: '/F0601/F060103'
      }, {
        name: '成本计算器',
        path: ''
      }],
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
        skuId: '',
        accountCostId: '',
        goodsName: '',
        mainPicUrl: [],
        goodsLength: '',
        goodsWide: '',
        goodsHigh: '',
        goodsWeight: '',
        shippingUnitPrice: 1300,
        airTransportUnitPrice: 25,
        purchaseCostRmb: '',
        exchangeRate: '',
        currentSellingPrice: '',
        goodsGoalPrice: '',
        goodsUrlCompare: '',
        goodsComparePrice: '',
        orderQuantity: '',
        salesFlag: false,
        bak: ''
      },
      rules: {
        goodsLength: [
          {required: true, message: '请输入产品包装尺寸', trigger: 'blur'}
        ],
        goodsWeight: [
          {required: true, message: '请输入单个产品重量', trigger: 'blur'}
        ],
        shippingUnitPrice: [
          {required: true, message: '请输入海运单价', trigger: 'blur'}
        ],
        airTransportUnitPrice: [
          {required: true, message: '请输入空运单价', trigger: 'blur'}
        ],
        purchaseCostRmb: [
          {required: true, message: '请输入采购成本', trigger: 'blur'}
        ],
        exchangeRate: [
          {required: true, message: '请输入汇率', trigger: 'blur'}
        ],
        currentSellingPrice: [
          {required: true, message: '请输入当前售价', trigger: 'blur'}
        ]
      },
    };
  },
  computed: {
    goodsLengthInch () { // 包装尺寸英寸长
      return this.form.goodsLength ? (this.form.goodsLength * 0.39).toFixed(2) : '-';
    },
    goodsWideInch () { // 包装尺寸英寸宽
      return this.form.goodsWide ? (this.form.goodsWide * 0.39).toFixed(2) : '-';
    },
    goodsHighInch () { // 包装尺寸英寸高
      return this.form.goodsHigh ? (this.form.goodsHigh * 0.39).toFixed(2) : '-';
    },
    goodsWeightPound () { // 单个产品重量磅
      return this.form.goodsWeight ? (this.form.goodsWeight * 0.0022026).toFixed(2) : '-';
    },
    goodsVolumeInch () { // 亚马逊计费重
      let lang = this.goodsLengthInch !== '-' ? parseFloat(this.goodsLengthInch) : 0;
      let wide = this.goodsWideInch !== '-' ? parseFloat(this.goodsWideInch) : 0;
      let high = this.goodsHighInch !== '-' ? parseFloat(this.goodsHighInch) : 0;
      if (this.goodsLengthInch === '-' || this.goodsWideInch === '-' || this.goodsHighInch === '-') {
        return '--';
      }
      return (((lang * wide * high) / 139) + 0.25).toFixed(2);
    },
    goodsActualWeight () { // FBA实际重量
      let weight = this.goodsWeightPound !== '-' ? parseFloat(this.goodsWeightPound) : 0;
      if (this.goodsWeightPound === '-') {
        return '--';
      }
      return weight + 0.25;
    },
    airTransportWeight () { // 空运体积
      let lang = this.form.goodsLength || 0;
      let wide = this.form.goodsWide || 0;
      let high = this.form.goodsHigh || 0;
      if (lang === 0 || wide === 0 || high === 0) {
        return '--';
      }
      return (((lang * wide * high) / 6000) * 1000).toFixed(2);
    },
    shippingCost () { // 海运费
      let lang = this.form.goodsLength || 0;
      let wide = this.form.goodsWide || 0;
      let high = this.form.goodsHigh || 0;
      if (lang === 0 || wide === 0 || high === 0 || !this.form.exchangeRate) {
        return '--';
      }
      return ((lang * wide * high) / 1000000 * this.form.shippingUnitPrice / this.form.exchangeRate).toFixed(2);
    },
    airTransportCost () { // 空运费
      if ((!this.form.goodsWeight && this.airTransportWeight === '') || !this.form.exchangeRate) {
        return '--';
      }
      return (Math.max(this.form.goodsWeight, this.airTransportWeight) / 1000 * this.form.airTransportUnitPrice / this.form.exchangeRate).toFixed(2);
    },
    goodsFbaFee () { // fba费计算
      let length = this.goodsLengthInch === '-' ? 0 : parseFloat(this.goodsLengthInch); // 长Inch
      let wide = this.goodsWideInch === '-' ? 0 : parseFloat(this.goodsWideInch); // 宽Inch
      let high = this.goodsHighInch === '-' ? 0 : parseFloat(this.goodsHighInch); // 高Inch
      // 将长宽高排序
      let length_list_inch = [length, wide, high].sort(function (a, b) {return b - a});
      let longest_edge = length_list_inch[0]; // 最长边
      let long_side = length_list_inch[1]; // 中长边
      let shortest_edge = length_list_inch[2]; // 最短边
      let surrounded_degree = 2 * (long_side + shortest_edge); // 围度
      let weight = !this.form.goodsWeight ? 0 : parseFloat((this.form.goodsWeight / 453).toFixed(2)); // 实际运输重量
      let fba_outbound_actual_weight = 0; // FBA出库实际重量
      let amazon_billing_volume_weight = 0; // 亚马逊计费体积
      let size = ''; // 标准
      console.log('最长：' + longest_edge + ' 次长：' + long_side + ' 最短：' + shortest_edge);
      console.log('围度：' + surrounded_degree + ' 运输重量：' + weight);
      if ((!longest_edge || !long_side || !shortest_edge) && !weight) { // 无数据时计费0
        return 0;
      }
      if (longest_edge <= 15 && long_side <= 12 && shortest_edge <= 0.75 && weight <= 1) { // 小号标准尺寸：最长边<=15inch,中长边<=12inch，最短边<=0.75inch,重量<=16oz(1lb)
        fba_outbound_actual_weight = weight + 0.25;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 0.25;
        size = 'small_standard';
      } else if (longest_edge <= 18 && long_side <= 14 && shortest_edge <= 8 && weight <= 21) { // 大号标准尺寸: 最长边<=18inch,中长边<=14inch，最短边<=8inch,重量<=21lb
        fba_outbound_actual_weight = weight + 0.25;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 0.25;
        size = 'large_standard';
      } else if (longest_edge <= 60 && long_side <= 30 && (longest_edge + surrounded_degree) <= 130 && weight <= 71) { // 小号大件: 最长边<=60inch,中长边<=30inch，最长边 + 围度<=130inch,重量<=71lb
        fba_outbound_actual_weight = weight + 1;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 1;
        size = 'small_oversize';
      } else if (longest_edge <= 108 && (longest_edge + surrounded_degree) <= 130 && weight <= 151) { // 中号大件: 最长边<=108inch, 最长边 + 围度<=130inch,重量<=151lb
        fba_outbound_actual_weight = weight + 1;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 1;
        size = 'medium_oversize';
      } else if (longest_edge <= 108 && (longest_edge + surrounded_degree) <= 165 && weight <= 151) { // 大号大件: 最长边<=108inch, 最长边 + 围度<=165inch,重量<=151lb
        fba_outbound_actual_weight = weight + 1;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 1;
        size = 'large_oversize';
      } else {
        fba_outbound_actual_weight = weight + 1;
        amazon_billing_volume_weight = parseFloat((length * wide * high / 139).toFixed(2)) + 1;
        size = 'special_oversize';
      }
      console.log('FBA重：' + amazon_billing_volume_weight + ' 亚马逊重：' + fba_outbound_actual_weight);
      let max = Math.max(amazon_billing_volume_weight, fba_outbound_actual_weight); // 取出计费更重的
      if (size === 'small_standard') {
        if (max <= 0.625) {
          return 2.5;
        } else if (max <= 1) {
          return 2.63;
        } else if (max <= 21){
          size = 'large_standard';
        }
      }
      if (size === 'large_standard') {
        if (max <= 0.625) {
          return 3.31;
        } else if (max <= 1) {
          return 3.48;
        } else if (max <= 2) {
          return 4.9;
        } else if (max <= 3) {
          return 5.42;
        } else if (max <= 21){
          return (5.42 + 0.38 * (Math.ceil(max) - 3)).toFixed(2);
        } else if (max <= 71) {
          size = 'small_oversize';
        }
      }
      if (size === 'small_oversize') {
        if (max <= 71) {
          return (8.26 + 0.38 * (Math.ceil(max) - 2)).toFixed(2);
        } else if (max <= 151) {
          size = 'medium_oversize';
        }
      }
      if (size === 'medium_oversize') {
        if (max <= 151) {
          return (11.37 + 0.39 * (Math.ceil(max) - 2)).toFixed(2);
        } else {
          size = 'special_oversize';
        }
      }
      if (size === 'large_oversize') {
        if (max <= 151) {
          return (75.78 + 0.79 * (Math.ceil(max) - 90)).toFixed(2);
        } else {
          size = 'special_oversize';
        }
      }
      if (size === 'special_oversize') {
        return (137.32 + 0.91 * (Math.ceil(max) - 90)).toFixed(2);
      }
      return 0;
    },
    purchaseCostDollar () { // 采购成本 刀
      if (!this.form.purchaseCostRmb || !this.form.exchangeRate) {
        return '--';
      }
      return (this.form.purchaseCostRmb / this.form.exchangeRate).toFixed(2);
    },
    profitSellingPriceAir () { // 30%空运
      if (this.airTransportCost === '--' || this.purchaseCostDollar === '--') {
        return '--';
      }
      return ((parseFloat(this.goodsFbaFee) + parseFloat(this.airTransportCost) + parseFloat(this.purchaseCostDollar)) / 0.53).toFixed(2);
    },
    profitSellingPriceShip () { // 30%海运
      if (this.shippingCost === '--' || this.purchaseCostDollar === '--') {
        return '--';
      }
      return ((parseFloat(this.goodsFbaFee) + parseFloat(this.shippingCost) + parseFloat(this.purchaseCostDollar)) / 0.53).toFixed(2);
    },
    profitRateAir () { // 利润率 空运
      if (!this.form.currentSellingPrice || this.airTransportCost === '--' || this.purchaseCostDollar === '--') {
        return '--';
      }
      return ((this.form.currentSellingPrice - 0.17 * this.form.currentSellingPrice - this.goodsFbaFee - this.airTransportCost - this.purchaseCostDollar) / this.form.currentSellingPrice).toFixed(2);
    },
    profitRateShip () { // 利润率 海运
      if (!this.form.currentSellingPrice || this.airTransportCost === '--' || this.purchaseCostDollar === '--') {
        return '--';
      }
      return ((this.form.currentSellingPrice - 0.17 * this.form.currentSellingPrice - this.goodsFbaFee - this.shippingCost - this.purchaseCostDollar) / this.form.currentSellingPrice).toFixed(2);
    },
    purchaseAmountSum () { // 采购总金额
      return this.form.orderQuantity * this.form.purchaseCostRmb;
    },
    turnoverSum () { // 营业额
      return this.form.orderQuantity * this.form.currentSellingPrice;
    }
  },
  mounted () {
    this.id = this.$route.query.id;
    if (this.id) { // 编辑时
      this.getDetail();
    }
  },
  methods: {
    async getDetail () { // 获取详情
      let data = await window.axios.get(`/account_cost/queryAccountCostInfo4Update/${this.id}`);
      data.data.mainPicUrl = data.data.mainPicUrl ? [{url: data.data.mainPicUrl}] : [];
      this.form = data.data;
    },
    checkSize (file) { // 文件上传前检查文件大小和格式(小于2M)
      let name = file.name.split('.');
      let type = name[name.length - 1];
      if (type !== 'png' && type !== 'jpg') {
        this.$message({
          message: '文件格式错误',
          type: 'warning'
        });
        return false;
      }
      if (file.size >= 2 * 1024 * 1024) {
        this.$message({
          message: '文件超过限制大小',
          type: 'warning'
        });
        return false;
      }
    },
    handleRemove() { // 删除文件
      this.form.mainPicUrl = [];
    },
    handlePictureCardPreview(file) { // 展示大图
      this.dialogImageUrl = file.url.replace('_80x80', '');
      this.dialogVisible = true;
    },
    up (response) { // 上传成功
      this.form.mainPicUrl.push({
        url: response.data.thumbUrl
      });
    },
    submit () { // 保存
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form));
          param.mainPicUrl = param.mainPicUrl[0] ? param.mainPicUrl[0].url : ''; // 商品主图
          param.salesFlag = ~~param.salesFlag;
          param.goodsLengthInch = this.goodsLengthInch === '--' ? '' : this.goodsLengthInch;
          param.goodsWideInch = this.goodsWideInch === '--' ? '' : this.goodsWideInch;
          param.goodsHighInch = this.goodsHighInch === '--' ? '' : this.goodsHighInch;
          param.goodsWeightPound = this.goodsWeightPound === '--' ? '' : this.goodsWeightPound;
          param.goodsVolumeInch = this.goodsVolumeInch === '--' ? '' : this.goodsVolumeInch;
          param.goodsActualWeight = this.goodsActualWeight === '--' ? '' : this.goodsActualWeight;
          param.airTransportWeight = this.airTransportWeight === '--' ? '' : this.airTransportWeight;
          param.shippingCost = this.shippingCost === '--' ? '' : this.shippingCost;
          param.airTransportCost = this.airTransportCost === '--' ? '' : this.airTransportCost;
          param.goodsFbaFee = this.goodsFbaFee === '--' ? '' : this.goodsFbaFee;
          param.purchaseCostDollar = this.purchaseCostDollar === '--' ? '' : this.purchaseCostDollar;
          param.profitSellingPriceAir = this.profitSellingPriceAir === '--' ? '' : this.profitSellingPriceAir;
          param.profitSellingPriceShip = this.profitSellingPriceShip === '--' ? '' : this.profitSellingPriceShip;
          param.profitRateAir = this.profitRateAir === '--' ? '' : this.profitRateAir;
          param.profitRateShip = this.profitRateShip === '--' ? '' : this.profitRateShip;
          param.purchaseAmountSum = this.purchaseAmountSum === '--' ? '' : this.purchaseAmountSum;
          param.turnoverSum = this.turnoverSum === '--' ? '' : this.turnoverSum;
          console.log(param);
          let data = '';
          if (this.id) { // 编辑
            data = await window.axios.post('/account_cost/updateAccountCostInfo', {
              id: this.id,
              ...param
            });
          } else {
            data = await window.axios.post('/account_cost/addAccountCostInfo', {
              ...param
            });
          }
          if (data.code === 0) {
            this.$message.success(data.message);
            history.go(-1);
          }
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.addConst {
  position: relative;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  .page {
    display: flex;
    border: 1px solid rgb(228, 228, 228);
    margin-top: 10px;
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
      .moneyLabel {
        top: 400px;
      }
      .compLabel {
        top: 720px;
      }
      .ruleLabel {
        top: 1300px;
      }
    }
    .right {
      box-sizing: border-box;
      width: calc(100% - 180px);
      padding: 100px;
      .typeList {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        .typeSel {
          width: 250px;
          border: 1px solid rgb(228, 228, 228);
          border-radius: 4px;
          > div {
            text-indent: 20px;
            line-height: 40px;
            border-bottom: 1px solid rgb(228, 228, 228);
          }
          .selTitle {
            background-color: rgb(228, 228, 228);
          }
          .selList {
            border-bottom: none;
            height: 280px;
            overflow-y: scroll;
            box-sizing: border-box;
            .selItem {
              display: flex;
              cursor: pointer;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgb(228, 228, 228);
              i {
                margin-right: 10px;
              }
            }
            .selItem.active {
              color: #1ABC9C;
            }
          }
        }
        .center {
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 100px;
          border: 1px solid #999;
          font-size: 30px;
          margin: 0 30px;
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
        .info {
          color: rgb(153, 153, 153)
        }
      }
      .inline {
        overflow: hidden;
        /deep/.el-input--small {
          float: left;
          width: 90px;
          .el-input__inner {
            width: 90px;
            height: 35px;
            line-height: 35px;
            text-align: center;
          }
        }
        .leftSpan {
          margin-left: 16px;
        }
      }
      .append {
        /deep/.el-input--small {
          width: 180px;
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
        .save {
          width: 80px;
          background-color: white;
          color: #1ABC9C;
          border: 1px solid #1ABC9C;
        }
      }
    }
  }
}
</style>