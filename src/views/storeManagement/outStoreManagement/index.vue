<template>
<div>
  <!-- 顶部面包屑 -->
  <crumbs :list="crumbList" :showReturn="false"></crumbs>
  <div class="inStoreList_wrap">
		<div class="search">
      <div class="head">
        <el-tabs v-model="activeName" class="statusTabs">
          <el-tab-pane :label="'全部/'+statusTotal.all" name="0"></el-tab-pane>
          <el-tab-pane :label="'待出库/'+statusTotal.underway" name="1"></el-tab-pane>
          <el-tab-pane :label="'已出库/'+statusTotal.completed" name="2"></el-tab-pane>
          <el-tab-pane :label="'已关闭/'+statusTotal.closed" name="3"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" @click="addInStore" v-if="roleCtl.stockoutorder_add">新增出库</el-button>
      </div>
      <div class="content">
        <div class="inputDiv">
          <el-input maxlength="100" @change="search" class="nameKeyword" v-model="snKeyword" placeholder="出库单号"></el-input>
          <el-select filterable v-model="brandId" @change="search" placeholder="品牌">
            <el-option v-for="(item, index) in brandList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select filterable v-model="warehouseId" @change="search" placeholder="仓库">
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select filterable v-model="type" @change="search" placeholder="出库类型">
            <el-option label="正常出库" value=0></el-option>
            <el-option label="退换货" value=1></el-option>
          </el-select>
          <!-- <el-select filterable v-model="status" @change="search" placeholder="出库状态">
            <el-option label="待出库" value=0></el-option>
            <el-option label="已出库" value=1></el-option>
          </el-select> -->
          <el-select filterable v-model="deliverMethod" @change="search" placeholder="运输方式">
            <!-- <el-option label="海运" value=0></el-option>
            <el-option label="空运" value=1></el-option>
            <el-option label="快递" value=2></el-option>
            <el-option label="快船" value=3></el-option>
            <el-option label="铁路" value=4></el-option> -->
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in deliverMethodList" :key="index"></el-option>
          </el-select>
        </div>
        <div class="sel" @click="search">查询</div>
      </div>
    </div>
    <!-- 列表区 -->
    <section class="tableArea">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="sn" label="出库单号" align="center" min-width="130"></el-table-column>
        <el-table-column prop="brandName" label="品牌" align="center" min-width="130"></el-table-column>
        <el-table-column prop="totalQuantity" label="出库数量（件）" align="center" min-width="170"></el-table-column>
        <el-table-column prop="warehouseName" label="仓库" align="center" min-width="120"></el-table-column>
        <el-table-column prop="type" label="出库类型" align="center" min-width="135"></el-table-column>
        <el-table-column prop="deliverMethod" label="运输方式" align="center" min-width="130"></el-table-column>
        <el-table-column prop="status" label="出库状态" align="center" min-width="110"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center" min-width="130"></el-table-column>
        <el-table-column label="出库日期" align="center" min-width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.status !== '待出库'">{{scope.row.updateTime}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160" v-if="roleCtl.stockoutorder_detail || roleCtl.stockoutorder_update || roleCtl.stockoutorder_stockout">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="handleView(scope.row.id)" v-if="roleCtl.stockoutorder_detail">查看</el-button> -->
            <a class="link" target="_self" :href="`/#/F0401/F040103/${scope.row.id}`" v-if="roleCtl.stockoutorder_detail">查看</a>
            <el-divider v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_detail" direction="vertical"></el-divider>
            <!-- <el-button v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_update" type="text" size="small" @click="handleEdit(scope.row.id)">编辑</el-button> -->
            <a class="link" target="_self" :href="`/#/F0401/outStoreAddOrEdit?outId=${scope.row.id}`" v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_update">编辑</a>
            <el-divider v-if="scope.row.status === '待出库'" direction="vertical"></el-divider>
            <!-- <el-button v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_stockout" type="text" size="small" @click="handleInStore(scope.row.id)">出库</el-button> -->
            <a class="link" target="_self" :href="`/#/F0401/outStore?outId=${scope.row.id}`" v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_stockout">出库</a>
            <el-divider v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_close" direction="vertical"></el-divider>
            <el-button v-if="scope.row.status === '待出库' && roleCtl.stockoutorder_close" type="text" size="small" @click="handleClose(scope.row.id)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <Pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></Pageination>
      </div>
    </section>
	</div>
  <el-dialog title="关闭出库单" :visible.sync="closeVisible" width="50%">
    <el-form ref="form" class="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="关闭原因：" prop="closeReason">
        <el-input maxlength="200" type="textarea" :rows="7" v-model="form.closeReason" placeholder="请输入关闭出库单的原因，200个字符以内"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="color: red;">关闭之后将清除当前出库单的待出库数量，关闭后需要再次出库请重新添加出库单，关闭后不可撤回，请谨慎操作！</div>
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
      deliverMethodList: [],
      deliverMethod: '',
      statusTotal: {
        all: 0,
        underway: 0,
        completed: 0,
        closed: 0
      },
      brandList: [],
      closeVisible: false,
      crumbList: [{ // 面包屑
        name: '库存管理',
        path: '/F0401/F040103'
      }, {
        name: '出库管理',
        path: ''
      }],
      snKeyword: "", //搜索的关键字
      warehouseId: null, //仓库id
      status: null, //出库单状态
      type: null, //出库单类型

      brandId: '',
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [{}],
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
    this.getDeliverMethodList();
    this.getBrand();
    this.getStoreList();
    this.queryList();
    this.countStatus();
  },
  watch: {
    activeName() {
      this.snKeyword = "";
      this.warehouseId = null;
      this.status = parseInt(this.activeName) - 1;
      if (this.status === -1) {
        this.status = null;
      }
      this.type = null;
      this.pageNum = 1;
      this.queryList();
    }
  },
  methods: {
    getDeliverMethodList() {
      window.axios.get(`/transport_type/simpList`).then((data) => {
        if (data.code !== 0) {
          return;
        } else {
          this.deliverMethodList = data.data;
        }
      });
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
    // 仓库下拉
    async getStoreList() {
      let data = await window.axios.get('/warehouse/simpList');
      if (data.code !== 0) return
      
      this.storeList = data.data;
    },
    async countStatus () {
      let data = await window.axios.get('/stockoutorder/countStatus');
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
        snKeyword: this.snKeyword,
        warehouseId: this.warehouseId,
        status: this.status,
        type: this.type,
        deliverMethod: this.deliverMethod,
        brandId: this.brandId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      let data = await window.axios.get('/stockoutorder/listAll', {params});
      if (data.code !== 0) return
      let arr = data.data.list;
      arr.map((item) => {
        item.status = item.status === 2 ? "已关闭" : item.status === 1 ? "已出库" : "待出库";
        item.type = item.type ? "退换货" : "正常出库";
        for (let i = 0; i < this.deliverMethodList.length; i++) {
          if (item.deliverMethod === this.deliverMethodList[i].id) {
            item.deliverMethod = this.deliverMethodList[i].name;
          }
        }
      })
      this.tableData = arr;
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

    // 查看
    handleView(outId) {
      this.$router.push({
        path: `/F0401/F040103/${outId}`
      })
    },

    // 新增出库
    addInStore() {
      this.$router.push({
        path: '/F0401/outStoreAddOrEdit'
      })
    },

    // 编辑出库
    handleEdit(outId) {
      this.$router.push({
        path: '/F0401/outStoreAddOrEdit?outId=' + outId
      })
    },

    // 出库
    handleInStore(outId) {
      this.$router.push({
        path: '/F0401/outStore?outId=' + outId
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
          window.axios.post('/stockoutorder/close', this.form).then(data => {
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
  .link {
    color:#1ABC9C;
    cursor: pointer;
    user-select: none;
  }
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
