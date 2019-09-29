<template>
  <div class="inStoreList_wrap">
		<div class="search">
      <div class="head">
        <div class="label">入库管理</div>
        <el-button type="primary" @click="addInStore">新增入库</el-button>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input class="nameKeyword" v-model="snOrNameKeyword" placeholder="入库单号/供应商名称"></el-input>
          <el-select v-model="warehouseId" placeholder="仓库">
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="status" placeholder="入库状态">
            <el-option label="待入库" value=0></el-option>
            <el-option label="已入库" value=1></el-option>
          </el-select>
          <el-date-picker v-model="arriveDateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sn" label="入库单号" align="center" min-width="130"></el-table-column>
        <el-table-column prop="" label="供应商名称" align="center" min-width="170"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center" min-width="120"></el-table-column>
        <el-table-column prop="" label="入库类型" align="center" min-width="135"></el-table-column>
        <el-table-column prop="status" label="入库状态" align="center" min-width="110"></el-table-column>
        <el-table-column prop="warehouseChargePersonName" label="仓管" align="center" min-width="75"></el-table-column>
        <el-table-column prop="arriveTime" label="到货日期" align="center" min-width="200"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView">查看</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small" @click="handleEdit">编辑</el-button>
            <el-divider v-if="scope.row.status === '待入库'" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待入库'" type="text" size="small" @click="handleStore">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
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
      snOrNameKeyword: "", //搜索的关键字
      warehouseId: null, //仓库id
      status: null, //入库单状态
      arriveDateRange: [], //查询到货时间

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
        snOrNameKeyword: this.snOrNameKeyword,
        warehouseId: this.warehouseId,
        status: this.status,
        arriveStartDate: this.arriveDateRange[0],
        arriveEndDate: this.arriveDateRange[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/checkinorder/listAll', {params});
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        item.status = item.status ? "已入库" : "待入库";

      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
    },

    // 新增入库
    addInStore() {

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
    handleView() {

    },

    // 编辑
    handleEdit() {

    },

    // 入库
    handleStore() {

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
