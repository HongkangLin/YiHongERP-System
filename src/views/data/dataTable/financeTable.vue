<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="financeTable">
      <div class="search">
        <div class="head">
          <div class="label"><i class="el-icon-s-unfold"></i>财务付款报表</div>
          <div class="new" @click="exp" v-if="roleCtl.finance_pay_export">导出报表</div>
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
            <el-date-picker @change="search" v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            prop="payId"
            label="付款单号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payAmount"
            label="付款金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="付款日期"
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
          <td class="expTd">付款日期</td>
          <td>{{timeStr}}</td>
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
      createTimeRange: [], // 日期范围
      supplier: '', // 供应商
      supplierList: [], // 供应商列表
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060101'
      }, {
        name: '数据报表',
        path: '/F0601/F060101'
      }, {
        name: '财务付款报表',
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
    },
    timeStr () { // 创建时间
      if (!this.createTimeRange || !this.createTimeRange.length) {
        return '';
      }
      return this.createTimeRange[0] + '~' + this.createTimeRange[1];
    }
  },
  mounted () {
    this.getSupplier();
    this.queryList();
  },
  methods: {
    async getSupplier () { // 获取供应商
      let data = await window.axios.get(`/supplier/simpListNoChk`);
      this.supplierList = data.data.filter(item => item.status);
    },
    async queryList () { // 获取财务付款列表
      let data = await window.axios.post('/report/queryFinancePayList', {
        supplierId: this.supplier || -1,
        payTimeStart: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[0] : '',
        payTimeEnd: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[1] : '',
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
      let _id = this.supplier || -1;
      let _start = this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[0] : '';
      let _end = this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[1] : '';
      let name = '全部';
      for(let i = this.supplierList.length; i--;) {
        if (parseInt(this.supplierList[i].id) === parseInt(_id)) {
          name = this.supplierList[i].name;
          break;
        }
      }
      let data = await window.axios.post('/report/financePayReport', {
        supplierId: _id,
        payTimeStart: _start,
        payTimeEnd: _end,
        searchContent: `{"供应商": "${name}", "付款开始时间": "${_start}", "付款结束时间": "${_end}"}`
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