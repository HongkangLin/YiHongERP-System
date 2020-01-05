<template>
  <div class="addOrEdit_wrap">
    <!-- 面包屑 -->
		<crumbs :list="crumbList"></crumbs>
    <div class="inStore_addOrEdit">
      <div class="header">{{$route.query.inId ? "编辑入库" : "新增入库"}}</div>
      <div class="formArea">
        <!-- 基础信息 -->
        <div class="secTitle">基础信息</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm">
          <el-form-item label="入库单号：" prop="sn">
            <el-input maxlength="100" v-model="ruleForm.sn" placeholder="提交后自动生成" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库状态：" prop="status">
            <el-input maxlength="100" v-model="ruleForm.status" placeholder="待入库" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库类型：" prop="type">
            <el-input maxlength="100" v-model="ruleForm.type" placeholder="外贸入库" disabled></el-input>
          </el-form-item>
          <el-form-item label="入库仓库：" prop="warehouseName">
            <el-select filterable v-model="ruleForm.warehouseName" placeholder="请选择入库仓库">
              <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商：" prop="supplierName">
            <el-select filterable v-model="ruleForm.supplierName" placeholder="请选择供应商" @change="getPurchaser">
              <el-option v-for="(item, index) in supplierList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购员：" prop="purchaserId">
            <el-input maxlength="100" v-model="ruleForm.purchaserName" placeholder="请输入采购员" disabled></el-input>
          </el-form-item>
          <el-form-item label="运单号：" prop="deliverSn">
            <el-input maxlength="100" v-model="ruleForm.deliverSn" placeholder="请输入运单号"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input maxlength="100" type="textarea" :rows="4" placeholder="输入备注" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <!-- 产品信息 -->
        <div class="secTitle">产品信息</div>
        <el-button type="primary" icon="el-icon-plus" class="addPdtBtn" @click="dialogTableVisible = true">选择产品</el-button>
        <div class="productTable">
          <el-form :model="tableRuleForm" :rules="tableRules" ref="tableRuleForm" :validate-on-rule-change="false">
          <el-table :data="productList" border show-summary style="width: 100%" :summary-method="getSummaries">
            <el-table-column label="图片" align="center" width="101">
              <template slot-scope="scope">
                <img class="img" :src="scope.row.goodsPicUrl">
              </template>
            </el-table-column>
            <el-table-column prop="goodsSku" label="SKU" align="center" min-width="190"></el-table-column>
            <el-table-column prop="goodsName" label="产品名称" align="center" min-width="300"></el-table-column>
            <el-table-column prop="arriveCount" align="center" min-width="210">
              <template slot="header">
                <span class="star">*</span>
                <span class="tableHeader">到货数量（套）</span>
              </template>
              <template slot-scope="scope">
                <el-form-item :prop="'arriveCount' + scope.$index">
                  <el-input-number v-model="scope.row.arriveCount" :min="0" step-strictly :controls="false" placeholder="输入"></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="210">
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
    <el-dialog title="添加产品" :visible.sync="dialogTableVisible" width="45%" class="pdtDialog" @open="checkIfAdded" :destroy-on-close="true">
      <el-input maxlength="100" v-model="dialog.skuIdOrGoodsNameOrCustomId" placeholder="商品名称/SKU" class="searchPdt">
        <el-button slot="append" icon="el-icon-search" @click="searchDialogPdt"></el-button>
      </el-input>
      <el-table :data="dialogPdtList" border style="width: 100%" :key="dialogTableKey">
        <el-table-column prop="goodsName" label="产品名称" align="center" min-width="220"></el-table-column>
        <el-table-column prop="skuId" label="SKU" align="center" min-width="180"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogPdt(scope.row.id, scope.row.added)">{{scope.row.added === "added" ? "移除" : "添加"}}</el-button>
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
      ruleForm: {
        id: null,
        sn: "", //入库单SN
        status: "待入库", //入库单状态
        type: "外贸入库", //入库单类型
        warehouseName: "", //仓库名字
        warehouseId: null,
        supplierName: "", //供应商名字
        supplierId: null,
        purchaserName: "", //采购员名字
        purchaserId: null,
        deliverSn: "", //运单号
        remark: "" //备注
      },
      rules: {
        warehouseName: [
          { required: true, message: '请选择入库仓库', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      },

      storeList: [], //仓库下拉
      supplierList: [], //供应商下拉
      productList: [], //产品信息列表

      // 添加产品弹窗
      dialogTableKey: 0,
      dialogTableVisible: false,
      dialog: {
        skuIdOrGoodsNameOrCustomId: "",
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
      if (this.$route.query.inId) {
        return [{ 
          name: '库存管理',
          path: '/F0401/F040102'
        }, {
          name: '入库管理',
          path: '/F0401/F040102'
        }, {
          name: '编辑入库',
          path: ''
        }]
      } else {
        return [{ 
          name: '库存管理',
          path: '/F0401/F040102'
        }, {
          name: '入库管理',
          path: '/F0401/F040102'
        }, {
          name: '新增入库',
          path: ''
        }]
      }
    },
    tableRuleForm() {
      let obj = {};
      this.productList.length > 0 && this.productList.map((item, index) => {
        obj["arriveCount"+index] = item.arriveCount;
      })
      return obj;
    },
    tableRules() {
      let validateCount = (rule, value, callback) => {
        if (value === undefined || value === null) {
          callback(new Error('不可为空'));
        } else {
          callback();
        }
      };
      let obj = {};
      this.productList.length > 0 && this.productList.map((item, index) => {
        obj["arriveCount"+index] = [
          { validator: validateCount, trigger: 'blur' }
        ]
      })
      return obj;
    }
  },
  created() {
    this.init();
    this.$route.query.inId && this.getInfoWhenEdit();
    
  },
  methods: {
    init() {
      let _this = this;
      axios.all([
        axios.get("/warehouse/simpList"),
        axios.get("/supplier/simpListNoChk")
      ])
      .then(axios.spread(function (storeData, supplierData) {
        _this.storeList = storeData.data;
        _this.supplierList = supplierData.data;
      }));
      // 新增时获取弹窗用的产品列表
      !this.$route.query.inId && this.queryProductInfoList(false);
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
        axios.get(`/checkinorder/detail/${this.$route.query.inId}`),
        axios.post("/product/queryProductInfoList", this.dialog)
      ])
      .then(axios.spread(function (basicInfo, pdtList) {
        _this.refillForm(basicInfo.data);
        _this.parsePdtList(pdtList);
      }));
    },

    // 编辑入库返显
    refillForm(obj) {
      // 基础信息
      this.ruleForm.id = obj.id;
      this.ruleForm.sn = obj.sn;
      this.ruleForm.warehouseName = obj.warehouseName;
      this.ruleForm.warehouseId = obj.warehouseId;
      this.ruleForm.supplierName = obj.supplierName;
      this.ruleForm.supplierId = obj.supplierId;
      this.ruleForm.purchaserName = obj.purchaserName;
      // this.ruleForm.purchaserId = obj.purchaserId; //用于提交的采购员
      this.ruleForm.deliverSn = obj.deliverSn;
      this.ruleForm.remark = obj.remark;

      // 产品信息列表
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
                // 至少有一产品到货数量不为0
                let flag = false;
                _this.productList.forEach(item => {
                  if (item.arriveCount) {
                    flag = true;
                  }
                });
                if (!flag) {
                  return _this.$message.warning("请正确填写到货数量");
                }

                console.log('submit!');
                if (_this.$route.query.inId) {
                  // 编辑入库
                  _this.editInStore();
                } else {
                  // 新增入库
                  _this.addInStore();
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            })
            // this.productList.forEach(item => {
            //   if (!item.arriveCount) {
            //     flag = false;
            //     return this.$message.warning("请填写到货数量");
            //   }
            // });
          }
          // if (!flag) return
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 编辑入库
    editInStore() {
      let params = {
        id : this.ruleForm.id,
        warehouseId : typeof(this.ruleForm.warehouseName) === "number" ? this.ruleForm.warehouseName : this.ruleForm.warehouseId,
        supplierId : typeof(this.ruleForm.supplierName) === "number" ? this.ruleForm.supplierName : this.ruleForm.supplierId,
        // purchaserId : this.ruleForm.purchaserId, //待修改
        deliverSn : this.ruleForm.deliverSn,
        remark : this.ruleForm.remark,
        goods: []
      }
      this.productList.map((item) => {
        if (item.id !== undefined) { //更新的商品
          params.goods.push({
            id: item.id,
            arriveCount: item.arriveCount
          })
        } else { //新增的商品
          params.goods.push({
            goodsId: item.goodsId,
            arriveCount: item.arriveCount
          })
        }
      })
      axios.post("/checkinorder/update", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("编辑入库成功");
        this.$router.push({
          path: "/F0401/F040102"
        })
      })
    },

    // 新增入库
    addInStore() {
      let params = {
        warehouseId : this.ruleForm.warehouseName,
        supplierId : this.ruleForm.supplierName,
        // purchaserId : this.ruleForm.purchaserId,
        deliverSn : this.ruleForm.deliverSn,
        remark : this.ruleForm.remark,
        goods: []
      }
      this.productList.map((item) => {
        item.arriveCount && params.goods.push({
          goodsId: item.goodsId,
          arriveCount: item.arriveCount
        })
      })
      axios.post("/checkinorder/create", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("新增入库成功");
        this.$router.push({
          path: "/F0401/F040102"
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
    handleDialogPdt(id, added) {
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
        // 变更状态
        this.dialogPdtList.forEach((element, index) => {
          if (element.id === id) {
            element.added = "added";
            _this.dialogTableKey++;
            let obj = {
              goodsId: element.id,
              goodsPicUrl: element.mainPicUrl,
              goodsSku: element.skuId,
              goodsName: element.goodsName
            }
            // 产品信息列表添加对应的产品
            _this.productList.push(obj);
            return 
          }
        });
      }
    },
    
    // 供应商带出采购员
    getPurchaser(supplierId) {
      axios.get(`/supplier/getPurchaser?supplierId=${supplierId}`).then((data) => {
        if (data.code !== 0) return
        this.ruleForm.purchaserId = data.data.purchaserId;
        this.ruleForm.purchaserName = data.data.purchaserName;
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
          // sums[index] = sums[index].toFixed(2); 
        } else {
          sums[index] = '';
        }
      });
      sums[1] = "";
      sums[2] = "";
      // console.log("sums: ", sums);
      return sums;
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
        /deep/.img {
          width: 80px;
          height: 80px;
        }
        .el-table__header-wrapper {
          .star {
            color: red;
            margin-right: 3px;
          }
        }
        /deep/.el-table__body-wrapper {
          .el-input__inner {
            // border: none;
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