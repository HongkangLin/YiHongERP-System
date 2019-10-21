<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="settleStyle">
      <div class="search">
        <div class="head">
          <div class="label">结算方式</div>
          <div class="new" v-if="roleCtl.settletype_add" @click="addSettle">新增结算方式</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="name" v-model="name" placeholder="结算方式"></el-input>
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
            prop="name"
            label="结算方式"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="createName"
            label="创建人"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="remark"
            align="center"
            label="备注">
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="roleCtl.settletype_update">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
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
        name: '供应商管理',
        path: '/F0302/F030202'
      }, {
        name: '结算方式',
        path: ''
      }],
      name: '', // 品牌名/品牌缩写
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    };
  },
  mounted () {
    this.queryList();
  },
  methods: {
    async queryList () { // 查询品牌列表
      let data = await window.axios.get(`/settletype/listAll?pageNum=${this.pageNum}&pageSize=${this.pageSize}&nameKeyword=${this.name}`);
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit (index) { // 编辑品牌
      this.$router.push({path: '/addSettle', query: {...this.tableData[index]}});
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
    addSettle () { // 新增品牌
      this.$router.push('/addSettle');
    }
  }
}
</script>

<style lang="less" scoped>
.settleStyle {
  .content {
    /deep/.el-input--small .el-input__inner {
      height: 35px;
      line-height: 35px;
    }
  }
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
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
</style>