<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList"></crumbs>
  <div class="storeInfo_wrap">
		<div class="storeDetail">
      <div class="header"> <i class="el-icon-collection-tag"></i> 仓库详情</div>
      <section class="table">
        <el-row v-for="(item, index) in list" :key="index">
          <el-col :span="4" class="bg-grey">{{item.col1}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col2] || "N/A"}}</el-col>
          <el-col :span="4" class="bg-grey">{{item.col3}}</el-col>
          <el-col :span="8" class="content">{{tableData[item.col4] || "N/A"}}</el-col>
        </el-row>
      </section>
    </div>
	</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      tableData: {},
      list: Object.freeze([
        {col1: "仓库编号", col2: "id", col3: "仓库名称", col4: "name"},
        {col1: "负责人", col2: "chargePersonName",col3: "联系电话",col4: ""},
        {col1: "仓库状态", col2: "status",col3: "仓库类型",col4: "type"},
        {col1: "联系人", col2: "collectorName",col3: "移动电话",col4: "collectorMobile"},
        {col1: "公司名称", col2: "companyName",col3: "固定电话",col4: "fixedPhone"},
        {col1: "邮箱地址", col2: "email",col3: "邮编",col4: "postCode"},
        {col1: "地址", col2: "address",col3: "备注",col4: "remark"}
      ]),
      // 面包屑
      crumbList: Object.freeze(
        [{ 
          name: '库存管理',
          path: '/F0401/F040104'
        }, {
          name: '仓库设置',
          path: '/F0401/F040104'
        }, {
          name: '仓库详情',
          path: ''
        }]
      )
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      const storeId = Number(this.$route.params.storeId);
      axios.get(`/warehouse/detail/${storeId}`).then((data) => {
        if (data.code !== 0) return
        let obj = data.data;
        obj.status = obj.status === 0 ? "禁用" : "启用";
        obj.type = obj.type === 0 ? "国内" : "国外";
        obj.address = obj.addrProvince + obj.addrCity + obj.addrArea + obj.addrDetail;
        this.tableData = obj;
      })
    }
  },
};
</script>
<style lang="less" scoped>
.storeInfo_wrap {
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
      border-top: 1px solid #e4e4e4;
      border-left: 1px solid #e4e4e4;
      .el-row {
        line-height: 45px;
        .el-col {
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
