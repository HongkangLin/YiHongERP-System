<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList" :showReturn="false"></crumbs>
  <div class="inventoryList_wrap">
		<div class="search">
      <div class="head">
        <div class="label">库存清单</div>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input maxlength="100" class="selList" @change="search" v-model="gnameOrSkuKeyword" placeholder="产品名称/SKU"></el-input>
          <el-select filterable v-model="warehouseId" class="selList" @change="search" placeholder="仓库">
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-cascader
            filterable
            v-model="categoryId"
            :options="prdType"
            class="selList"
            placeholder="产品分类"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange">
          </el-cascader>
          <el-select filterable class="selList" @change="search" v-model="brandId" placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select filterable class="selList" @change="search" v-model="availStatus" placeholder="库存状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="goodsSku" label="SKU" align="center" min-width="120"></el-table-column>
        <el-table-column label="产品图片" align="center" width="101">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.goodsPicUrl">
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="产品名称" align="center" min-width="230"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center" min-width="150"></el-table-column>
        <el-table-column prop="goodsWarnStorge" label="安全库存" align="center" min-width="150"></el-table-column>
        <el-table-column prop="stockAvailCount" label="可用库存" align="center" min-width="120"></el-table-column>
        <el-table-column prop="stockOnwayCount" label="在途库存" align="center" min-width="100"></el-table-column>
        <el-table-column prop="stockWaitCheckinCount" label="待入库" align="center" min-width="100"></el-table-column>
        <el-table-column prop="stockWaitStockoutCount" label="待出库" align="center" min-width="150"></el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
	</div>
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
      warehouseId: null, //仓库id
      gnameOrSkuKeyword: '', //搜索的关键字
      categoryId: '', // 产品分类
      prdType: [], // 产婆分类列表
      brandId: '', // 品牌
      brandList: [], // 品牌列表
      availStatus: '', // 库存状态
      statusList: [ // 可选库存列表
        {
          label: '有库存',
          value: 1
        }, {
          label: '无库存',
          value: 0
        }
      ],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],
      storeList: [],

      crumbList: [{ // 面包屑
        name: '库存管理',
        path: '/F0401/F040101'
      }, {
        name: '库存清单',
        path: ''
      }]
    }
  },
  created() {
    this.getPrdType();
    this.getBrand();
    this.queryList();
    this.getStoreList();
  },
  methods: {
    // 仓库下拉
    async getStoreList() {
      let data = await window.axios.get('/warehouse/simpList');
      if (data.code !== 0) return
      
      this.storeList = data.data;
    },
    async getBrand () { // 获取品牌
      let data = await window.axios.post('/product/queryProductBrandListRule', {
        goodsBrandNameOrLetter: '',
        pageNum: 1,
        pageSize: 9999999
      });
      data.data.list.forEach(item => {
        item.label = item.goodsBrandName,
        item.value = item.id
      });
      this.brandList.push(...data.data.list);
    },
    async getPrdType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategoryRule', {
        pageSize: 999999,
        pageNum: 1
      });
      data.data.list.forEach(item => {
        item.label = item.goodsCategoryName;
        item.value = item.id;
        item.listChildCategory.forEach(sub => {
          sub.label = sub.goodsCategoryName;
          sub.value = sub.id;
        });
        item.children = item.listChildCategory;
      });
      this.prdType.push(...data.data.list); // 初始化新增分类页面可选分类
    },
    handleChange (value) { // 改变产品分类
      // this.categoryParentId = value[0];
      this.categoryId = value[1];
      this.search();
    },

    async queryList () { 
      let params = {
        gnameOrSkuKeyword: this.gnameOrSkuKeyword,
        warehouseId: this.warehouseId,
        brandId: this.brandId,
        categoryId: this.categoryId,
        availStatus: this.availStatus,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/stocklist/listAll', {params});
      if (data.code !== 0) return
      
      this.tableData = data.data.list;
      this.total = data.data.total;
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


  },
};
</script>
<style lang="less" scoped>
.inventoryList_wrap {
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
  .tableArea {
    background-color: #fff;
    margin-top: 25px;
    .el-table {
      /deep/.img {
        width: 80px;
        height: 80px;
      }
    }

    .bottom {
      border: 1px solid #ebeef4;
      border-top: none;
    }
  }
}
</style>
