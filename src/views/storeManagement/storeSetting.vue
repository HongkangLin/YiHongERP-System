<template>
  <div class="storeSetting_wrap">
		<div class="search">
      <div class="head">
        <div class="label">仓库设置</div>
        <div class="new" @click="addStore">添加仓库</div>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input class="nameKeyword" v-model="nameKeyword" placeholder="仓库名称/联系人"></el-input>
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
          label="仓库名称"
          align="center"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="address"
          label="仓库地址"
          align="center"
          min-width="290">
        </el-table-column>
        <el-table-column
          prop="collectorName"
          label="揽收联系人"
          align="center"
          min-width="170">
        </el-table-column>
        <el-table-column
          prop="collectorMobile"
          label="揽收联系人电话"
          align="center"
          min-width="180">
        </el-table-column>
        <el-table-column
          align="center"
          label="仓库状态"
          min-width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="splitPage">
      <pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination>
    </div>
	</div>
</template>

<script>
import pageination from '#/pagination/pagination.vue';
export default {
  components: {
    'pageination': pageination
  },
  data() {
    return {
      nameKeyword: '', //搜索内容
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    }
  },
  mounted () {
    this.queryList();
  },
  activated () {
    this.queryList();
  },
  methods: {
    // 查询仓库信息列表
    async queryList () { 
      let params = {
        nameKeyword: this.nameKeyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/warehouse/listAll', {params});
      if (data.code !== 0) return
      data.data.list.map((item) => {
        item.status = item.status === 1 ? true : false;
        item.address = item.addrProvince + item.addrCity + item.addrArea + item.addrDetail;
      })
      this.tableData = data.data.list;
      this.total = data.data.total;
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
    },

    // 查看仓库
    handleView() {

    },

    // 编辑仓库
    handleEdit (index) { 
      // this.$router.push({path: '/addBrand', query: {...this.tableData[index]}});
    },

    // 改变页码
    changeNum (num) { 
      this.pageNum = num;
      this.queryList();
    },
    
    // 改变每页条数
    changePageSize (size) { 
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },

    // 添加仓库
    addStore () { 
      
    }
  }
};
</script>
<style lang="less" scoped>
.storeSetting_wrap {
  /deep/.inputDiv .el-input--small .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
  box-sizing: border-box;
  padding: 20px 40px;
  background-color: #f6f7f9;
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
    .content {
      background-color: #fff;
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
        &.nameKeyword {
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
  .splitPage {
    padding: 4px 0 8px;
    border: 1px solid rgb(228, 228, 228);
    border-top: none;
    background-color: #fff;
  }
}
</style>
