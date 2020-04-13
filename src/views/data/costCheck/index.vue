<template>
  <div class="costCheck_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">
          成本核算
          <div class="btns">
            <el-button @click="exportReport" type="primary">导出报表</el-button>
            <el-button @click="toCalculator()" type="primary">成本计算器</el-button>
          </div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="searchValue" @change="search" v-model="queryPara" placeholder="核算单号/产品名称/SKU"></el-input>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="accountCostId" label="核算编号" align="center" min-width="70"></el-table-column>
          <el-table-column label="产品图片" align="center" min-width="80">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.mainPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="产品名称" align="center" min-width="95"></el-table-column>
          <el-table-column prop="skuId" label="SKU" align="center" min-width="90"></el-table-column>
          <el-table-column prop="goodsFbaFee" label="FBA费（美元)" align="center" min-width="95"></el-table-column>
          <el-table-column label="运输成本（$）" align="left" min-width="78">
            <template slot-scope="scope">
              <div>空运:{{scope.row.airTransportCost}}</div>
              <div>海运:{{scope.row.shippingCost}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseCostDollar" label="采购成本（¥/$）" align="center" min-width="80"></el-table-column>
          <el-table-column label="30%利润售价（$）" align="left" min-width="98">
            <template slot-scope="scope">
              <div class="font-red">空运:{{scope.row.profitSellingPriceAir}}</div>
              <div class="font-red">海运:{{scope.row.profitSellingPriceShip}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="currentSellingPrice" label="当前售价（$）" align="center" min-width="88"></el-table-column>
          <el-table-column label="利润率" align="left" min-width="80">
            <template slot-scope="scope">
              <div>空运:{{scope.row.profitRateAir}}%</div>
              <div>海运:{{scope.row.profitRateShip}}%</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center" min-width="90"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toCalculator(scope.row.id)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
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
      // roleCtl: this.$store.state.role.roleCtl,
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060103'
      }, {
        name: '成本核算',
        path: ''
      }],

      queryPara: "",

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: []
    }
  },
  async created() {
    this.queryList();
  },
  methods: {
    async queryList () { // 获取列表
      let data = await window.axios.post(`/account_cost/queryAccountCostInfoList`, {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        queryPara: this.queryPara
      });
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

    // 导出报表
    exportReport() {
      window.axios.post("/report/accountCostInfoReport", {
        queryPara: this.queryPara
      }).then((data) => {
        if (data.code !== 0) return this.$message.error(data.message);
        this.$message.success("导出报表成功");
        this.$router.push('/F0601/F060102');
      });
    },

    // 成本计算器
    toCalculator(_id) {
      if (_id) {
        this.$router.push({path: '/F0601/F060103/addConst', query: {'id': _id}});
      } else {
        this.$router.push('/F0601/F060103/addConst');
      }
    },

    // 删除成本核算记录
    deleteRow(id) {
      window.axios.post("/account_cost/deleteAccountCostInfo", { id }).then((data) => {
        if (data.code !== 0) return this.$message.error(data.message);
        this.$message.success("删除成本核算记录成功");
        this.queryList();
      });
    }
  },
};
</script>
<style lang="less" scoped>
.costCheck_wrap {
  .link {
    color:#1ABC9C;
    cursor: pointer;
    user-select: none;
  }
  .order_main {
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
        height: 50px;
        background-color: #f3f3f3;
        box-sizing: border-box;
        padding: 9px 20px;
        font-size: 14px;
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
          &.searchValue {
            width: 200px;
            border-radius: 4px;
            color: #1ABC9C;
            margin-right: 10px;
          }
          &.el-select {
            margin-right: 10px;
            width: 110px;
          }
          &.el-date-editor {
            margin-right: 10px;
            width: 260px;
          }
          
        }
      }
    }
    .tableArea {
      background-color: #fff;
      margin-top: 25px;
      .font-red {
        color: red;
      }
      .bottom {
        border: 1px solid #ebeef4;
        border-top: none;
      }
    }
  }
  .el-dialog__wrapper {
    /deep/.el-dialog {
      .hint {
        font-size: 12px;
        color: #999999;
        margin-left: 100px;
        line-height: 16px;
      }
    }
  }
}
</style>