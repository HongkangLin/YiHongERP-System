<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">邮箱绑定</div>
          <div class="new" @click="bindEmail" v-if="roleCtl.box_add">+绑定邮箱</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input
              class="name"
              @change="search"
              maxlength="100"
              v-model="searchValue"
              placeholder="网店名称/邮箱账号"
            ></el-input>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="shopName" label="网店名称" align="center"></el-table-column>
          <el-table-column prop="emailUsername" label="邮箱账号" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="customerUserName" label="客服" align="center"></el-table-column>
          <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.box_update"
                @click="handleEdit(scope.row.id)"
              >编辑</el-button>
              <el-divider
                direction="vertical"
                v-if="roleCtl.box_update_customer&&roleCtl.box_update"
              ></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.box_update_customer"
                @click="openDialog(scope.$index, scope.row)"
              >设置客服</el-button>
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
    <el-dialog title="设置客服" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="form">
        <el-form-item label="选择客服:" :required="true">
          <el-select v-model="form.customerId" placeholder="请选择客服">
            <el-option
              v-for="(item,index) in serviceOpt"
              :key="index"
              :label="item.userName"
              :value="item.customerId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="setService">确 定</el-button>
      </div>
    </el-dialog>
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
          path: "/F1002/F100201"
        },
        {
          name: "邮箱绑定",
          path: ""
        }
      ],
      name: "", // 品牌名/品牌缩写
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      searchValue: "",
      dialogFormVisible: false,
      serviceOpt: [],
      form: {
        id: "", //邮箱id
        customerId: "" //客服id
      }
    };
  },
  mounted() {
    if (this.roleCtl.box_query) {
      this.queryBoxInfoByPage();
      this.queryAllUserList();
    }
  },
  methods: {
    queryBoxInfoByPage() {
      // 查询邮箱列表
      let obj = {
        searchValue: this.searchValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.API.queryBoxInfoByPage(obj).then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          this.tableData = res.data.list;
        }
      });
    },
    queryAllUserList() {
      this.API.queryAllUserList().then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.serviceOpt.push({
              customerId: item.id,
              userName: item.userName
            });
          });
        }
      });
    },
    search() {
      // 查询按钮
      this.pageNum = 1;
      this.queryBoxInfoByPage();
    },
    handleEdit(id) {
      // 编辑物流商
      this.$router.push({ path: "/bindEmailCompnent", query: { id } });
    },
    close() {
      this.serviceOpt.map((item, index) => {
        if (item.customerId == 1) {
          this.serviceOpt.splice(index, 1);
        }
      });
      this.dialogFormVisible = false;
    },
    openDialog(index, row) {
      this.form.id = row.id;
      if (row.customerId == 1) {
        this.serviceOpt = [
          ...this.serviceOpt,
          {
            customerId: 1,
            userName: "管理员"
          }
        ];
      }
      this.form.customerId = row.customerId;
      // 设置客服
      this.dialogFormVisible = true;
    },
    setService() {
      if (!this.form.customerId) {
        this.$message.error("请选择客服!");
        return;
      }
      // this.form.customerId = 1;
      this.API.updateCustomer(this.form).then(res => {
        if (res.code === 0) {
          this.$message.success(`${res.message}`);
          this.queryBoxInfoByPage();
        }
        this.close()
      });
    },
    changeNum(num) {
      // 改变页码
      this.pageNum = num;
      this.queryBoxInfoByPage();
    },
    changePageSize(size) {
      // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryBoxInfoByPage();
    },
    bindEmail() {
      // 新增品牌
      this.$router.push("/bindEmailCompnent");
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

/deep/ .el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  .el-dialog__header {
    position: relative;
    font-style: normal;
    font-weight: 650;
    font-size: 16px;
    color: #666666 !important;
    padding: 0;
    padding-left: 20px;
    height: 50px;
    background-color: rgba(242, 242, 242, 1);
  }
  .el-dialog__title {
    line-height: 50px;
  }
  .el-dialog__headerbtn {
    top: 50%;
    transform: translateY(-50%);
  }
  .el-dialog__body {
    flex: 1;
    overflow: auto;
    border: 1px solid rgba(228, 228, 228, 1);
    border-left: none;
    border-right: none;
  }
}
</style>