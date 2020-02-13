<template>
  <div class="outStore_wrap">
    <!-- 面包屑 -->
		<crumbs :list="crumbList"></crumbs>
    <div class="outStore">
      <div class="header">出库</div>
      <div class="formArea">
        <!-- 基础信息 -->
        <div class="secTitle">基础信息</div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="ruleForm">
          <el-form-item label="出库单号：" prop="sn">
            <el-input maxlength="100" v-model="ruleForm.sn" placeholder="提交后自动生成" disabled></el-input>
          </el-form-item>
          <el-form-item label="出库状态：" prop="status">
            <el-input maxlength="100" v-model="ruleForm.status" placeholder="待出库" disabled></el-input>
          </el-form-item>
          <el-form-item label="仓库：" prop="warehouseName">
            <el-input maxlength="100" v-model="ruleForm.warehouseName" placeholder="请选择仓库" disabled></el-input>
          </el-form-item>
          <el-form-item label="出库类型：" prop="type">
            <el-input maxlength="100" v-model="ruleForm.type" placeholder="请选择出库类型" disabled></el-input>
          </el-form-item>
          <el-form-item label="运输方式：" prop="deliverMethod">
            <el-input maxlength="100" v-model="ruleForm.deliverMethod" placeholder="请选择运输方式" disabled></el-input>
          </el-form-item>
          <el-form-item label="出库国家：" prop="outCountryId">
            <el-input maxlength="100" v-model="ruleForm.outCountryId" placeholder="请选择出库国家" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input maxlength="100" type="textarea" :rows="4" placeholder="输入备注" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <!-- 产品信息 -->
        <div class="secTitle">产品信息</div>
        <div class="productTable">
          <el-table :data="productList" border show-summary sum-text="汇总" style="width: 100%">
            <el-table-column label="图片" align="center" width="101">
              <template slot-scope="scope">
                <img class="img" :src="scope.row.goodsPicUrl">
              </template>
            </el-table-column>
            <el-table-column prop="goodsSku" label="SKU" align="center" min-width="85"></el-table-column>
            <el-table-column prop="goodsName" label="产品名称" align="center" min-width="130"></el-table-column>
            <el-table-column prop="dimentions" label="外箱尺寸(cm)" align="center" min-width="90"></el-table-column>
            <el-table-column prop="fullLoadWeight" label="整箱重量(g)" align="center" min-width="90"></el-table-column>
            <el-table-column prop="fullLoadQuantity" label="装箱数(套/箱)" align="center" min-width="90"></el-table-column>
            <el-table-column prop="quantity" label="件数" align="center" min-width="80"></el-table-column>
            <el-table-column prop="stockAvailCount" label="可用库存" align="center" min-width="80"></el-table-column>
            <el-table-column prop="count" label="本次出库" align="center" min-width="80"></el-table-column>
            <el-table-column prop="totalSpace" label="总体积(m³)" align="center" min-width="80"></el-table-column>
            <el-table-column prop="totalWeight" label="总重量(g)" align="center" min-width="80"></el-table-column>
          </el-table>
        </div>
        <!-- 确认出库 -->
        <div class="submit">
          <el-button type="primary" size="medium" @click="submitForm" class="submitBtn">确认出库</el-button>
        </div>
      </div>
    </div>
    <!-- 确认出库弹窗 -->
    <el-dialog title="确认出库" :visible.sync="dialogVisible" width="35%">
      <div>确定要出库吗？出库之后当前出库单状态变更为已出库且不可修改</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOutStore">出 库</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '库存管理',
        path: '/F0401/F040103'
      }, {
        name: '出库管理',
        path: '/F0401/F040103'
      }, {
        name: '出库',
        path: ''
      }],

      ruleForm: {
        id: null,
        sn: "", //出库单SN
        status: "", //出库单状态
        statusId: null,
        type: "", //出库单类型
        typeId: null,
        warehouseName: "", //仓库名字
        warehouseId: null,
        deliverMethod: "", //运输方式
        deliverMethodId: null,
        remark: "" //备注
      },

      productList: [], //产品信息列表
      dialogVisible: false
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      axios.get(`/stockoutorder/detail/${this.$route.query.outId}`).then((data) => {
        if (data.code !== 0) return
        this.refillForm(data.data);
      })
    },

    // 编辑出库返显
    refillForm(obj) {
      // 基础信息
      this.ruleForm.id = obj.id;
      this.ruleForm.sn = obj.sn;
      this.ruleForm.statusId = obj.status;
      this.ruleForm.status = obj.status ? "已出库" : "待出库";
      this.ruleForm.warehouseName = obj.warehouseName;
      this.ruleForm.warehouseId = obj.warehouseId;
      this.ruleForm.typeId = obj.type;
      this.ruleForm.type = obj.type ? "退换货" : "正常出库";
      this.ruleForm.deliverMethodId = obj.deliverMethod;
      switch (obj.deliverMethod) {
        case 0:
          this.ruleForm.deliverMethod = "海运";
          break;
        case 1:
          this.ruleForm.deliverMethod = "空运";
          break;
        case 2:
          this.ruleForm.deliverMethod = "快递";
          break;
        case 3:
          this.ruleForm.deliverMethod = "快船";
          break;
        case 4:
          this.ruleForm.deliverMethod = "铁路";
          break;
      }
      switch (obj.outCountryId) {
        case 0:
          this.ruleForm.outCountryId = "美国";
          break;
        case 1:
          this.ruleForm.outCountryId = "英国";
          break;
        case 2:
          this.ruleForm.outCountryId = "德国";
          break;
        case 3:
          this.ruleForm.outCountryId = "日本";
          break;
        case 4:
          this.ruleForm.outCountryId = "法国";
          break;
      }
      this.ruleForm.remark = obj.remark;

      // 产品信息列表
      this.productList = obj.goods;
      this.productList.forEach(item => {
        // 外箱尺寸(cm)
        item.dimentions = item.cartonLength + " * " + item.cartonWidth + " * " + item.cartonHeight;
        // 总体积(m³)
        item.totalSpace = ((item.cartonLength * item.cartonWidth * item.cartonHeight * item.quantity)/1000000).toFixed(4);
        // 总重量(g)
        item.totalWeight = (item.fullLoadWeight * item.quantity).toFixed(4);
        // 本次出库
        // item.count = item.count ? item.count : undefined;
      });
    },

    // 提交
    submitForm() {
      // 校验出库数量是否已都填写
      for (let index = 0; index < this.productList.length; index++) {
        const element = this.productList[index];
        if (element.count === undefined) {
          return this.$message.warning("请输入出库数量");
        }
        if (element.count > element.stockAvailCount) {
          return this.$message.warning("本次出库不可大于可用库存");
        }
      }
      this.dialogVisible = true;
    },

    // 提交出库
    submitOutStore() {
      let params = {
        id : this.ruleForm.id
      }
      axios.post("/stockoutorder/stockout", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("出库成功");
        this.$router.push({
          path: "/F0401/F040103"
        })
      })
    },
    
  },
};
</script>
<style lang="less" scoped>
.outStore {
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
        /deep/.el-table__body-wrapper {
          .el-input-number {
            width: 100%;
          }
          .el-input__inner {
            border: none;
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
</style>