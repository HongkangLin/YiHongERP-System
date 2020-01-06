<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="supplierManagement">
      <div class="search">
        <div class="head">
          <div class="label"><i class="el-icon-s-unfold"></i>供应商信息报表</div>
          <div class="new" @click="exp" v-if="roleCtl.supplier_info_export">导出报表</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="selList" @change="search" v-model="name" placeholder="供应商名称/编号"></el-input>
            <el-select filterable class="selList" @change="search" v-model="settle" placeholder="结算方式">
              <el-option
                v-for="item in settleSel"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select filterable class="selList" @change="search" v-model="level" placeholder="供应商等级">
              <el-option
                v-for="item in levelList"
                :key="item.label"
                :label="item.label"
                :value="item.label">
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
            prop="sn"
            label="供应商编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="供应商名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="shortname"
            label="简称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="level"
            label="供应商等级"
            align="center">
          </el-table-column>
          <el-table-column
            prop="source"
            label="供应商来源"
            align="center">
          </el-table-column>
          <el-table-column
            prop="taxRate"
            label="税率"
            align="center">
          </el-table-column>
          <el-table-column
            prop="settleTypeName"
            label="结算方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="pubAccountCompanyName"
            label="收款单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop="priAccountName"
            label="收款人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="priAccountNo"
            label="收款账号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="deliverDay"
            label="交期（天）"
            align="center">
          </el-table-column>
          <el-table-column
            prop="contactName"
            label="联系人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系电话"
            align="center">
          </el-table-column>
          <el-table-column
            label="详细地址"
            align="center">
            <template slot-scope="scope">
              <div>{{scope.row.addrProvince + scope.row.addrCity}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
    <el-dialog title="导出报表" :visible.sync="ruleVisible" width="70%">
      <table class="expTable">
        <tr class="expTr">
          <td class="expTd">供应商名称</td>
          <td>{{name || '全部'}}</td>
          <td class="expTd">结算方式</td>
          <td>{{settleName}}</td>
        </tr>
        <tr class="expTr">
          <td class="expTd">供应商等级</td>
          <td>{{level || '全部'}}</td>
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
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060101'
      }, {
        name: '数据报表',
        path: '/F0601/F060101'
      }, {
        name: '供应商信息报表',
        path: ''
      }],
      level: '',
      levelList: [{
          label: 'A'
        }, {
          label: 'B'
        }, {
          label: 'C'
        }, {
          label: 'D'
      }],
      settle: '',
      settleSel: [], // 结算方式
      name: '', // 供应商名称/编号
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      ruleVisible: false
    };
  },
  computed: {
    settleName () { // 结算方式
      for (let i = 0; i < this.settleSel.length; i++) {
        if (this.settle === this.settleSel[i].id) {
          return this.settleSel[i].name;
        }
      }
      return '全部';
    }
  },
  mounted () {
    this.getSettle();
    this.queryList();
  },
  methods: {
    async getSettle () { // 获取结算方式
      let data = await window.axios.get(`/settletype/simpList`);
      data.data.forEach(item => {
        item.label = item.name,
        item.value = item.id
      });
      this.settleSel = data.data;
    },
    async queryList () { // 获取供应商列表
      let data = await window.axios.post('/report/querySupplierInfoReportList', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.name,
        level: this.level,
        settleType: this.settle
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
      let data = await window.axios.post('/report/supplierInfoReport', {
        name: this.name,
        level: this.level,
        settleType: this.settle,
        searchContent: `{"供应商名称": "${this.name || '全部'}", "结算方式": "${this.settleName}", "供应商等级": "${this.level || '全部'}"}`
      });
      if (data.code === 0) {
        this.$router.push('/F0601/F060102');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.supplierManagement {
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