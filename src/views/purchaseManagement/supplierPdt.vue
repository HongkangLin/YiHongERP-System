<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="userRoleMgmt">
      <div class="search">
        <div class="head">
          <div class="label">供应中产品</div>
        </div>
      </div>
      <div class="addDiv">
        <div class="add" @click="addPdt">+添加产品</div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          border
          style="width: 100%">
          <el-table-column
            prop="goodsName"
            label="产品名称"
            align="center"
            width="180">
          </el-table-column>
          <el-table-column
            prop="goodsSKU"
            label="SKU"
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
          <span>添加产品</span>
          <i class="el-icon-close" @click="closePdt"></i>
        </div>
        <div class="content">
          <div class="search1">
            <el-input placeholder="商品名称/SKU" v-model="pdtName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchPdt"></el-button>
            </el-input>
          </div>
          <el-table
            :data="pdtList"
            key="add"
            border
            style="width: 100%">
            <el-table-column
              prop="goodsName"
              label="产品名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="skuId"
              label="SKU"
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
        name: '供应商管理',
        path: '/F0302/F030201'
      }, {
        name: '供应商管理',
        path: '/F0302/F030201'
      }, {
        name: '供应中产品',
        path: ''
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      show: false, // 是否显示添加产品
      pdtName: '', // 产品名称
      pdtList: [], // 产品列表
      list: [] // 表格数据
    };
  },
  mounted () {
    this.getPdt();
    this.getPdtList();
  },
  methods: {
    async getPdt () { // 获取供应产品信息
      let data = await window.axios.get(`/supplyrel/querybysupplier?pageSize=99999&pageNum=1&supplierId=${this.$route.params.id}`);
      this.list = data.data.list;
    },
    async getPdtList (key) { // 获取产品列表
      let data = await window.axios.post('/product/queryProductInfoList', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        skuIdOrGoodsNameOrCustomId: key
      });
      this.total = data.data.total;
      data.data.list.forEach(item => {
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (item.id === this.list[i].goodsId) {
            item.sel = true;
            break;
          }
        }
      });
      this.pdtList = data.data.list;
    },
    async handleAdd (idx) { // 添加/移除产品
      if (this.pdtList[idx].sel) { // 删除
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (this.list[i].goodsId === this.pdtList[idx].id) {
            this.handleDelete(i);
            break;
          }
        }
      } else { // 添加
        this.$set(this.pdtList[idx], 'sel', true);
        let data = await window.axios.post('/supplyrel/create', {
          list: [{
            goodsId: this.pdtList[idx].id,
            supplierId: this.$route.params.id,
            price: this.pdtList[idx].goodsGoalPrice
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
        goodsId: this.list[idx].goodsId,
        supplierId: this.$route.params.id,
        price: this.list[idx].purchasePrice
      });
      if (data.code === 0) {
        for (let i = 0, len = this.pdtList.length; i < len; i++) {
          if (this.pdtList[i].id === this.list[idx].goodsId) {
            this.pdtList[i].sel = false;
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
        goodsId: this.list[idx].goodsId,
        supplierId: this.$route.params.id,
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
      this.getPdtList('');
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.getPdtList('');
    },
    searchPdt () { // 搜索
      this.pageNum = 1;
      this.getPdtList(this.pdtName);
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