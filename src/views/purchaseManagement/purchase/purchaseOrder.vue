<template>
  <div class="purchaseOrder_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">
          <el-tabs v-model="activeName" class="statusTabs">
            <el-tab-pane label="全部/" name="0"></el-tab-pane>
            <el-tab-pane label="进行中/" name="1"></el-tab-pane>
            <el-tab-pane label="已完成/" name="2"></el-tab-pane>
            <el-tab-pane label="关闭中/" name="3"></el-tab-pane>
            <el-tab-pane label="已关闭/" name="4"></el-tab-pane>
          </el-tabs>
          <div class="btns">
            <el-button>申请付款</el-button>
            <el-button type="primary">新建采购单</el-button>
          </div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="searchValue" v-model="searchValue" placeholder="采购单/供应商/sku/产品名称"></el-input>
            <el-select v-model="payStatus" placeholder="付款状态" clearable>
              <el-option label="未完成" value=1></el-option>
              <el-option label="已完成" value=2></el-option>
            </el-select>
            <el-select v-model="arrivalStatus" placeholder="到货状态" clearable>
              <el-option label="未完成" value=1></el-option>
              <el-option label="已完成" value=2></el-option>
            </el-select>
            <el-date-picker v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="采购单创建日期"></el-date-picker>
            <el-date-picker v-model="arriveTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="到货日期"></el-date-picker>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column prop="" label="采购单号" align="center" min-width="100"></el-table-column>
          <el-table-column prop="" label="供应商名称" align="center" min-width="150"></el-table-column>
          <el-table-column prop="" label="SKU数量" align="center" min-width="130"></el-table-column>
          <el-table-column prop="" label="货款总金额（元）" align="center" min-width="140"></el-table-column>
          <el-table-column prop="" label="已支付货款（元）" align="center" min-width="120"></el-table-column>
          <el-table-column align="center" label="状态" width="80">
            <template slot-scope="scope">
              <div class="status">{{scope.row.purchaseStatus}}</div>
              <el-button type="text" size="small" v-if="scope.row.purchaseStatus==='关闭中' || scope.row.purchaseStatus==='已关闭'">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="" label="创建日期" align="center" min-width="110"></el-table-column>
          <el-table-column prop="" label="采购员" align="center" min-width="85"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleView(scope.row.id, scope.row.type)">详情</el-button>
              <el-divider v-if="scope.row.purchaseStatus === '进行中'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus === '进行中'" type="text" size="small">到货</el-button>
              <el-divider v-if="scope.row.purchaseStatus === '进行中'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus === '进行中'" type="text" size="small" >关闭</el-button>
              <el-divider v-if="scope.row.purchaseStatus === '关闭中'" direction="vertical"></el-divider>
              <el-button v-if="scope.row.purchaseStatus === '关闭中'" type="text" size="small">审批</el-button>
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
      crumbList: [{ // 面包屑
        name: '采购管理',
        path: '/F0301/F030101'
      }, {
        name: '采购单',
        path: ''
      }],

      activeName: "0", //采购单状态Tab
      searchValue: "", //购单、供应商、sku、产品名称
      payStatus: "", //付款状态
      arrivalStatus: "", //到货状态
      createTimeRange: [], //采购单创建日期
      arriveTimeRange: [], //到货日期

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],
      multipleSelection: [], //批量选中的项
    }
  },
  methods: {
    async queryList () { 
      let params = {
        
        
        arriveStartDate: this.arriveDateRange[0],
        arriveEndDate: this.arriveDateRange[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('', {params});
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        item.status = item.status ? "已入库" : "待入库";
        item.type = item.type ? "采购入库" : "外贸入库";
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

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang="less" scoped>
.purchaseOrder_wrap {
  .order_main {
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
        .statusTabs {}
        .btns {}
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
          &.searchValue {
            width: 200px;
            border-radius: 4px;
            color: #1ABC9C;
            margin-right: 10px;
          }
          &.el-select {
            margin-right: 10px;
            width: 110px;
          }
          &.el-date-editor {
            margin-right: 10px;
            width: 260px;
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
}
</style>