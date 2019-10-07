<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="userRoleMgmt">
      <div class="search">
        <div class="head">
          <div class="label">已关联供应商</div>
        </div>
      </div>
      <div class="addDiv">
        <div class="add" @click="addPdt">+添加供应商</div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          border
          style="width: 100%">
          <el-table-column
            prop="supplierSN"
            label="供应商编号"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商名称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="supplierDeliverDay"
            label="交期"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            label="采购价（元）">
            <template slot-scope="scope">
              <el-input @change="changeData(scope.$index)" v-model="scope.row.purchasePrice" placeholder="输入采购价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="addSome" v-if="show">
        <div class="title">
          <span>添加供应商</span>
          <i class="el-icon-close" @click="closePdt"></i>
        </div>
        <div class="content">
          <div class="search1">
            <el-input placeholder="供应商名称" v-model="pdtName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchPdt"></el-button>
            </el-input>
          </div>
          <el-table
            :data="supplierList"
            key="add"
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
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleAdd(scope.$index)">{{scope.row.sel ? '移除' : '添加'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
        </div>
      </div>
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
        name: '产品管理',
        path: '/F0302/F030201'
      }, {
        name: '产品列表',
        path: '/F0302/F030201'
      }, {
        name: '已关联供应商',
        path: ''
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      show: false, // 是否显示添加产品
      pdtName: '', // 产品名称
      supplierList: [], // 产品列表
      list: [] // 表格数据
    };
  },
  mounted () {
    this.getPdt();
    this.getSupplierList('');
  },
  methods: {
    async getPdt () { // 获取产品供应商信息
      let data = await window.axios.get(`/supplyrel/querybygoods?pageSize=99999&pageNum=1&goodsId=${this.$route.params.id}`);
      this.list = data.data.list;
    },
    async getSupplierList (key) { // 获取供应商列表
      let data = await window.axios.get(`/supplier/listAll?pageSize=${this.pageSize}&pageNum=${this.pageNum}&snOrNameKeyword=${key}`);
      this.total = data.data.total;
      data.data.list.forEach(item => {
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (item.id === this.list[i].supplierId) {
            item.sel = true;
            break;
          }
        }
      });
      this.supplierList = data.data.list;
    },
    async handleAdd (idx) { // 添加/移除产品
      if (this.supplierList[idx].sel) { // 删除
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (this.list[i].supplierId === this.supplierList[idx].id) {
            this.handleDelete(i);
            break;
          }
        }
      } else { // 添加
        this.$set(this.supplierList[idx], 'sel', true);
        let data = await window.axios.post('/supplyrel/create', {
          list: [{
            goodsId: this.$route.params.id,
            supplierId: this.supplierList[idx].id,
            price: this.supplierList[idx].goodsGoalPrice || 0
          }]
        });
        if (data.code === 0) {
          this.$message.success(data.message);
          this.getPdt();
        } else {
          this.$message.warning(data.message);
        }
      }
    },
    async handleDelete (idx) { // 删除数据
      let data = await window.axios.post('/supplyrel/delete', {
        id: this.list[idx].relationId,
        goodsId: this.$route.params.id,
        supplierId: this.list[idx].supplierId
      });
      if (data.code === 0) {
        for (let i = 0, len = this.supplierList.length; i < len; i++) {
          if (this.supplierList[i].id === this.list[idx].supplierId) {
            this.supplierList[i].sel = false;
            break;
          }
        }
        this.$message.success(data.message);
      } else {
        this.$message.warning(data.message);
      }
      this.getPdt(); // 重新获取数据
    },
    async changeData (idx) { // 修改数据
      if (!this.list[idx].purchasePrice) {
        this.$message.warning('请输入采购价');
        return;
      }
      let data = await window.axios.post('/supplyrel/update', {
        id: this.list[idx].relationId,
        goodsId: this.$route.params.id,
        supplierId: this.list[idx].supplierId,
        price: this.list[idx].purchasePrice || 0
      });
      if (data.code === 0) {
        this.$message.success(data.message);
      } else {
        this.$message.warning(data.message);
      }
    },
    addPdt () { // 添加产品
      this.show = true;
    },
    closePdt () { // 关闭产品
      this.show = false;
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.getSupplierList('');
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.getSupplierList('');
    },
    searchPdt () { // 搜索
      this.pageNum = 1;
      this.getSupplierList(this.pdtName);
    }
  }
}
</script>

<style lang="less" scoped>
.userRoleMgmt {
  position: relative;
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  background-color: white;
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
      }
    }
  }
  .addDiv {
    border-left: 1px solid rgb(228, 228, 228);
    border-right: 1px solid rgb(228, 228, 228);
    padding: 30px 20px;
  }
  .add {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    background-color: #1ABC9C;
    text-align: center;
    color: white;
    border-radius: 4px;
    width: 100px;
  }
  .table {
    padding: 0 20px 10px;
    border-left: 1px solid rgb(228, 228, 228);
    border-right: 1px solid rgb(228, 228, 228);
    border-bottom: 1px solid rgb(228, 228, 228);
    /deep/.el-input--small {
      width: 300px;
    }
  }
  .addSome {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 30%;
    width: 600px;
    background-color: white;
    border: 1px solid rgb(228, 228, 228);
    border-radius: 4px;
    -moz-box-shadow:0px 0px 7px rgb(228, 228, 228);
    -webkit-box-shadow:0px 0px 7px rgb(228, 228, 228);
    box-shadow:0px 0px 7px rgb(228, 228, 228);
    .title {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      font-size: 16px;
      align-items: center;
      border-bottom: 1px solid rgb(228, 228, 228);
      background-color: rgba(243, 243, 243, 1);
      padding: 0 15px;
      color: #777;
      i {
        cursor: pointer;
      }
    }
    .content {
      box-sizing: border-box;
      padding: 20px;
      .search1 {
        width: 100px;
        margin-bottom: 10px;
        /deep/.el-input--small .el-input__inner {
          width: 200px;
          height: 35px;
          line-height: 35px;
        }
      }
    }
  }
}
</style>