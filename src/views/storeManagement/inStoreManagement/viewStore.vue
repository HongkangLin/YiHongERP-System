<template>
  <div class="viewStore_wrap">
		<div class="storeDetail">
      <div class="header"> <i class="el-icon-collection-tag"></i> 基础信息</div>
      <section class="table">
        <el-row v-for="(item, index) in tableList" :key="index">
          <el-col :span="4" class="bg-grey">{{item.col1}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col2]}}</el-col>
          <el-col :span="4" class="bg-grey">{{item.col3}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col4]}}</el-col>
        </el-row>
      </section>

    </div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      tableData: {}
    }
  },
  computed: {
    tableList() {
      if (this.$route.query.type === "0") { //外贸入库
        return [
          {col1: "入库单号", col2: "sn", col3: "入库状态", col4: "status"},
          {col1: "入库类型", col2: "type", col3: "入库仓库", col4: "warehouseName"},
          {col1: "供应商", col2: "supplierName", col3: "采购员", col4: "purchaserName"},
          {col1: "运单号", col2: "deliverSn", col3: "入库时间", col4: ""},
          {col1: "备注", col2: "remark", col3: "", col4: ""}
        ]
      } else { //采购入库
        return [
          {col1: "入库单号", col2: "sn", col3: "关联采购单", col4: "purchaseOrderSn"},
          {col1: "供应商名称", col2: "supplierName", col3: "采购员", col4: "purchaserName"},
          {col1: "入库仓库", col2: "warehouseName", col3: "入库状态", col4: "status"},
          {col1: "入库类型", col2: "type", col3: "运单号", col4: "deliverSn"},
          {col1: "入库时间", col2: "", col3: "备注", col4: "remark"}
        ]
      }
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      const id = Number(this.$route.params.inId);
      axios.get(`/checkinorder/detail/${id}`).then((data) => {
        if (data.code !== 0) return
        let obj = data.data;
        obj.status = obj.status === 0 ? "待入库" : "已入库";
        obj.type = obj.type === 0 ? "外贸入库" : "采购单入库";

        for (const key in obj) {
          obj[key] = obj[key] === null ? "--" : obj[key];
        }
        this.tableData = obj;
      })
    }
  }
};
</script>
<style lang="less" scoped>
.viewStore_wrap {
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