<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="financeTable">
      <div class="search">
        <div class="head">
          <div class="label"><i class="el-icon-s-unfold"></i>库存结存采购报表</div>
          <div class="new" @click="exp" v-if="roleCtl.stock_struct_export">导出报表</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-select filterable class="selList" @change="search" v-model="supplier" placeholder="供应商名称">
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="sku"
            label="SKU"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productStatus"
            label="状态"
            align="center">
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库"
            align="center">
          </el-table-column>
          <el-table-column
            prop="stockAvailCount"
            label="库存结存"
            align="center">
          </el-table-column>
          <el-table-column
            prop="onwayCount"
            label="在途库存"
            align="center">
          </el-table-column>
          <el-table-column
            prop="purchasePrice"
            label="最新采购价（元）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="warehouseTotalPrice"
            label="在库总货值（元）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="onwayTotalPrice"
            label="在途总货值（元）"
            align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
    <el-dialog title="导出报表" :visible.sync="ruleVisible" width="70%">
      <table class="expTable">
        <tr class="expTr">
          <td class="expTd">供应商名称</td>
          <td>{{supplierName}}</td>
          <td class="expTd"></td>
          <td></td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitExp">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageination from '#/pagination/pagination.vue';
export default {
  components: {
    'pageination': pageination
  },
  data () {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      supplier: '', // 供应商
      supplierList: [], // 供应商列表
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060101'
      }, {
        name: '数据报表',
        path: '/F0601/F060101'
      }, {
        name: '库存结存采购报表',
        path: ''
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      ruleVisible: false
    };
  },
  computed: {
    supplierName () { // 供应商名称
      for (let i = 0; i < this.supplierList.length; i++) {
        if (this.supplier === this.supplierList[i].id) {
          return this.supplierList[i].name;
        }
      }
      return '全部';
    }
  },
  mounted () {
    this.getSupplier();
    this.queryList();
  },
  methods: {
    async getSupplier () { // 获取供应商
      let data = await window.axios.get(`/supplier/simpList`);
      this.supplierList = data.data.filter(item => item.status);
    },
    async queryList () { // 查询库存结存列表
      let data = await window.axios.post('/report/queryStockStructList', {
        supplierId: this.supplier || -1,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.queryList();
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },
    exp () { // 导出报表
      this.ruleVisible = true;
    },
    async submitExp () {
      let data = await window.axios.post('/report/stockStructReport', {
        supplierId: this.supplier || -1,
        searchContent: `{"供应商名称": "${this.supplierName}"}`
      });
      if (data.code === 0) {
        this.$router.push('/F0601/F060102');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.financeTable {
  .content {
    /deep/.el-input--small .el-input__inner {
      height: 35px;
      line-height: 35px;
    }
  }
  /deep/.el-switch__label--left {
    color: #ccc;
  }
  /deep/.el-switch__label--right {
    color: #1ABC9C;
  }
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  .img {
    width: 80px;
    height: 80px;
  }
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
      /deep/.el-icon-s-unfold {
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        font-size: 16px;
      }
      div {
        display: inline-block;
        line-height: 32px;
        &.label{
          color: #666;
        }
        &.new {
          font-size: 14px;
          background-color: #1ABC9C;
          color: white;
          width: 100px;
          cursor: pointer;
          text-align: center;
          border-radius: 4px;
        }
      }
    }
    .content {
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
        &.name {
          width: 180px;
          font-size: 14px;
          border-radius: 4px;
          color: #1ABC9C;
          margin-right: 20px;
        }
        .selList {
          width: 180px;
          height: 35px;
          line-height: 35px;
          margin-right: 10px;
        }
      }
    }
  }
  .table {
    margin-top: 20px;
  }
}
.expTable {
  width: 100%;
  .expTr {
    line-height: 60px;
    td {
      vertical-align: middle;
      color: #666;
      width: 25%;
      padding-left: 5px;
      border: 1px solid rgb(228, 228, 228);
    }
    .expTd {
      background-color: #f2f2f2;
    }
  }
}
</style>