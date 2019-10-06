<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList"></crumbs>
  <div class="outStoreDetail_wrap">
		<div class="storeDetail">
      <!-- 基础信息 -->
      <div class="header"> <i class="el-icon-collection-tag"></i> 基础信息</div>
      <section class="table">
        <el-row v-for="(item, index) in tableList" :key="index">
          <el-col :span="4" class="bg-grey">{{item.col1}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col2]}}</el-col>
          <el-col :span="4" class="bg-grey">{{item.col3}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col4]}}</el-col>
        </el-row>
      </section>
      <!-- 产品信息 -->
      <div class="header"> <i class="el-icon-collection-tag"></i> 产品信息</div>
      <!-- 产品信息 -->
      <el-table :data="tableData.goods" border style="width: 100%" show-summary sum-text="汇总">
        <el-table-column label="图片" align="center" min-width="130">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.goodsPicUrl">
          </template>
        </el-table-column>
        <el-table-column prop="goodsSku" label="SKU" align="center" min-width="90"></el-table-column>
        <el-table-column prop="goodsName" label="产品名称" align="center" min-width="90"></el-table-column>
        <el-table-column prop="dimentions" label="外箱尺寸(cm)" align="center" min-width="90"></el-table-column>
        <el-table-column prop="fullLoadWeight" label="整箱重量(kg)" align="center" min-width="90"></el-table-column>
        <el-table-column prop="fullLoadQuantity" label="装箱数(套/箱)" align="center" min-width="90"></el-table-column>
        <el-table-column prop="quantity" label="件数" align="center" min-width="90"></el-table-column>
        <el-table-column prop="stockAvailCount" label="可用库存" align="center" min-width="90"></el-table-column>
        <el-table-column prop="count" label="本次出库" align="center" min-width="90"></el-table-column>
        <el-table-column prop="totalSpace" label="总体积(m³)" align="center" min-width="90"></el-table-column>
        <el-table-column prop="totalWeight" label="总重量(kg)" align="center" min-width="90"></el-table-column>
      </el-table>
    </div>
	</div>
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
        name: '出库单',
        path: ''
      }],
      tableList: [
        {col1: "出库单号", col2: "sn", col3: "仓库", col4: "warehouseName"},
        {col1: "出库类型", col2: "type", col3: "出库状态", col4: "status"},
        {col1: "运输方式", col2: "deliverMethod", col3: "出库时间", col4: "stockoutTime"},
        {col1: "备注", col2: "remark", col3: "", col4: ""}
      ],
      tableData: {}, 
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      axios.get(`/stockoutorder/detail/${this.$route.params.outId}`).then((data) => {
        if (data.code !== 0) return
        let obj = data.data;
        obj.status = obj.status === 0 ? "待出库" : "已出库";
        obj.type = obj.type === 0 ? "正常出库" : "退换货";
        switch (obj.deliverMethod) {
          case 0:
            obj.deliverMethod = "海运";
            break;
        
          case 1:
            obj.deliverMethod = "空运";
            break;

          case 2:
            obj.deliverMethod = "快递";
            break;

          case 3:
            obj.deliverMethod = "快船";
            break;

          case 4:
            obj.deliverMethod = "铁路";
            break;
        }

        for (const key in obj) {
          obj[key] = obj[key] === null ? "--" : obj[key];
        }
        obj.goods.map((item) => {
          // 外箱尺寸(cm)
          item.dimentions = item.cartonLength + " * " + item.cartonWidth + " * " + item.cartonHeight;
          // 总体积(m³)
          item.totalSpace = (item.cartonLength * item.cartonWidth * item.cartonHeight * item.quantity)/1000000;
          // 总重量(kg)
          item.totalWeight = item.fullLoadWeight * item.quantity;
        })
        this.tableData = obj;
      })
    }
  }
};
</script>
<style lang="less" scoped>
.outStoreDetail_wrap {
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .storeDetail {
    color: #666666;
    border: 1px solid #e4e4e4;
    background-color: #fff;
    padding: 0 25px;
    padding-bottom: 60px;
    .header {
      font-size: 16px;
      font-weight: bold;
      line-height: 58px;
      .el-icon-collection-tag {
        font-size: 18px;
      }
    }
    .table {
      font-size: 14px;
      border-top: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
      margin-bottom: 15px;
      .el-row {
        line-height: 45px;
        .el-col {
          height: 45px;
          border-bottom: 1px solid #e4e4e4;
          border-right: 1px solid #e4e4e4;
        }
        .bg-grey {
          text-align: right;
          background-color: #f9fafc;
          padding-right: 20px;
        }
        .content {
          padding-left: 10px;
        }
      }
    }
  }
}
</style>