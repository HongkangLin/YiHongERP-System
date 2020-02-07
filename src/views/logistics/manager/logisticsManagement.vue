<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">物流商管理</div>
          <div class="new" v-if="roleCtl.brand_add" @click="addBrand">新增物流商</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="name" @change="search" maxlength="100" v-model="name" placeholder="物流商名称/编号"></el-input>
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
            prop="companyId"
            label="物流商编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="物流商名称"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            label="所在地">
            <template slot-scope="scope">
              <span>{{scope.row.addrProvince + scope.row.addrCity}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#1ABC9C"
                active-text="启用"
                inactive-text="禁用"
                @change="changeStatus(scope.$index, scope.row.id, scope.row.status)"
                inactive-color="#ccc">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="createIdName"
            label="创建人"
            align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="roleCtl.brand_update || roleCtl.brand_delete">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.brand_update"
                @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-divider direction="vertical" v-if="roleCtl.brand_update && roleCtl.brand_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.brand_update"
                @click="handleLook(scope.row.id)">查看</el-button>
              <el-divider direction="vertical" v-if="roleCtl.brand_update && roleCtl.brand_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.brand_delete"
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
      roleCtl: this.$store.state.role.roleCtl,
      crumbList: [{ // 面包屑
        name: '物流',
        path: '/F0701/F070102'
      }, {
        name: '物流商管理',
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
    async queryList () { // 查询物流商列表
      let data = await window.axios.post('/express/queryExpressCompanyInfoList', {
        snOrNameKeyword: this.name.toUpperCase(),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      data = data.data;
      this.total = data.total;
      data.list.forEach(item => {
        item.status = !!item.status;
      });
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit (_id) { // 编辑物流商
      this.$router.push({path: '/addLogistics', query: {id: _id}});
    },
    handleLook (_id) { // 查看
      this.$router.push({path: '/logisticsDetail', query: {id: _id}});
    },
    handleDelete (index) { // 删除品牌
      this.$confirm('确定要删除此供应商吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.post('/express/deleteExpressCompanyInfo', {
          id: this.tableData[index].id
        }).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.message,
              type: 'success'
            });
            if (this.tableData.length === 1) { // 当前页最后一条数据
              this.pageNum = (this.pageNum - 1) || 1;
            }
            this.queryList(); // 重新获取数据
          }
        });
      });
    },
    changeStatus (idx, id, status) { // 修改销售状态
      if (!status) {
        this.$confirm('确定要禁用该物流商吗？禁用后出库时当前物流商将不可见，数据将不受到任何影响', '禁用物流商', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitStatus(id, status);
        }).catch(() => {
          this.tableData[idx].status = true;
        });
      } else {
        this.submitStatus(id, status);
      }
    },
    async submitStatus (id, status) { // 提交修改的状态
      let data = await window.axios.post('/express/deleteExpressCompanyInfo', {
        id: id,
        newStatus: ~~status
      });
      if (data.code === 0) {
        this.$message.success(data.message);
      }
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
    addBrand () { // 新增品牌
      this.$router.push('/addLogistics');
    }
  }
}
</script>

<style lang="less" scoped>
.brandManagement {
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