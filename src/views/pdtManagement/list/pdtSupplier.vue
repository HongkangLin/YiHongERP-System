<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="userRoleMgmt">
      <div class="search">
        <div class="head">
          <div class="label">已关联供应商</div>
        </div>
      </div>
      <div class="addDiv">
        <div class="add" @click="addPdt">+添加供应商</div>
      </div>
      <div class="table">
        <el-table
          :data="list"
          border
          style="width: 100%">
          <el-table-column
            prop="supplierSN"
            label="供应商编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierName"
            label="供应商名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplierDeliverDay"
            label="交期（天）"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            width="220"
            prop="purchasePrice"
            label="采购价（元）">
            <!-- <template slot-scope="scope">
              <el-input-number :min="0" :controls="false" @change="changeData(scope.$index)" v-model="scope.row.purchasePrice" placeholder="输入采购价"></el-input-number>
            </template> -->
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleAddPrice(scope.row.supplierId, scope.row.purchasePrice)">新增采购价</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="addSome" v-if="show">
        <div class="title">
          <span>添加供应商</span>
          <i class="el-icon-close" @click="closePdt"></i>
        </div>
        <div class="content">
          <div class="search1">
            <el-input maxlength="100" placeholder="供应商名称" v-model="pdtName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchPdt"></el-button>
            </el-input>
          </div>
          <el-table
            :data="supplierList"
            key="add"
            border
            style="width: 100%">
            <el-table-column
              prop="sn"
              label="供应商编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="供应商名称"
              align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleAdd(scope.$index)">{{scope.row.sel ? '移除' : '添加'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <el-pagination background layout="prev, pager, next" :pageSize="pageSize" :total="total" @current-change="changeNum"></el-pagination>
          </div>
        </div>
      </div>
      <el-dialog title="新增采购价" :visible.sync="addVisible" width="50%" top="120px">
        <el-form ref="form" class="form" :model="form" :rules="rules" label-width="170px">
          <el-form-item label="当前采购价（元）：">
            <el-input maxlength="100" disabled :value="form.currPrice"></el-input>
          </el-form-item>
          <el-form-item label="最新采购价（元）：" prop="price">
            <el-input maxlength="10" v-model="form.price" placeholder="请输入最新采购价"></el-input>
          </el-form-item>
          <el-form-item label="调价原因：" prop="remark">
            <el-input maxlength="20" v-model="form.remark" placeholder="请输入调价原因，20个字以内"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmApplyForClose">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '产品管理',
        path: '/F0302/F030201'
      }, {
        name: '产品列表',
        path: '/F0302/F030201'
      }, {
        name: '已关联供应商',
        path: ''
      }],
      addVisible: false,
      form: {
        supplierId: '',
        currPrice: '',
        price: '',
        remark: ''
      },
      rules: {
        price: [
          {required: true, message: '请输入最新采购价', trigger: 'blur'}
        ],
        remark: [
          {required: true, message: '请输入调价原因', trigger: 'blur'}
        ]
      },
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      show: false, // 是否显示添加产品
      pdtName: '', // 产品名称
      supplierList: [], // 供应商列表
      list: [] // 表格数据
    };
  },
  mounted () {
    this.getPdt();
    this.getSupplierList('');
  },
  methods: {
    async getPdt () { // 获取产品供应商信息
      let data = await window.axios.get(`/supplyrel/querybygoods?pageSize=99999&pageNum=1&goodsId=${this.$route.params.id}`);
      this.list = data.data.list;
    },
    async getSupplierList (key) { // 获取供应商列表
      let data = await window.axios.get(`/supplier/listForPopWin?pageSize=${this.pageSize}&pageNum=${this.pageNum}&snOrNameKeyword=${key}`);
      this.total = data.data.total;
      data.data.list.forEach(item => {
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (item.id === this.list[i].supplierId) {
            item.sel = true;
            break;
          }
        }
      });
      this.supplierList = data.data.list;
    },
    async handleAdd (idx) { // 添加/移除产品
      if (this.supplierList[idx].sel) { // 删除
        for (let i = 0, len = this.list.length; i < len; i++) {
          if (this.list[i].supplierId === this.supplierList[idx].id) {
            this.handleDelete(i);
            break;
          }
        }
      } else { // 添加
        let data = await window.axios.post('/supplyrel/createbyproduct', {
          list: [{
            goodsId: this.$route.params.id,
            supplierId: this.supplierList[idx].id,
            price: ''
          }]
        });
        if (data.code === 0) {
          this.$set(this.supplierList[idx], 'sel', true);
          this.$message.success(data.message);
          this.getPdt();
        }
      }
    },
    async handleDelete (idx) { // 删除数据
      if (this.list.length === 1) {
        this.$message.warning('请至少保留一个供应商');
        return;
      }
      let data = await window.axios.post('/supplyrel/delete', {
        id: this.list[idx].relationId,
        goodsId: this.$route.params.id,
        supplierId: this.list[idx].supplierId
      });
      if (data.code === 0) {
        for (let i = 0, len = this.supplierList.length; i < len; i++) {
          if (this.supplierList[i].id === this.list[idx].supplierId) {
            this.supplierList[i].sel = false;
            break;
          }
        }
        this.$message.success(data.message);
      } else {
        this.$message.warning(data.message);
      }
      this.getPdt(); // 重新获取数据
    },
    async changeData (idx) { // 修改数据
      if (!this.list[idx].purchasePrice) {
        this.$message.warning('请输入采购价');
        return;
      }
      let data = await window.axios.post('/supplyrel/updatebysupplier', {
        id: this.list[idx].relationId,
        goodsId: this.$route.params.id,
        supplierId: this.list[idx].supplierId,
        price: this.list[idx].purchasePrice || 0
      });
      if (data.code === 0) {
        this.$message.success(data.message);
      } else {
        this.$message.warning(data.message);
      }
    },
    addPdt () { // 添加产品
      this.show = true;
    },
    closePdt () { // 关闭产品
      this.show = false;
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.getSupplierList('');
    },
    searchPdt () { // 搜索
      this.pageNum = 1;
      this.getSupplierList(this.pdtName);
    },
    handleAddPrice (_id, price) {
      this.form = {
        supplierId: _id,
        currPrice: price,
        price: '',
        remark: ''
      };
      this.addVisible = true;
    },
    async confirmApplyForClose () {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let data = await window.axios.post('/supplyrel/price/add', {
            goodsId: this.$route.params.id,
            supplierId: this.form.supplierId,
            price: this.form.price,
            remark: this.form.remark
          });
          if (data.code === 0) {
            this.addVisible = false;
            this.getPdt('');
          }
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.userRoleMgmt {
  position: relative;
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  background-color: white;
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
  }
  .addDiv {
    border-left: 1px solid rgb(228, 228, 228);
    border-right: 1px solid rgb(228, 228, 228);
    padding: 30px 20px;
  }
  .add {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    background-color: #1ABC9C;
    text-align: center;
    color: white;
    border-radius: 4px;
    width: 100px;
  }
  .table {
    padding: 0 20px 10px;
    border-left: 1px solid rgb(228, 228, 228);
    border-right: 1px solid rgb(228, 228, 228);
    border-bottom: 1px solid rgb(228, 228, 228);
    /deep/.el-input--small {
      width: 150px;
      .el-input__inner {
        text-align: center;
      }
    }
  }
  .addSome {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 30%;
    width: 600px;
    background-color: white;
    border: 1px solid rgb(228, 228, 228);
    border-radius: 4px;
    -moz-box-shadow:0px 0px 7px rgb(228, 228, 228);
    -webkit-box-shadow:0px 0px 7px rgb(228, 228, 228);
    box-shadow:0px 0px 7px rgb(228, 228, 228);
    .title {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      font-size: 16px;
      align-items: center;
      border-bottom: 1px solid rgb(228, 228, 228);
      background-color: rgba(243, 243, 243, 1);
      padding: 0 15px;
      color: #777;
      i {
        cursor: pointer;
      }
    }
    .page {
      height: 60px;
      position: relative;
      .el-pagination {
        position: absolute;
        top: 20px;
        right: 0;
      }
    }
    .content {
      box-sizing: border-box;
      padding: 20px;
      .search1 {
        width: 100px;
        margin-bottom: 10px;
        /deep/.el-input--small .el-input__inner {
          width: 200px;
          height: 35px;
          line-height: 35px;
        }
      }
    }
  }
}
</style>