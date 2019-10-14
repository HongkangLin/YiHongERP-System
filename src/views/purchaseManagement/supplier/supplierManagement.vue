<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="supplierManagement">
      <div class="search">
        <div class="head">
          <div class="label">供应商管理</div>
          <div class="new" v-if="roleCtl.supplier_add" @click="addSupplier">新增供应商</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="name" v-model="name" placeholder="供应商名称/编号"></el-input>
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
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="供应商名称"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column
            label="所在地"
            align="center">
            <template slot-scope="scope">
              <div>{{scope.row.addrProvince + scope.row.addrCity}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="供应中产品"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handlePdt(scope.row.id)">{{scope.row.productCount + '种'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            width="150">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#1ABC9C"
                active-text="启用"
                inactive-text="禁用"
                :disabled="!roleCtl.supplier_enable"
                @change="changeStatus(scope.$index, scope.row.id, scope.row.status)"
                inactive-color="#ccc">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="purchaserName"
            label="采购员"
            align="center"
            width="150">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.supplier_update"
                @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-divider direction="vertical" v-if="roleCtl.supplier_update"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleLook(scope.row.id)">查看</el-button>
              <el-divider direction="vertical" v-if="roleCtl.supplier_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.supplier_delete"
                @click="handleDelete(scope.row.id)">删除</el-button>
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
        path: '/F0302/F030201'
      }, {
        name: '供应商管理',
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
    async queryList () { // 获取供应商列表
      let data = await window.axios.get(`/supplier/listAll?pageNum=${this.pageNum}&pageSize=${this.pageSize}&snOrNameKeyword=${this.name}`);
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handlePdt (id) { // 供应商产品
      this.$router.push(`/supplierPdt/${id}`);
    },
    handleEdit (id) { // 编辑供应商
      this.$router.push({path: '/addSupplier', query: {id}});
    },
    handleLook (id) { // 查看详情
      this.$router.push(`/supplierDetail/${id}`);
    },
    handleDelete (id) { // 删除供应商
      this.$confirm('确定删除此供应商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.post('/supplier/delete', {
          id: id
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
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.queryList();
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },
    addSupplier () { // 新增供应商
      this.$router.push('/addSupplier');
    },
    changeStatus (idx, id, status) { // 改变switch状态
      if (!status) {
        this.$confirm('确定要禁用该供应商吗？禁用后新增采购单时当前供应商将不可见，数据将不受到任何影响', '禁用供应商', {
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
      let data = await window.axios.post('/supplier/changestatus', {
        id: id,
        newStatus: ~~status
      });
      data.code === 0 ? this.$message.success(data.message) : this.$message.error(data.message);
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