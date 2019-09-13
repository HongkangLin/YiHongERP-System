<template>
  <div class="userRoleMgmt">
    <div class="search">
      <div class="head">
        <div class="label">角色权限管理</div>
        <div class="new">新增角色</div>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-select class="selList" v-model="value" placeholder="请选择角色名">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="selList" v-model="value" placeholder="请选择角色类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sel">查询</div>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="角色名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          label="角色类型"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="desc"
          align="center"
          label="描述">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pageination :total="60"></pageination>
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
      value: '',
      options: [{
        label: '我',
        value: '我'
      }],
      tableData: [{
        name: '超级管理员',
        type: '超级管理员',
        desc: '系统预设角色不支持编辑与删除'
      }, {
        name: '采购总监',
        type: '管理员',
        desc: '主管采购部，全面统筹采购业务'
      }, {
        name: '采购员',
        type: '员工',
        desc: '负责小家电采购'
      }, {
        name: '销售员',
        type: '员工',
        desc: '负责小家电销售业务'
      }]
    };
  }
}
</script>

<style lang="less">
.userRoleMgmt {
  .el-input--small .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
}
</style>

<style lang="less" scoped>
.userRoleMgmt {
  box-sizing: border-box;
  padding: 20px;
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
        &.new {
          font-size: 14px;
          background-color: #1ABC9C;
          color: white;
          width: 100px;
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
          text-align: center;
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