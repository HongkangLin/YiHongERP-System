<template>
  <div class="addOrEdit_wrap">
    <!-- 面包屑 -->
		<crumbs :list="crumbList"></crumbs>
    <div class="inStore_addOrEdit">
      <div class="header">{{$route.query.outId ? "编辑出库" : "新增出库"}}</div>
      <div class="formArea">
        <!-- 基础信息 -->
        <div class="secTitle">基础信息</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm">
          <el-form-item label="出库单号：" prop="sn">
            <el-input maxlength="100" v-model="ruleForm.sn" placeholder="提交后自动生成" disabled></el-input>
          </el-form-item>
          <el-form-item label="出库状态：" prop="status">
            <el-input maxlength="100" v-model="ruleForm.status" placeholder="待出库" disabled></el-input>
          </el-form-item>
          <el-form-item label="仓库：" prop="warehouseName">
            <el-select filterable v-model="ruleForm.warehouseName" placeholder="请选择仓库">
              <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库类型：" prop="type">
            <el-select filterable v-model="ruleForm.type" placeholder="选择出库类型">
              <el-option label="正常出库" value=0></el-option>
              <el-option label="退换货" value=1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运输方式：" prop="deliverMethod">
            <el-select filterable v-model="ruleForm.deliverMethod" placeholder="选择运输方式">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in deliverMethodList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库国家：" prop="outCountry">
            <el-select filterable v-model="ruleForm.outCountry" placeholder="选择出库国家">
              <el-option label="美国" value=0></el-option>
              <el-option label="英国" value=1></el-option>
              <el-option label="德国" value=2></el-option>
              <el-option label="日本" value=3></el-option>
              <el-option label="法国" value=4></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input maxlength="100" type="textarea" :rows="4" placeholder="输入备注" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <!-- 产品信息 -->
        <div class="secTitle">产品信息</div>
        <el-button type="primary" icon="el-icon-plus" class="addPdtBtn" @click="dialogTableVisible = true">选择产品</el-button>
        <div class="productTable">
          <el-form :model="tableRuleForm" :rules="tableRules" ref="tableRuleForm"  :validate-on-rule-change="false">
            <el-table :data="productList" border show-summary sum-text="汇总" style="width: 100%">
              <el-table-column label="图片" align="center" width="101">
                <template slot-scope="scope">
                  <img class="img" :src="scope.row.goodsPicUrl">
                </template>
              </el-table-column>
              <el-table-column prop="brandName" label="品牌" align="center" min-width="85"></el-table-column>
              <el-table-column prop="goodsSku" label="SKU" align="center" min-width="85"></el-table-column>
              <el-table-column prop="goodsName" label="产品名称" align="center" min-width="130"></el-table-column>
              <el-table-column prop="goodsFNSKU" label="FNSKU" align="center" min-width="85"></el-table-column>
              <el-table-column prop="dimentions" label="外箱尺寸(cm)" align="center" min-width="90"></el-table-column>
              <el-table-column prop="fullLoadWeight" label="整箱重量(kg)" align="center" min-width="90"></el-table-column>
              <el-table-column prop="fullLoadQuantity" label="装箱数(套/箱)" align="center" min-width="90"></el-table-column>
              <el-table-column prop="quantity" label="件数" align="center" min-width="80"></el-table-column>
              <el-table-column prop="stockAvailCount" label="可用库存" align="center" min-width="80"></el-table-column>
              <el-table-column prop="count" align="center" min-width="120">
                <template slot="header">
                  <span class="star">*</span>
                  <span class="tableHeader">本次出库</span>
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="'count' + scope.$index">
                    <el-input-number v-model="scope.row.count" :min="0" :controls="false" placeholder="请输入" @change="inputCount(scope.row)"></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="totalSpace" label="总体积(m³)" align="center" min-width="80"></el-table-column>
              <el-table-column prop="totalWeight" label="总重量(kg)" align="center" min-width="80"></el-table-column>
              <el-table-column align="center" fixed="right" label="操作" width="80">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="removePdt(scope.row.goodsId)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <!-- 提交 -->
        <div class="submit">
          <el-button type="primary" size="medium" @click="submitForm('ruleForm')" class="submitBtn">提交</el-button>
        </div>
      </div>
    </div>
    <!-- 添加产品弹窗 -->
    <el-dialog title="添加产品" :visible.sync="dialogTableVisible" width="45%" class="pdtDialog" @open="checkIfAdded">
      <el-input maxlength="100" v-model="dialog.skuIdOrGoodsNameOrFnskuOrBrandName" placeholder="商品名称/SKU/FNSKU/品牌" class="searchPdt">
        <el-button slot="append" icon="el-icon-search" @click="searchDialogPdt"></el-button>
      </el-input>
      <el-table :data="dialogPdtList" border style="width: 100%" :key="dialogTableKey">
        <el-table-column prop="goodsName" label="产品名称" align="center"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center"></el-table-column>
        <el-table-column prop="skuId" label="SKU" align="center"></el-table-column>
        <el-table-column prop="fnskuId" label="FNSKU" align="center"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogPdt(scope.row.id, scope.row.added, scope.row.skuId)">{{scope.row.added === "added" ? "移除" : "添加"}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination background layout="prev, pager, next" :page-size="5" :total="dialogTotal" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      deliverMethodList: [],
      ruleForm: {
        id: null,
        sn: "", //出库单SN
        status: "待出库", //出库单状态
        warehouseName: "", //仓库名字
        warehouseId: null,
        type: "", //入库单类型
        typeId: null,
        deliverMethod: "", //运输方式
        outCountry: '', // 出库国家
        outCountryId: null,
        deliverMethodId: null,
        remark: "" //备注
      },
      rules: {
        warehouseName: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择出库类型', trigger: 'change' }
        ],
        deliverMethod: [
          { required: true, message: '请选择运输方式', trigger: 'change' }
        ],
        outCountry: [
          { required: true, message: '请选择出库国家', trigger: 'change' }
        ]
      },

      storeList: [], //仓库下拉
      productList: [], //产品信息列表

      // 添加产品弹窗
      dialogTableKey: 0,
      dialogTableVisible: false,
      dialog: {
        skuIdOrGoodsNameOrFnskuOrBrandName: "",
        pageSize: 5,
        pageNum: 1
      },
      dialogPdtList: [],
      dialogTotal: 0
    }
  },
  computed: {
    // 面包屑
    crumbList() {
      if (this.$route.query.outId) {
        return [{ 
          name: '库存管理',
          path: '/F0401/F040103'
        }, {
          name: '出库管理',
          path: '/F0401/F040103'
        }, {
          name: '编辑出库',
          path: ''
        }]
      } else {
        return [{ 
          name: '库存管理',
          path: '/F0401/F040103'
        }, {
          name: '出库管理',
          path: '/F0401/F040103'
        }, {
          name: '新增出库',
          path: ''
        }]
      }
    },
    tableRuleForm() {
      let obj = {};
      this.productList.length > 0 && this.productList.map((item, index) => {
        obj["count"+index] = item.count;
      })
      return obj;
    },
    tableRules() {
      let obj = {};
      this.productList.length > 0 && this.productList.map((item, index) => {
        let validateCount = (rule, value, callback) => {
          if (value === undefined || value === null) {
            callback(new Error('不可为空'));
          } 
          // else if (value > item.stockAvailCount) {
          //   callback(new Error('不可大于可用库存'));
          // } 
          else if (item.quantity === "--") {
            callback(new Error('输入有问题'));
          } else if (value % item.fullLoadQuantity !== 0) {
            callback(new Error('须为装箱数的倍数'));
          } else {
            callback();
          }
        };

        obj["count"+index] = [
          { validator: validateCount, trigger: 'blur' }
        ]
      })
      return obj;
    }
  },
  async created() {
    await this.getDeliverMethodList();
    this.init();
    this.$route.query.outId && this.getInfoWhenEdit();
  },
  methods: {
    getDeliverMethodList() {
      window.axios.get(`/transport_type/simpList`).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          this.deliverMethodList = data.data;
        }
      });
    },
    init() {
      window.axios.get("/warehouse/simpList").then((data) => {
        if (data.code !== 0) return
        this.storeList = data.data;
      })
    
      // 新增时获取弹窗用的产品列表
      !this.$route.query.outId && this.queryProductInfoList(false);
    },

    // 获取弹窗用的产品列表
    queryProductInfoList(checkAdded) {
      axios.post("/product/queryProductInfoList", this.dialog).then((data) => {
        if (data.code !== 0) return
        this.dialogPdtList = data.data.list;
        this.dialogTotal = data.data.total;
        checkAdded && this.checkIfAdded();
      })
    },

    // 编辑时获取初始化数据
    getInfoWhenEdit() {
      let _this = this;
      axios.all([
        axios.get(`/stockoutorder/detail/${this.$route.query.outId}`),
        axios.post("/product/queryProductInfoList", this.dialog)
      ])
      .then(axios.spread(function (basicInfo, pdtList) {
        _this.refillForm(basicInfo.data);
        _this.parsePdtList(pdtList);
      }));
    },

    // 编辑出库返显
    refillForm(obj) {
      // 基础信息
      this.ruleForm.id = obj.id;
      this.ruleForm.sn = obj.sn;
      this.ruleForm.warehouseName = obj.warehouseName;
      this.ruleForm.warehouseId = obj.warehouseId;
      this.ruleForm.typeId = obj.type;
      this.ruleForm.type = obj.type ? "退换货" : "正常出库";
      this.ruleForm.deliverMethodId = obj.deliverMethod;
      for (let i = 0; i < this.deliverMethodList.length; i++) {
        if (obj.deliverMethod === this.deliverMethodList[i].id) {
          this.ruleForm.deliverMethod = this.deliverMethodList[i].name;
        }
      }
      this.ruleForm.outCountryId = obj.outCountryId;
      switch (obj.outCountryId) {
        case 0:
          this.ruleForm.outCountry = "美国";
          break;
        case 1:
          this.ruleForm.outCountry = "英国";
          break;
        case 2:
          this.ruleForm.outCountry = "德国";
          break;
        case 3:
          this.ruleForm.outCountry = "日本";
          break;
        case 4:
          this.ruleForm.outCountry = "法国";
          break;
      }
      this.ruleForm.remark = obj.remark;

      // 产品信息列表
      obj.goods.map((item) => {
        // fnskuid
        item.goodsFNSKU = item.fnskuId;
        // 品牌
        item.brandName = obj.brandName;
        // 外箱尺寸(cm)
        item.dimentions = item.cartonLength + " * " + item.cartonWidth + " * " + item.cartonHeight;
        // 总体积(m³)
        item.totalSpace = ((item.cartonLength * item.cartonWidth * item.cartonHeight * item.quantity)/1000000).toFixed(4);
        // 总重量(g)
        item.totalWeight = (item.fullLoadWeight * item.quantity).toFixed(4);
        // 本次出库
        item.count = item.count ? item.count : undefined;
        // 件数
        item.quantity = item.count/item.fullLoadQuantity;
      })
      this.productList = obj.goods;
    },

    // 编辑时获取弹窗列表数据
    parsePdtList(data) {
      if (data.code !== 0) return

      this.dialogPdtList = data.data.list;
      // 获取产品的操作状态
      this.checkIfAdded();
      this.dialogTotal = data.data.total;
    },

    // 检查产品是否已添加
    checkIfAdded() {
      let _this = this;
      for (let index = 0; index < this.dialogPdtList.length; index++) {
        const element = this.dialogPdtList[index];
        element.added = ""
        for (let i = 0; i < _this.productList.length; i++) {
          const el = _this.productList[i];
          if (element.id === el.goodsId) {
            element.added = "added"; //操作为 移除
            break;
          }
        }
      }
    },

    // 提交
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let flag = true;
          // 校验到货数量
          if (this.productList.length === 0) {
            // flag = false;
            return this.$message.warning("请添加商品");
          } else {
            this.$refs["tableRuleForm"].validate((valid) => {
              if (valid) {
                let prd = this.productList[0].brandName;
                for (let i = 1; i < this.productList.length; i++) { // 出库时品牌必须一样
                  if (this.productList[i].brandName !== prd) {
                    this.$message.warning('一个出库单仅允许出库一个品牌');
                    return;
                  }
                }
                if (_this.$route.query.outId) {
                  // 编辑出库
                  _this.editOutStore();
                } else {
                  // 新增出库
                  _this.addOutStore();
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            })

            // for (let index = 0; index < this.productList.length; index++) {
            //   const item = this.productList[index];
            //   if (item.quantity === "--") {
            //     flag = false;
            //     return this.$message.warning("输入有问题,无法提交");
            //   }
            //   if (!item.count) {
            //     flag = false;
            //     return this.$message.warning("请填写本次出库");
            //   }
            //   if (item.count % item.fullLoadQuantity !== 0) {
            //     flag = false;
            //     return this.$message.warning("出库数量须为装箱数的倍数");
            //   }
            // }
          }
          // if (!flag) return
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 编辑出库
    editOutStore() {
      let params = {
        id : this.ruleForm.id,
        warehouseId : typeof(this.ruleForm.warehouseName) === "number" ? this.ruleForm.warehouseName : this.ruleForm.warehouseId,
        deliverMethod : /^\d+$/.test(this.ruleForm.deliverMethod) ? this.ruleForm.deliverMethod : this.ruleForm.deliverMethodId,
        type : /^\d+$/.test(this.ruleForm.type) ? this.ruleForm.type : this.ruleForm.typeId,
        remark : this.ruleForm.remark,
        outCountryId: /^\d+$/.test(this.ruleForm.outCountry) ? this.ruleForm.outCountry : this.ruleForm.outCountryId,
        goods: []
      }
      this.productList.map((item) => {
        params.goods.push({
          id: item.id,
          goodsId: item.goodsId,
          brandName: item.brandName,
          fnskuId: item.goodsFNSKU,
          cartonHeight: item.cartonHeight,
          cartonLength: item.cartonLength,
          cartonWidth: item.cartonWidth,
          fullLoadWeight: item.fullLoadWeight,
          fullLoadQuantity: item.fullLoadQuantity,
          count: item.count
        })
      })
      axios.post("/stockoutorder/update", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("更新出库单信息成功");
        this.$router.push({
          path: "/F0401/F040103"
        })
      })
    },

    // 新增出库
    addOutStore() {
      let params = {
        warehouseId: this.ruleForm.warehouseName,
        type: this.ruleForm.type,
        deliverMethod: this.ruleForm.deliverMethod,
        remark: this.ruleForm.remark,
        outCountryId: this.ruleForm.outCountry,
        goods: []
      }
      this.productList.map((item) => {
        params.goods.push({
          goodsId: item.goodsId,
          brandName: item.brandName,
          fnskuId: item.goodsFNSKU,
          cartonHeight: item.cartonHeight,
          cartonLength: item.cartonLength,
          cartonWidth: item.cartonWidth,
          fullLoadWeight: item.fullLoadWeight,
          fullLoadQuantity: item.fullLoadQuantity,
          count: item.count
        })
      })
      axios.post("/stockoutorder/create", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("创建出库单成功");
        this.$router.push({
          path: "/F0401/F040103"
        })
      })
    },

    searchDialogPdt() {
      this.dialog.pageNum = 1;
      this.queryProductInfoList(true);
    },

    handleCurrentChange(pageNum) {
      this.dialog.pageNum = pageNum;
      this.queryProductInfoList(true);
    },
    
    // 移除产品信息列表的产品
    removePdt(goodsId) {
      let _this = this;
      this.productList.forEach((element, index) => {
        if (element.goodsId === goodsId) {
          return _this.productList.splice(index, 1);
        }
      });
      this.$refs["tableRuleForm"].clearValidate();
    },

    // 添加/移除弹窗里列表的产品
    handleDialogPdt(id, added, skuId) {
      let _this = this;
      if (added) { //移除操作
        // 变更状态
        this.dialogPdtList.forEach((element, index) => {
          if (element.id === id) {
            element.added = "";
            _this.dialogTableKey++;
            return 
          }
        });
        // 移除产品信息列表对应的产品
        this.removePdt(id);
      } else { //添加操作
        let houseId = typeof(this.ruleForm.warehouseName) === "number" ? this.ruleForm.warehouseName : this.ruleForm.warehouseId; 
        if (!houseId) {
          this.$message.warning("请先选择仓库");
          return;
        }
        // 变更状态
        this.dialogPdtList.forEach((element, index) => {
          if (element.id === id) {
            element.added = "added";
            _this.dialogTableKey++;
            return 
          }
        });
        // 产品信息列表添加对应的产品
        axios.all([
          axios.post("/product/queryProductInfoDetail", {skuId}),
          axios.get("/stocklist/avail", {params: {goodsId: id, warehouseId: houseId}})
        ])
        .then(axios.spread(function (pdtDetailData, stockAvailData) {
          let pdtDetail = pdtDetailData.data;
          let obj = {
            goodsId: pdtDetail.id,
            goodsPicUrl: pdtDetail.mainPicUrl,
            goodsSku: pdtDetail.skuId,
            goodsFNSKU: pdtDetail.fnskuId,
            goodsName: pdtDetail.goodsName,
            brandName: pdtDetail.brandName,
            dimentions: pdtDetail.packingLength + " * " + pdtDetail.packingWide + " * " + pdtDetail.packingHigh,
            fullLoadWeight: pdtDetail.packingWeight,
            fullLoadQuantity: pdtDetail.packingQuantity, //装箱数
            quantity: "--", //件数
            stockAvailCount: stockAvailData.data.availCount, //可用库存
            count: undefined, 
            cartonLength: pdtDetail.packingLength,
            cartonWidth: pdtDetail.packingWide,
            cartonHeight: pdtDetail.packingHigh,
            totalSpace: "--", //总体积
            totalWeight: "--" //总重量
          }
          _this.productList.push(obj);
        
        }));
      }
    },

    // 输入本次出库
    inputCount(obj) {
      //件数
      obj.quantity = obj.fullLoadQuantity ? Math.ceil(obj.count / obj.fullLoadQuantity) : "--"; 
      // 总体积(m³)
      obj.totalSpace = obj.quantity === "--" ? "--" : ((obj.cartonLength * obj.cartonWidth * obj.cartonHeight * obj.quantity)/1000000).toFixed(4);
      // 总重量(g)
      obj.totalWeight = obj.quantity === "--" ? "--" : (obj.fullLoadWeight * obj.quantity).toFixed(4);
      if (obj.count === undefined || obj.count === null) {
        obj.quantity = "--";
        obj.totalSpace = "--";
        obj.totalWeight = "--";
      }
    }
  },
};
</script>
<style lang="less" scoped>
.inStore_addOrEdit {
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  font-size: 12px;
  .header {
    color: #666666;
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    padding-left: 20px;
    border: 1px solid #e4e4e4;
  }

  .formArea {
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: none;
    .secTitle {
      font-size: 14px;
      padding: 30px 30px 0;
    }
    .ruleForm {
      width: fit-content;
      padding: 30px 0;
      margin-left: 50px;
      /deep/.el-form-item {
        width: fit-content;
        .el-form-item__content {
          width: fit-content;
          >.el-input,
          >.el-select {
            width: 240px;
          }
          .el-textarea {
            width: 450px;
          }
        }
      }
      
      .submitBtn {
        margin-left: 140px;
      }
    }
    .addPdtBtn {
      margin-left: 30px;
      margin-top: 40px;
    }
    .productTable {
      padding: 30px;
      .el-table {
        .el-table {
          /deep/.img {
            width: 80px;
            height: 80px;
          }
        }
        .el-table__header-wrapper {
          .star {
            color: red;
            margin-right: 3px;
          }
        }
        /deep/.el-table__body-wrapper {
          .img {
            width: 100%;
          }
          .el-input-number {
            width: 100%;
          }
          .el-form-item .el-form-item__error{
            width: 100%;
            text-align: center;
          }
        }
      }
    }
    .submit {
      height: 80px;
      .submitBtn {
        float: right;
        margin-right: 30px;
      }
    }
  }
}
.pdtDialog {
  /deep/.el-dialog {
    .el-dialog__body {
      .searchPdt {
        width: 240px;
        margin-bottom: 15px;
      }
      .page {
        height: 60px;
        position: relative;
        .el-pagination {
          position: absolute;
          top: 20px;
          right: 0;
        }
      }
      
    }
  }
}
</style>