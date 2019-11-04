<template>
  <div class="inStore_wrap">
    <!-- 面包屑 -->
		<crumbs :list="crumbList"></crumbs>
    <div class="inStore">
      <div class="header">入库</div>
      <div class="formArea">
        <!-- 基础信息 -->
        <div class="secTitle">基础信息</div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="ruleForm">
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
            <el-input maxlength="100" v-model="ruleForm.warehouseName" placeholder="请选择入库仓库" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商：" prop="supplierName">
            <el-input maxlength="100" v-model="ruleForm.supplierName" placeholder="请选择供应商" disabled></el-input>
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
        <div class="productTable">
          <el-table :data="productList" border show-summary sum-text="汇总" style="width: 100%">
            <el-table-column label="图片" align="center" width="101">
              <template slot-scope="scope">
                <img class="img" :src="scope.row.goodsPicUrl">
              </template>
            </el-table-column>
            <el-table-column prop="goodsSku" label="SKU" align="center" min-width="190"></el-table-column>
            <el-table-column prop="goodsName" label="产品名称" align="center" min-width="300"></el-table-column>
            <el-table-column prop="arriveCount" label="到货数量（套）" align="center" min-width="210"></el-table-column>
            <el-table-column prop="checkinCount" align="center" min-width="210">
              <template slot="header">
                <span class="star">*</span>
                <span class="tableHeader">入库数量（套）</span>
              </template>
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.checkinCount" :min="1" step-strictly :max="scope.row.arriveCount" :controls="false" placeholder="输入"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 确认入库 -->
        <div class="submit">
          <el-button type="primary" size="medium" @click="submitForm" class="submitBtn">确认入库</el-button>
        </div>
      </div>
    </div>
    <!-- 确认入库弹窗 -->
    <el-dialog title="确认入库" :visible.sync="dialogVisible" width="35%">
      <div>确定要入库吗？入库之后当前入库单状态变更为已入库且不可修改</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInStore">入 库</el-button>
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
        path: '/F0401/F040102'
      }, {
        name: '入库管理',
        path: '/F0401/F040102'
      }, {
        name: '入库',
        path: ''
      }],

      ruleForm: {
        id: null,
        sn: "", //入库单SN
        status: "待入库", //入库单状态
        type: "外贸入库", //入库单类型
        warehouseName: "", //仓库名字
        warehouseId: null,
        supplierName: "", //供应商名字
        supplierId: null,
        purchaserName: "采购员x", //采购员名字
        purchaserId: 10, //改null
        deliverSn: "", //运单号
        remark: "" //备注
      },

      productList: [], //产品信息列表
      dialogVisible: false
    }
  },
  created() {
    this.getInfoWhenEdit();
  },
  methods: {
    // 编辑时获取初始化数据
    getInfoWhenEdit() {
      axios.get(`/checkinorder/detail/${this.$route.query.inId}`).then((data) => {
        if (data.code !== 0) return
        this.refillForm(data.data);
      })
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
      this.productList.forEach(element => {
        if (element.checkinCount === 0) element.checkinCount = undefined
      });
    },

    // 提交
    submitForm() {
      // 校验入库数量是否已都填写
      for (let index = 0; index < this.productList.length; index++) {
        const element = this.productList[index];
        if (element.checkinCount === undefined) {
          return this.$message.warning("请输入入库数量");
        }
      }
      this.dialogVisible = true;
    },

    // 提交入库
    submitInStore() {
      let params = {
        id : this.ruleForm.id,
        checkinList: []
      }
      this.productList.map((item) => {
        params.checkinList.push({
          id: item.id,
          checkinCount: item.checkinCount
        })
      })
      axios.post("/checkinorder/checkin", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("入库成功");
        this.$router.push({
          path: "/F0401/F040102"
        })
      })
    },
    
  },
};
</script>
<style lang="less" scoped>
.inStore {
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