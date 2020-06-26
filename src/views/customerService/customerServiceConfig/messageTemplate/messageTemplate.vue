<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="brandManagement">
      <div class="search">
        <div class="head">
          <div class="label">消息模板</div>
          <div class="new" @click="createTemplate" v-if="roleCtl.emailTemplate_add">+创建模板</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input
              class="selList"
              @change="search"
              maxlength="100"
              v-model="templateName"
              placeholder="模板名称"
            ></el-input>
            <el-select
              v-model="boxId"
              clearable
              placeholder="网店名称"
              class="selList"
              @change="search"
            >
              <el-option
                v-for="(item,index) in shopNameList"
                :key="index"
                :label="item.shopName"
                :value="item.shopId"
              ></el-option>
            </el-select>
            <el-cascader
              clearable
              placeholder="投诉分类"
              :options="complaintsClassify"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
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
          <el-table-column prop="templateName" label="模板名称" align="center"></el-table-column>
          <el-table-column prop="shopName" label="网店名称" align="center"></el-table-column>
          <el-table-column label="投诉分类" align="center">
            <template
              slot-scope="scope"
            >{{scope.row.complaintLevelOneName}}/{{scope.row.complaintLevelTwoName}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
          <el-table-column prop="createName" label="创建人" align="center"></el-table-column>
          <el-table-column prop="updateName" label="修改人" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.emailTemplate_update"
                @click="handleEdit(scope.$index)"
              >编辑</el-button>
              <el-divider direction="vertical" v-if="roleCtl.emailTemplate_update&&roleCtl.emailTemplate_delete"></el-divider>
              <el-button
                size="mini"
                type="text"
                v-if="roleCtl.emailTemplate_delete"
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
          path: "/F1002/F100204"
        },
        {
          name: "消息模板",
          path: ""
        }
      ],
      templateName: "", //模板名称
      complaintLevelOneId: "", //一级投诉类目的id
      complaintLevelTwoId: "", //二级投诉类目的id
      boxId: "", //  网店名称ID
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      shopNameList: [], //网店名称
      complaintsClassify: [] //投诉分类
    };
  },
  mounted() {
    if (this.roleCtl.emailTemplate_query) {
      this.queryList();
      this.queryAllShopNameList();
      this.queryAllCategoryRule();
    }
  },
  methods: {
    queryList() {
      let data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (this.templateName) {
        data.templateName = this.templateName;
      }
      if (this.boxId) {
        data.boxId = this.boxId;
      }
      if (this.complaintLevelOneId) {
        data.complaintLevelOneId = this.complaintLevelOneId;
      }
      if (this.complaintLevelTwoId) {
        data.complaintLevelTwoId = this.complaintLevelTwoId;
      }
      if (this.createTimeRange.length) {
        data.createStartTime = this.createTimeRange[0];
        data.createEndTime = this.createTimeRange[1];
      }
      this.API.queryEmailTemplateInfoList(data).then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          this.tableData = res.data.list;
        }
      });
    },
    queryAllCategoryRule() {
      this.API.queryAllCategoryRule({
        pageSize: 999999,
        pageNum: 1
      }).then(res => {
        if (res.code === 0) {
          res.data.list.forEach(item => {
            item.label = item.emailCategoryName;
            item.value = item.id;
            item.listChildCategory.forEach(sub => {
              sub.label = sub.emailCategoryName;
              sub.value = sub.id;
            });
            if (!item.listChildCategory.length) {
              item.listChildCategory = undefined;
            }
            item.children = item.listChildCategory;
          });
          this.complaintsClassify.push(...res.data.list); // 初始化新增分类页面可选分类
        }
      });
    },
    queryAllShopNameList() {
      this.API.queryAllShopNameList().then(res => {
        if (res.code === 0) {
          this.shopNameList = [...res.data];
        }
      });
    },
    search() {
      // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit(id) {
      // 编辑模板
      this.$router.push({
        path: "/createTemplate",
        query: {
          complaintsClassify: encodeURIComponent(
            JSON.stringify(this.complaintsClassify)
          ),
          shopNameList: encodeURIComponent(JSON.stringify(this.shopNameList)),
          data: encodeURIComponent(JSON.stringify(this.tableData[id]))
        }
      });
    },
    handleDelete(index) {
      // 删除模板
      this.$confirm("确定要删除此模板吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.API.deleteTemplate({
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
    handleChange(val) {
      this.complaintLevelOneId = val[0];
      this.complaintLevelTwoId = val[1] || "";
      this.search();
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
    createTemplate() {
      this.$router.push({
        path: "/createTemplate",
        query: {
          complaintsClassify: encodeURIComponent(
            JSON.stringify(this.complaintsClassify)
          ),
          shopNameList: encodeURIComponent(JSON.stringify(this.shopNameList))
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/variables.less";
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
    color: @themeColor;
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
          background-color: @themeColor;
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
          border: 1px solid @themeColor;
          border-radius: 4px;
          color: @themeColor;
          cursor: pointer;
          text-align: center;
        }
        &.name {
          width: 180px;
          font-size: 14px;
          border-radius: 4px;
          color: @themeColor;
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