<template>
  <div class="shippingMethod_wrap">
		<!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="order_main">
      <!-- 顶部区域 -->
      <div class="search">
        <div class="head">运输方式
          <div class="btns">
            <el-button @click="applyForPay" type="primary">新增运输方式</el-button>
          </div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" class="searchValue" @change="search" v-model="nameKeyword" placeholder="运输方式"></el-input>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <!-- 列表区域 -->
      <section class="tableArea">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="name" label="运输方式" align="center" min-width="230"></el-table-column>
          <el-table-column prop="createName" label="创建人" align="center" min-width="210"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center" min-width="260"></el-table-column>
          <el-table-column align="center" fixed="right" label="操作" width="380">
            <template slot-scope="scope">
              <a class="link" target="_self" :href="`/#/addMethod?id=${scope.row.id}&name=${scope.row.name}&remark=${scope.row.remark}`" type="text" size="small">编辑</a>
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
        name: '物流',
        path: '/F0701/F070103'
      }, {
        name: '运输方式',
        path: ''
      }],
      nameKeyword: "", // 运输方式
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
      let data = await window.axios.get(`/transport_type/listAll?nameKeyword=${this.nameKeyword}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`);
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

    // 新增运输方式
    applyForPay() {
      this.$router.push('/addMethod');
    }
  },
};
</script>
<style lang="less" scoped>
.shippingMethod_wrap {
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
        color: #666666;
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