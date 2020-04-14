<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList" :showReturn="false"></crumbs>
  <div class="inStoreList_wrap">
		<div class="search">
      <div class="head">
        报关单
        <el-button type="primary" @click="openAddWindow">添加报关单</el-button>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input maxlength="100" @change="search" class="nameKeyword" v-model="keyword" placeholder="出库单号"></el-input>
          <el-select filterable v-model="deliverMethod" @change="search" placeholder="运输方式">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in deliverMethodList" :key="index"></el-option>
          </el-select>
          <el-date-picker
            v-model="stockoutDate"
            value-format="yyyy-MM-dd"
            type="date"
            @change="search"
            placeholder="请选择出库日期">
          </el-date-picker>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="stockoutOrderSn" label="出库单号" align="center" min-width="130"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center" min-width="130"></el-table-column>
        <el-table-column prop="whName" label="仓库" align="center" min-width="120"></el-table-column>
        <el-table-column prop="deliverMethodName" label="运输方式" align="center" min-width="130"></el-table-column>
        <el-table-column label="出库国家" align="center" min-width="135">
          <template slot-scope="scope">
            <span>{{['美国', '英国', '德国', '日本', '法国'][scope.row.outCountryId]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="110">
          <template slot-scope="scope">
            <span>{{['未生成', '已生成'][scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stockoutTime" label="出库日期" align="center" min-width="130"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downLoad(scope.row.downUrl)" v-if="scope.row.status === 1">下载</el-button>
            <el-button type="text" size="small" @click="generate(scope.row.stockoutOrderSn)" v-else>生成</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
	</div>
  <el-dialog title="添加报关单" :visible.sync="closeVisible" width="40%">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="出库单号: " prop="sn">
        <el-input maxlength="100" v-model="form.sn" placeholder="请输入完整的出库单号"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="color: #999;">仅限未生成报关单的出库单</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeVisible = false">取 消</el-button>
      <el-button type="primary" @click="addDeclaration">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import Pageination from '#/pagination/pagination.vue';
export default {
  components: {
    Pageination
  },
  data() {
    return {
      // roleCtl: this.$store.state.role.roleCtl,
      deliverMethodList: [],
      closeVisible: false,
      crumbList: [{ // 面包屑
        name: '财务',
        path: '/F0501/F050102'
      }, {
        name: '报关单',
        path: ''
      }],
      keyword: "", //搜索的关键字
      deliverMethod: null, // 运输方式
      stockoutDate: '', // 出库日期

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [],
      form: {
        sn: ''
      },
      rules: {
        sn: [
          { required: true, message: '请输入完整的出库单号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryList();
    this.getDeliverMethodList();
  },
  methods: {
    downLoad(url) {
      window.open(url);
    },
    async queryList () { 
      let params = {
        keyword: this.keyword,
        deliverMethod: this.deliverMethod,
        stockoutDate: this.stockoutDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/customsdecl/listAll', {params});
      if (data.code !== 0) return
      this.tableData = data.data.list;
      this.total = data.data.total;
    },

    getDeliverMethodList() {
      window.axios.get(`/transport_type/simpList`).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          this.deliverMethodList = data.data;
        }
      });
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
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

    handle(sn, cb) {
      window.axios.post(`/customsdecl/create`, { sn }).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          this.$message.success('生成成功，现在可以下载报关单！');
          setTimeout(() => {
            this.queryList();
            cb && cb();
          }, 500);
        }
      });
    },

    generate(sn) {
      window.axios.post(`/customsdecl/generate`, { sn }).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          this.$message.success('生成成功，现在可以下载报关单！');
          setTimeout(() => {
            this.queryList();
          }, 500);
        }
      });
    },

    openAddWindow() {
      this.form.sn = '';
      this.closeVisible = true;
    },

    // 添加报关单
    addDeclaration() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.handle(this.form.sn, () => {
            this.closeVisible = false;
          })
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.inStoreList_wrap {
  .link {
    color:#1ABC9C;
    cursor: pointer;
    user-select: none;
  }
  box-sizing: border-box;
  padding: 20px 60px;
  background-color: #f6f7f9;
  width: 100%;
  height: 100%;
  font-size: 12px;
  .search {
    width: 100%;
    border: 1px solid rgb(228, 228, 228);
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666666;
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
      }
    }
    .el-tabs {
      /deep/.el-tabs__header {
        .el-tabs__nav-wrap::after {
          display: none!important;
        }
        .el-tabs__nav {
          margin-left: 20px;
          .el-tabs__item {
            padding: 0 40px;
            &:nth-child(2) {
              padding-left: 16px;
            }
            &:last-child {
              padding-right: 16px;
            }
          }
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
          margin-right: 10px;
        }
        &.el-select {
          margin-right: 10px;
          width: 150px;
        }
        &.el-date-editor {
          width: 360px;
        }
        
      }
    }
  }
  .tableArea {
    background-color: #fff;
    margin-top: 25px;

    .bottom {
      border: 1px solid #ebeef4;
      border-top: none;
    }
  }
}
</style>
