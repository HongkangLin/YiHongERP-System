<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList" :showReturn="false"></crumbs>
  <div class="inStoreList_wrap">
		<div class="search">
      <div class="head">
        <div class="label">出库管理</div>
        <el-button type="primary" @click="addInStore" v-if="roleCtl.stockoutorder_add">新增出库</el-button>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input maxlength="100" @change="search" class="nameKeyword" v-model="snKeyword" placeholder="出库单号"></el-input>
          <el-select filterable v-model="warehouseId" @change="search" placeholder="仓库">
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select filterable v-model="type" @change="search" placeholder="出库类型">
            <el-option label="正常出库" value=0></el-option>
            <el-option label="退换货" value=1></el-option>
          </el-select>
          <el-select filterable v-model="status" @change="search" placeholder="出库状态">
            <el-option label="待出库" value=0></el-option>
            <el-option label="已出库" value=1></el-option>
          </el-select>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sn" label="出库单号" align="center" min-width="130"></el-table-column>
        <el-table-column prop="totalQuantity" label="出库数量（件）" align="center" min-width="170"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center" min-width="120"></el-table-column>
        <el-table-column prop="type" label="出库类型" align="center" min-width="135"></el-table-column>
        <el-table-column prop="status" label="出库状态" align="center" min-width="110"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160" v-if="roleCtl.stockoutorder_detail || roleCtl.stockoutorder_update || roleCtl.stockoutorder_stockout">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.id)" v-if="roleCtl.stockoutorder_detail">查看</el-button>
            <el-divider v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_detail" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_update" type="text" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-divider v-if="scope.row.status === '待出库'" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_stockout" type="text" size="small" @click="handleInStore(scope.row.id)">出库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
	</div>
</div>
</template>

<script>
import Pageination from '#/pagination/pagination.vue';
export default {
  components: {
    Pageination
  },
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      crumbList: [{ // 面包屑
        name: '库存管理',
        path: '/F0401/F040103'
      }, {
        name: '出库管理',
        path: ''
      }],
      snKeyword: "", //搜索的关键字
      warehouseId: null, //仓库id
      status: null, //出库单状态
      type: null, //出库单类型

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [{}],
      storeList: [], //仓库下拉
      
    }
  },
  created() {
    this.getStoreList();
    this.queryList();
  },
  methods: {
    // 仓库下拉
    async getStoreList() {
      let data = await window.axios.get('/warehouse/simpList');
      if (data.code !== 0) return
      
      this.storeList = data.data;
    },

    async queryList () { 
      let params = {
        snKeyword: this.snKeyword,
        warehouseId: this.warehouseId,
        status: this.status,
        type: this.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/stockoutorder/listAll', {params});
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        item.status = item.status ? "已出库" : "待出库";
        item.type = item.type ? "退换货" : "正常出库";
      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
    },

    // 改变页码
    changeNum (num) { 
      this.pageNum = num;
      this.queryList();
    },
    
    // 改变每页条数
    changePageSize (size) { 
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },

    // 查看
    handleView(outId) {
      this.$router.push({
        path: `/F0401/F040103/${outId}`
      })
    },

    // 新增出库
    addInStore() {
      this.$router.push({
        path: '/F0401/outStoreAddOrEdit'
      })
    },

    // 编辑出库
    handleEdit(outId) {
      this.$router.push({
        path: '/F0401/outStoreAddOrEdit?outId=' + outId
      })
    },

    // 出库
    handleInStore(outId) {
      this.$router.push({
        path: '/F0401/outStore?outId=' + outId
      })
    }
  },

};
</script>
<style lang="less" scoped>
.inStoreList_wrap {
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .search {
    width: 100%;
    border: 1px solid rgb(228, 228, 228);
    .head {
      display: flex;
      justify-content: space-between;
      height: 50px;
      background-color: #f3f3f3;
      box-sizing: border-box;
      padding: 9px 20px;
      div {
        display: inline-block;
        line-height: 32px;
        &.label{
          color: #666;
        }
      }
    }
    .content {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      height: 60px;
      border-top: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      padding: 12.5px 20px;
      div {
        line-height: 32px;
        &.sel {
          width: 80px;
          font-size: 14px;
          border: 1px solid #1ABC9C;
          border-radius: 4px;
          color: #1ABC9C;
          cursor: pointer;
          text-align: center;
        }
        &.nameKeyword {
          width: 180px;
          font-size: 14px;
          border-radius: 4px;
          color: #1ABC9C;
          margin-right: 10px;
        }
        &.el-select {
          margin-right: 10px;
          width: 150px;
        }
        &.el-date-editor {
          width: 360px;
        }
        
      }
    }
  }
  .tableArea {
    background-color: #fff;
    margin-top: 25px;

    .bottom {
      border: 1px solid #ebeef4;
      border-top: none;
    }
  }
}
</style>
