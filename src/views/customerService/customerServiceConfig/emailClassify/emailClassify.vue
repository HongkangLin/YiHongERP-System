<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">邮件分类</div>
          <div class="new" @click="addClassify" v-if="roleCtl.mailitem_add">+添加分类</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input
              class="name"
              @change="search"
              maxlength="100"
              v-model="nameKeyword"
              placeholder="分类名称"
            ></el-input>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="itemName" label="分类名称" align="center"></el-table-column>
          <el-table-column prop="createName" label="创建人" align="center"></el-table-column>
          <el-table-column align="center" label="类型">
            <template slot-scope="scope">{{scope.itemType==0?"系统预设":"用户自定义"}}</template>
          </el-table-column>
          <el-table-column prop="bak" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.mailitem_update"
                @click="handleEdit(scope.row.id)"
              >编辑</el-button>
              <el-divider direction="vertical" v-if="roleCtl.mailitem_update&&roleCtl.mailitem_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.mailitem_delete"
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
      crumbList: [
        {
          // 面包屑
          name: "客服配置",
          path: "/F1002/F100202"
        },
        {
          name: "邮件分类",
          path: ""
        }
      ],
      nameKeyword: "", // 品牌名/品牌缩写
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    };
  },
  mounted() {
    this.roleCtl.mailitem_query&& this.queryList();
  },
  methods: {
    async queryList() {
      // 查询物流商列表
      this.API.list({
        nameKeyword: this.nameKeyword.toUpperCase(),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          this.tableData = [...res.data.list];
        }
      });
    },
    search() {
      // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit(_id) {
      // 编辑
      this.$router.push({ path: "/addClassify", query: { id: _id } });
    },
    handleDelete(index) {
      // 删除品牌
      this.$confirm("确定要删除当前邮件分类吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.API.delete({ id: this.tableData[index].id }).then(data => {
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
    changeStatus(idx, id, status) {
      // 修改销售状态
      if (!status) {
        this.$confirm(
          "确定要禁用该物流商吗？禁用后出库时当前物流商将不可见，数据将不受到任何影响",
          "禁用物流商",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.submitStatus(id, status);
          })
          .catch(() => {
            this.tableData[idx].status = true;
          });
      } else {
        this.submitStatus(id, status);
      }
    },
    async submitStatus(id, status) {
      // 提交修改的状态
      let data = await window.axios.post("/express/deleteExpressCompanyInfo", {
        id: id,
        newStatus: ~~status
      });
      if (data.code === 0) {
        this.$message.success(data.message);
      }
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
    addClassify() {
      // 新增品牌
      this.$router.push("/addClassify");
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
      // justify-content: space-between;
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