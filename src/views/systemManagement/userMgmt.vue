<template>
  <div class="userMgmt_wrap">
    <!-- 顶部面包屑 -->

    <!-- 新增或编辑用户组件 -->
    <AddOrEditPerson v-if="showAddOrEditPage"></AddOrEditPerson>

    <!-- 权限设置 > 用户管理页 -->
    <div v-else class="main">
      <!-- 侧边栏 -->
      <aside class="aside">
        <div class="top">架构管理</div>
        <div class="dptTree">
          <el-input
            class="searchDpt"
            placeholder="请输入部门名称"
            v-model="filterText">
          </el-input>
          <el-tree
            ref="dptTree"
            :data="dptTreeData"
            node-key="id"
            default-expand-all
            :filter-node-method="filterDpt"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span @click="clickTreeQueryTable(data.id)">{{ node.label + "  (" + data.userCount + ")"}}</span>
              <!-- 一级 -->
              <span v-if="node.level === 1">
                <i class="el-icon-plus"></i>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => addFirstClassDpt(node, data)">
                  新建一级部门
                </el-button>
              </span>
              <!-- 二级 -->
              <span v-if="node.level === 2" class="noBtn"></span>
              <!-- 大于等于三级 -->
              <span v-if="node.level > 2">
                <el-button
                  type="text"
                  size="mini"
                  @click="() => addDpt(node, data)">
                  新增
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => editDpt(node, data)">
                  编辑
                </el-button>
                <el-button
                  v-if="data.userCount === 0"
                  type="text"
                  size="mini"
                  @click="() => deleteDpt(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </aside>
      <!-- 主表区 -->
      <main class="mainArea">
        <!-- 顶部筛选区 -->
        <div class="searchArea">
          <div class="leftArea">
            <el-input
              size="mini"
              class="searchMatch"
              placeholder="输入员工姓名/邮箱/手机号"
              v-model="searchOpts.searchValue">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="resetPageNumAndQuery"></i>
            </el-input>
            <el-select v-model="searchOpts.roleType" placeholder="角色类型" size="mini">
              <el-option label="超级管理员" :value="1"></el-option>
              <el-option label="主管" :value="2"></el-option>
              <el-option label="员工" :value="3"></el-option>
            </el-select>
            <el-select v-model="groupHandler" placeholder="批量操作" size="mini">
              <el-option label="批量修改部门" value="1"></el-option>
              <el-option label="批量修改角色" value="2"></el-option>
            </el-select>
            <el-select v-model="searchOpts.roleId" placeholder="角色名称" size="mini">
              <el-option
                v-for="item in roleNameList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId">
              </el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="showAddOrEditPage = true">新增用户</el-button>
        </div>
        <!-- 列表区 -->
        <div class="tableArea">
          <el-table
            border
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              prop="userName"
              label="姓名"
              min-width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="email"
              label="邮箱"
              min-width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="mobile"
              label="手机号"
              min-width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="roleType"
              label="类型"
              min-width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              prop="roleName"
              label="角色"
              min-width="120"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              align="center"
              label="状态"
              min-width="120">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" @change="changeUserStatus({id: scope.row.id, action: scope.row.status})"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="small" @click="deletePerson">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页器 -->
        <Pagination :total="pagination.total" :pageNum="searchOpts.pageNum" :pageSize="searchOpts.pageSize" @changePageNum="changePageNum" @changePageSize="changePageSize"></Pagination>
      </main>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%">
      <!-- 各弹窗内容 -->
      <DialogContent :dialogType="dialogType"></DialogContent>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

	</div>
</template>

<script>
import DialogContent from './dialogContent';
import AddOrEditPerson from './addOrEditPerson';
import Pagination from '../../components/pagination/pagination';

export default {
  data() {
    return {
      dptTreeData: [], //架构树

      filterText: "",
      searchOpts: {
        deptId: 1, //部门id
        searchValue: "", //输入员工姓名/邮箱/手机号
        roleType: null, //角色类型
        roleId:  null, //角色名称
        pageSize: 10,
        pageNum: 1
      },
      groupHandler: "", //批量操作
      roleNameList: [], //角色名称下拉

      tableData: [],
      pagination: {
        total: 0
      },
      multipleSelection: [], //批量选中的项
      dialogVisible: false, //显示弹窗
      dialogType: "", //哪个弹窗
      dialogTitle: "", //弹窗标题

      showAddOrEditPage: false, //显示/新增或编辑用户页
    }
  },
  components: {
    DialogContent, //弹窗
    AddOrEditPerson, //新增或编辑用户组件
    Pagination
  },
  methods: {
    init() {
      let _this = this;
      let params = {
        deptId: 1,
        searchValue: "",
        pageNum: 1,
        pageSize: 10
      }
      axios.all([
        axios.get("/dept/queryAllDept"),
        axios.get("/role/queryAllRole4Select"),
        axios.post("/user/queryUser4DeptByPage", params)
      ])
      .then(axios.spread(function (AllDept, RoleName, UserTable) {
        _this.parseAllDptData(AllDept);
        _this.parseRoleNameData(RoleName);
        _this.parseUserTableData(UserTable);
      }));
    },

    // 架构树
    parseAllDptData(data) {
      if (data.code !== 0) return
      let arr = JSON.parse(JSON.stringify(data.data));

      let fn = (array) => {
        array.forEach(item => {
          if (item.childNodeList) item.childNodeList = fn(item.childNodeList)
          item.children = item.childNodeList;
          item.label = item.deptName;
          delete item.childNodeList;
          delete item.deptName;
        });
        return array;
      }

      this.dptTreeData = fn(arr);
    },
    
    // 角色名称
    parseRoleNameData(data) {
      if (data.code !== 0) return
      this.roleNameList = data.data;
    },
    
    // 用户信息列表
    parseUserTableData(data) {
      if (data.code !== 0) return
      data.data.list.forEach(element => {
        if (element.roleType === 1) {
          element.roleType = "超级管理员";
        } else if (element.roleType === 2) {
          element.roleType = "主管";
        } else {
          element.roleType = "员工";
        }
        element.status = Boolean(element.status);
      });
      // console.log(data.data);
      this.tableData = data.data.list;
      this.pagination.total = data.data.total;
    },
 
    resetPageNumAndQuery() {
      this.searchOpts.pageNum = 1;
      this.queryUserTable();
    },

    queryUserTable() {
      axios.post("/user/queryUser4DeptByPage", this.searchOpts).then((data) => {
        this.parseUserTableData(data);
      })
    },

    clickTreeQueryTable(deptId) {
      this.searchOpts.deptId = deptId;
      this.queryUserTable();
    },

    // 显示弹窗
    showDialog(type) {
      switch (type) {
        case "1":
        case "2":
          this.dialogTitle = "新建部门";
          break;

        case "3":
          this.dialogTitle = "编辑部门";
          break;

        case "4":
          this.dialogTitle = "删除确认";
          break;

        case "5":
          
          break;

        case "6":
          
          break;

        case "7":
          this.dialogTitle = "删除确认";
          break;
      }
      this.dialogType = type;
      this.dialogVisible = true;
    },

    // 新建一级部门
    addFirstClassDpt(node, data) {
      this.showDialog("1");
    },

    // 新增部门
    addDpt(node, data) {
      this.showDialog("2");
    },

    // 编辑部门
    editDpt(node, data) {
      this.showDialog("3");
    },

    // 删除部门
    deleteDpt(node, data) {
      this.showDialog("4");
    },
    
    // 删除个人
    deletePerson() {
      this.showDialog("7");
    },

    filterDpt(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    changePageNum(v) {
      this.searchOpts.pageNum = v;
      this.queryUserTable();
    },

    changePageSize(v) {
      this.searchOpts.pageSize = v;
      this.queryUserTable();
    },

    // 禁用/启用用户
    changeUserStatus({id, action}) {
      let params = {
        id,
        action: action ? "enable" : "disable"
      }
      axios.post("/user/enableUser", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("修改成功");
      })
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
@pageMinHeight: calc(100vh - 60px);
.userMgmt_wrap {
  .main {
    padding: 1.5% 3.5%;
    background-color: #f6f7f9;
    width: 100%;
    min-height: @pageMinHeight;
    display: flex;
    .aside {
      width: 24%;
      height: 100%;
      min-height: @pageMinHeight;
      background-color: #fcfcfc;
      border: 1px solid #e4e4e4;
      .top {
        color: #999999;
        height: 44px;
        line-height: 44px;
        padding-left: 20px;
        border-bottom: 1px solid #e4e4e4;
      }
      .dptTree {
        padding: 20px;
        .el-tree {
          /deep/.el-tree-node__content {
            height: auto;
            align-items: flex-start;
            .el-tree-node__expand-icon {
              padding-top: 0;
              &.el-icon-caret-right {
                padding-top: 4px;
              }
            }
            .custom-tree-node {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-size: 14px;
              padding-right: 8px;
              padding-top: 4px;
              .el-icon-plus {
                color: #68c0a7;
                font-weight: bold;
                padding-right: 4px;
              }
              .noBtn {
                display: block;
                width: 100%;
                height: 10px;
              }
            }
          }
        }
        .searchDpt {
          margin-bottom: 20px;
        }

      }
    }
    .mainArea {
      width: 76%;
      height: 100%;
      min-height: @pageMinHeight;
      background-color: #fff;
      border: 1px solid #e4e4e4;
      border-left: none;
      .searchArea {
        height: 44px;
        padding: 0 20px;
        border-bottom: 1px solid #e4e4e4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .leftArea {
          >div {
            margin-right: 10px;
          }
          .el-select {
            width: 105px;
          }
          .searchMatch {
            width: 220px;
            .el-icon-search:hover {
              cursor: pointer;
            }
          }
        }
        .el-button {
          
        }
      }
      .tableArea {
        padding: 20px;
      }
    }
  }
}
</style>
