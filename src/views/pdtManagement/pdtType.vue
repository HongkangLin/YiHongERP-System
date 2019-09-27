<template>
  <div class="pdtType">
    <div class="search">
      <div class="head">
        <div class="label">产品分类</div>
        <div class="new" @click="addType">+添加分类</div>
      </div>
    </div>
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :show-header="false" v-if="props.row.listChildCategory.length" style="width: 100%" :data="props.row.listChildCategory">
            <el-table-column prop="goodsCategoryName"></el-table-column>
            <el-table-column prop="goodsCategoryLevel" align="center" width="180"></el-table-column>
            <el-table-column prop="goodsCategorySortId" align="center" width="180"></el-table-column>
            <el-table-column align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(props.$index, scope.$index, scope.row.id)">编辑分类</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row.id)">删除分类</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="分类名称"
        prop="goodsCategoryName">
      </el-table-column>
      <el-table-column
        align="center"
        label="商品数量"
        width="180"
        prop="productCount">
      </el-table-column>
      <el-table-column
        align="center"
        label="分类排序"
        width="180"
        prop="goodsCategorySortId">
      </el-table-column>
      <el-table-column label="设置" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleAdd(scope.$index)">新增下级</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, '', scope.row.id)">编辑分类</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row.id)">删除分类</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
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
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      typeList: [], // 可选分类列表
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
      let data = await window.axios.post('/product/queryAllCategory', {
        pageSize: this.pageSize,
        pageNum: pageNum
      });
      this.total = data.total;
      this.tableData = data.data;
      let buf = [];
      data.data.forEach(item => {
        buf.push({
          label: item.goodsCategoryName,
          value: item.id
        });
      });
      this.typeList = buf; // 初始化新增分类页面可选分类
    },
    handleAdd (index) { // 新增下级
      this.$router.push({path: '/addType', query: {list: this.typeList, id: this.tableData[index].id, data: []}});
    },
    handleEdit (top, sub, id) { // 编辑分类
      let data = sub !== '' ? this.tableData[top].listChildCategory[sub] : this.tableData[top];
      this.$router.push({path: '/addType', query: {list: this.typeList, id: id, data: data}});
    },
    async handleDelete (id) { // 删除分类
      let data = await window.axios.post('/product/deleteCategory', {
        id: id
      });
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
    addType () { // 新增角色
      this.$router.push({path: '/addType', query: {list: this.typeList}});
    }
  }
}
</script>

<style lang="less" scoped>
.pdtType {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .search {
    width: 100%;
    border: 1px solid rgb(228, 228, 228);
    border-bottom: none;
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
  }
  /deep/.el-table__expanded-cell {
    padding: 0 !important;
    padding-left: 50px !important;
  }
  /deep/.el-table__row:last-child td{
    border-bottom: none !important;
  }
  /deep/.el-table__row td:last-child {
    border-right: none;
  }
}
</style>