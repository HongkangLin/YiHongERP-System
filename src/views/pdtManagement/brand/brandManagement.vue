<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">品牌列表</div>
          <div class="new" v-if="roleCtl.brand_add" @click="addBrand">新增品牌</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="name" @change="search" maxlength="100" v-model="name" placeholder="品牌名/品牌缩写"></el-input>
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
            prop="goodsBrandName"
            label="品牌名"
            align="center">
          </el-table-column>
          <el-table-column
            label="LOGO"
            align="center">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.goodsBrandPicUrl">
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsBrandLetter"
            align="center"
            label="品牌缩写">
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="roleCtl.brand_update || roleCtl.brand_delete">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.brand_update"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        name: '产品管理',
        path: '/F0201/F020103'
      }, {
        name: '品牌管理',
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
      let data = await window.axios.post('/product/queryProductBrandList', {
        goodsBrandNameOrLetter: this.name.toUpperCase(),
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
    handleEdit (index) { // 编辑品牌
      this.$router.push({path: '/addBrand', query: {...this.tableData[index]}});
    },
    handleDelete (index) { // 删除品牌
      this.$confirm('确定删除此品牌?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.post('/product/deleteProductBrand', {
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
      this.$router.push('/addBrand');
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