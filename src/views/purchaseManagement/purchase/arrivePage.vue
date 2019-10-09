<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList"></crumbs>
  <div class="arrivePage_wrap">
      <div class="header">采购到货</div>
      <div class="contentArea">
        <div class="contentTop">
          <div class="purchaseId">
            <span class="name">采购单号：</span>
            <span class="value">{{productInfo.purchaseId}}</span>
          </div>
          <div class="arrivalStatus">
            <span class="name">到货状态：</span>
            <span class="value">{{productInfo.arrivalStatus}}</span>
          </div>
          <div class="payStatus">
            <span class="name">付款状态：</span>
            <span class="value">{{productInfo.payStatus}}</span>
          </div>
        </div>
        <div class="purchaseOrderTable">
          <el-table :data="productInfo.purchaseProductList" border style="width: 100%">
            <el-table-column label="图片" align="center" min-width="80">
              <template slot-scope="scope">
                <img class="img" :src="scope.row.goodsUrl">
              </template>
            </el-table-column>
            <el-table-column prop="skuId" label="SKU" align="center" min-width="110"></el-table-column>
            <el-table-column prop="goodsName" label="产品名称" align="center" min-width="170"></el-table-column>
            <el-table-column prop="purchasePrice" label="采购价（元）" align="center" min-width="100"></el-table-column>
            <el-table-column prop="purchaseAmount" label="采购数量（套）" align="center" min-width="100"></el-table-column>
            <el-table-column prop="remainArrivalAmount" label="剩余到货数（套）" align="center" min-width="100"></el-table-column>
            <el-table-column prop="arrivalingAmount" label="到货中数量（套）" align="center" min-width="100"></el-table-column>
            <el-table-column prop="arrivaledAmount" label="已到货数量（套）" align="center" min-width="100"></el-table-column>
            <el-table-column prop="arriveCount" label="本次到货数量（套）" align="center" min-width="130">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.arriveCount" :min="0" :controls="false" placeholder="请输入"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 确认添加 -->
        <div class="submit">
          <el-button type="primary" size="medium" @click="dialogVisible = true" class="submitBtn">确认添加</el-button>
        </div>
      </div>
    </div>
    <!-- 确认添加弹窗 -->
    <el-dialog title="确定申请" :visible.sync="dialogVisible" width="35%">
      <div class="dialogContent">确定要申请到货吗？确定后将生成一条入库单，你可以联系仓库管理员在入库管理中进行入库</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '采购管理',
        path: '/F0301/F030101'
      }, {
        name: '采购单',
        path: '/F0301/F030101'
      }, {
        name: '采购到货',
        path: ''
      }],
      productInfo: {}, //产品信息
      dialogVisible: false,
    }
  },
  created() {
    this.queryInfo();
  },
  methods: {
    queryInfo() {
      window.axios.get(`/purchase/toArrival/${this.$route.query.purchaseId}`).then((data) => {
        if (data.code !== 0) return
        let obj = data.data;
        obj.arrivalStatus = obj.arrivalStatus === 1 ? "未完成" : "已完成";
        obj.payStatus = obj.payStatus === 1 ? "未完成" : "已完成";
        this.productInfo = obj;
      })
    },

    // 确认添加
    confirmAdd() {
      let params = {
        warehouseId: this.productInfo.warehouseId,
        supplierId: this.productInfo.supplierId,
        deliverSn: '',
        purchaseOrderSn: this.productInfo.purchaseId,
        remark: '',
        goods: []
      }
      this.productInfo.purchaseProductList.map((item) => {
        params.goods.push({
          goodsId: item.goodsId,
          arriveCount: item.arriveCount
        })
      })
      window.axios.post("/checkinorder/createp", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("确认添加成功");
        this.$router.push({
          path: "/F0301/F030101"
        })
      })
    }
  },
};
</script>
<style lang="less" scoped>
.arrivePage_wrap {
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  min-height: calc(100% - 50px);
  font-size: 12px;
  .header {
    color: #666666;
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    padding-left: 20px;
    border: 1px solid #e4e4e4;
  }

  .contentArea {
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: none;
    .contentTop {
      color: #666666;
      padding-top: 40px;
      display: flex;
      padding-left: 40px;
      >div {
        margin-right: 50px;
      }
    }
    .purchaseOrderTable {
      padding: 30px;
      .el-table {
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
.el-dialog__wrapper {
  /deep/.el-dialog__body {
    .dialogContent {
      line-height: 26px;
    }
  }
}
</style>