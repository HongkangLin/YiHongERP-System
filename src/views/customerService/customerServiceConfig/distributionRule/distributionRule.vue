<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">分发规则</div>
          <div class="new" @click="addDistributionRule" v-if="roleCtl.mailitemrule_add">+添加规则</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input
              class="selList"
              @change="search"
              maxlength="100"
              v-model="rulename"
              placeholder="规则名称"
            ></el-input>
            <el-select
              v-model="shopname"
              clearable
              filterable
              placeholder="网店名称"
              class="selList"
              @change="search"
            >
              <el-option
                v-for="(item,index) in shopNameList"
                :key="index"
                :label="item.shopName"
                :value="item.shopName"
              ></el-option>
            </el-select>
            <el-select
              v-model="itemId"
              clearable
              filterable
              placeholder="邮件分类"
              class="selList"
              @change="search"
            >
              <el-option
                v-for="(item,index) in simpList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-date-picker
              @change="search"
              v-model="createTimeRange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="shopName" label="网店名称" align="center"></el-table-column>
          <el-table-column prop="emailUsername" label="邮箱账号" align="center"></el-table-column>
          <el-table-column prop="ruleName" label="规则名称" align="center"></el-table-column>
          <el-table-column prop="itemName" label="邮件分类" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
          <el-table-column prop="createName" label="创建人" align="center"></el-table-column>
          <el-table-column prop="updateName" label="修改人" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.mailitemrule_update"
                @click="handleEdit(scope.row.id)"
              >编辑</el-button>
              <el-divider direction="vertical" v-if="roleCtl.mailitemrule_update&&roleCtl.mailitemrule_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.mailitemrule_delete"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage">
        <pageination
          :pageNum="pageNum"
          :total="total"
          :pageSize="pageSize"
          @changePageSize="changePageSize"
          @changePageNum="changeNum"
        ></pageination>
      </div>
    </div>
  </div>
</template>

<script>
import pageination from "#/pagination/pagination.vue";
export default {
  components: {
    pageination: pageination
  },
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      createTimeRange: [],
      crumbList: [
        {
          // 面包屑
          name: "客服配置",
          path: "/F1002/F100203"
        },
        {
          name: "分发规则",
          path: ""
        }
      ],
      shopname: "", // 品牌名/品牌缩写
      rulename: "", // 品牌名/品牌缩写
      itemId: "", // 品牌名/品牌缩写
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      simpList: [], // 邮件分类
      shopNameList: []
    };
  },
  mounted() {
    if (this.roleCtl.mailitemrule_query) {
      this.queryShopNameList();
      this.querySimpList();
      this.queryList();
    }
  },
  methods: {
    querySimpList() {
      this.API.simpList().then(res => {
        if (res.code === 0) {
          this.simpList = [...res.data];
        }
      });
    },
    queryShopNameList() {
      this.API.queryShopNameList().then(res => {
        if (res.code === 0) {
          this.shopNameList = [...res.data];
        }
      });
    },
    queryList() {
      // 查询物流商列表
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (this.shopname) {
        data.shopname = this.shopname;
      }
      if (this.rulename) {
        data.rulename = this.rulename;
      }
      if (this.itemId) {
        data.itemId = this.itemId;
      }
      if (this.createTimeRange.length) {
        data.createStartTime = this.createTimeRange[0];
        data.createEndTime = this.createTimeRange[1];
      }
      this.API.mailitemruleList(data).then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          this.tableData = res.data.list;
          // for (let i = 0; i < this.tableData.length; i++) {
          //   for (let j = 0; j < this.simpList.length; j++) {
          //     if (this.tableData[i]["id"] === this.simpList[j]["id"]) {
          //       this.tableData[i]["name"] = this.simpList[j]["name"];
          //     }
          //   }
          // }
        }
      });
    },
    search() {
      // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit(id) {
      // 编辑
      this.$router.push({ path: "/addDistributionRule", query: { id } });
    },
    handleDelete(index) {
      // 删除
      this.$confirm("确定要删除当前分发规则吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.API.mailitemruleDelete({
          id: this.tableData[index].id
        }).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.message,
              type: "success"
            });
            if (this.tableData.length === 1) {
              // 当前页最后一条数据
              this.pageNum = this.pageNum - 1 || 1;
            }
            this.queryList(); // 重新获取数据
          }
        });
      });
    },
    changeNum(num) {
      // 改变页码
      this.pageNum = num;
      this.queryList();
    },
    changePageSize(size) {
      // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },
    addDistributionRule() {
      this.$router.push("/addDistributionRule");
    }
  }
};
</script>

<style lang="less" scoped>
.brandManagement {
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
    color: #1abc9c;
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
        &.label {
          color: #666;
        }
        &.new {
          font-size: 14px;
          background-color: #1abc9c;
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
          border: 1px solid #1abc9c;
          border-radius: 4px;
          color: #1abc9c;
          cursor: pointer;
          text-align: center;
        }
        &.name {
          width: 180px;
          font-size: 14px;
          border-radius: 4px;
          color: #1abc9c;
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