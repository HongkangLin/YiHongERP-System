<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="userRoleMgmt">
      <div class="search">
        <div class="head">
          <div class="label">角色权限管理</div>
          <div class="new" @click="addRole">新增角色</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="name" v-model="name" placeholder="请输入角色名"></el-input>
            <el-select class="selList" v-model="type" placeholder="请选择角色类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
            prop="roleName"
            label="角色名"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roleType"
            label="角色类型"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            align="center"
            label="描述">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-divider direction="vertical" v-if="scope.row.roleType !== '超级管理员'"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.roleType !== '超级管理员'"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
      crumbList: [{ // 面包屑
        name: '权限管理',
        path: '/F0101/F010102'
      }, {
        name: '角色权限管理',
        path: ''
      }],
      name: '', // 角色名
      type: '', // 类型
      typeList: ['超级管理员', '主管', '员工'],
      nameOptions: [],
      typeOptions: [{
        label: '全部',
        value: ''
      }, {
        label: '超级管理员',
        value: '1'
      }, {
        label: '主管',
        value: '2'
      }, {
        label: '员工',
        value: '3'
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    };
  },
  mounted () {
    this.queryList();
  },
  activated () {
    this.queryList();
  },
  methods: {
    async queryList () { // 查询列表
      let data = await window.axios.post('/role/queryAllRoleList', {
        roleType: this.type,
        roleName: this.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      data = data.data;
      data.list.forEach(item => {
        item.roleType = this.typeList[item.roleType - 1];
      });
      this.total = data.total;
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit (index) { // 编辑角色
      this.$router.push({path: '/addRole', query: {id: this.tableData[index].roleId}});
    },
    async handleDelete (index) { // 删除角色
      let data = await window.axios.get(`/role/deleteRole/${this.tableData[index].roleId}`);
      this.$message({
        message: data.message,
        type: 'success'
      });
      if (this.tableData.length === 1) { // 当前页最后一条数据
        this.pageNum = (this.pageNum - 1) || 1;
      }
      this.queryList(); // 重新获取数据
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
    addRole () { // 新增角色
      this.$router.push('/addRole');
    }
  }
}
</script>

<style lang="less" scoped>
.userRoleMgmt {
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