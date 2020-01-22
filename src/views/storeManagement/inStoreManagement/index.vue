<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList" :showReturn="false"></crumbs>
  <div class="inStoreList_wrap">
		<div class="search">
      <div class="head">
        <el-tabs v-model="activeName" class="statusTabs">
          <el-tab-pane :label="'全部/'+statusTotal.all" name="0"></el-tab-pane>
          <el-tab-pane :label="'待入库/'+statusTotal.underway" name="1"></el-tab-pane>
          <el-tab-pane :label="'已入库/'+statusTotal.completed" name="2"></el-tab-pane>
          <el-tab-pane :label="'关闭/'+statusTotal.closed" name="3"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" @click="addInStore" v-if="roleCtl.checkinorder_add">新增入库</el-button>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input maxlength="100" @change="search" class="nameKeyword" v-model="snOrNameKeyword" placeholder="入库单号/供应商名称"></el-input>
          <el-select filterable v-model="warehouseId" @change="search" placeholder="仓库">
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <!-- <el-select filterable v-model="status" @change="search" placeholder="入库状态">
            <el-option label="待入库" value=0></el-option>
            <el-option label="已入库" value=1></el-option>
          </el-select> -->
          <el-date-picker v-model="arriveDateRange" @change="search" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="到货开始日期" end-placeholder="到货结束日期"></el-date-picker>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sn" label="入库单号" align="center" min-width="130"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" align="center" min-width="170"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center" min-width="120"></el-table-column>
        <el-table-column prop="type" label="入库类型" align="center" min-width="135"></el-table-column>
        <el-table-column prop="status" label="入库状态" align="center" min-width="110"></el-table-column>
        <el-table-column prop="operator" label="操作人" align="center" min-width="75"></el-table-column>
        <el-table-column prop="arriveTime" label="到货日期" align="center" min-width="200"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160" v-if="roleCtl.checkinorder_detail || roleCtl.checkinorder_update ||roleCtl.checkinorder_checkin">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.id, scope.row.type)" v-if="roleCtl.checkinorder_detail">查看</el-button>
            <el-divider v-if="scope.row.type === '外贸入库' && scope.row.status === '待入库' && roleCtl.checkinorder_detail" direction="vertical"></el-divider>
            <el-button v-if="scope.row.type === '外贸入库' && scope.row.status === '待入库' && roleCtl.checkinorder_update" type="text" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-divider v-if="scope.row.status === '待入库'" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待入库' && roleCtl.checkinorder_checkin" type="text" size="small" @click="handleInStore(scope.row.id)">入库</el-button>
            <el-divider v-if="scope.row.status === '待入库' && roleCtl.checkinorder_close" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待入库' && roleCtl.checkinorder_close" type="text" size="small" @click="handleClose(scope.row.id)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
	</div>
  <el-dialog title="关闭入库单" :visible.sync="closeVisible" width="50%">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="关闭原因：" prop="closeReason">
        <el-input maxlength="200" type="textarea" :rows="7" v-model="form.closeReason" placeholder="请输入关闭入库单的原因，200个字符以内"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="color: red;">关闭之后将清除当前入库单的待入库数量，采购入库会将待入库数量流转回在途库存，请谨慎操作！</div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeExp">取 消</el-button>
      <el-button type="primary" @click="submitExp">确 定</el-button>
    </div>
  </el-dialog>
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
      roleCtl: this.$store.state.role.roleCtl,
      activeName: 0,
      statusTotal: {
        all: 0,
        underway: 0,
        completed: 0,
        closed: 0
      },
      closeVisible: false,
      crumbList: [{ // 面包屑
        name: '库存管理',
        path: '/F0401/F040102'
      }, {
        name: '入库管理',
        path: ''
      }],
      snOrNameKeyword: "", //搜索的关键字
      warehouseId: null, //仓库id
      status: null, //入库单状态
      arriveDateRange: [], //查询到货时间

      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize

      tableData: [],
      storeList: [], //仓库下拉
      form: {
        id: '',
        closeReason: ''
      },
      rules: {
        closeReason: [
          { required: true, message: '请输入关闭原因', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStoreList();
    this.queryList();
    this.countStatus();
  },
  watch: {
    activeName() {
      this.snOrNameKeyword = "";
      this.warehouseId = null;
      this.status = parseInt(this.activeName) - 1;
      if (this.status === -1) {
        this.status = null;
      }
      this.arriveDateRange = [];
      this.pageNum = 1;
      this.queryList();
    }
  },
  methods: {
    // 仓库下拉
    async getStoreList() {
      let data = await window.axios.get('/warehouse/simpList');
      if (data.code !== 0) return
      
      this.storeList = data.data;
    },
    async countStatus () {
      let data = await window.axios.get('/checkinorder/countStatus');
      if (data.code !== 0) return
      data.data.map(item => {
        switch (item.status) {
          case 0:
            this.statusTotal.underway = item.count;
            break;
          case 1:
            this.statusTotal.completed = item.count;
            break;
          case 2:
            this.statusTotal.closed = item.count;
            break;
          case -1:
            this.statusTotal.all = item.count;
            break;
        }
      });
    },

    async queryList () { 
      let params = {
        snOrNameKeyword: this.snOrNameKeyword,
        warehouseId: this.warehouseId,
        status: this.status,
        arriveStartDate: this.arriveDateRange ? this.arriveDateRange[0] : null,
        arriveEndDate: this.arriveDateRange ? this.arriveDateRange[1] : null,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/checkinorder/listAll', {params});
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        item.status = item.status === 2 ? "已关闭" : item.status === 1 ? "已入库" : "待入库";
        item.type = item.type ? "采购入库" : "外贸入库";
      })
      this.tableData = arr;
      this.total = data.data.total;
    },

    // 查询按钮
    search () { 
      this.pageNum = 1;
      this.queryList();
    },

    // 新增入库
    addInStore() {
      this.$router.push({
        path: '/F0401/inStoreAddOrEdit'
      })
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

    // 查看
    handleView(inId, type) {
      this.$router.push({
        path: `/F0401/F040102/${inId}?type=${type === "外贸入库"? "0" : "1"}`
      })
    },

    // 编辑
    handleEdit(inId) {
      this.$router.push({
        path: '/F0401/inStoreAddOrEdit?inId=' + inId
      })
    },

    // 入库
    handleInStore(inId) {
      this.$router.push({
        path: '/F0401/inStore?inId=' + inId
      })
    },
    handleClose (id) { // 关闭窗口触发
      this.form.id = id;
      this.closeVisible = true;
    },
    closeExp () { // 关闭弹框
      this.closeVisible = false;
      this.form.closeReason = '';
    },
    submitExp () { // 关闭
      this.$refs['form'].validate((valid) => { // 提交
        if (valid) {
          window.axios.post('/checkinorder/close', this.form).then(data => {
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              this.closeVisible = false;
              this.queryList();
            }
          });
        } else {
          return false;
        }
      });
    }
  },

};
</script>
<style lang="less" scoped>
.inStoreList_wrap {
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
          margin-right: 10px;
        }
        &.el-select {
          margin-right: 10px;
          width: 150px;
        }
        &.el-date-editor {
          width: 360px;
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
</style>
