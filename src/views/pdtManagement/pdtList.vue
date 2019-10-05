<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="pdtList">
      <div class="search">
        <div class="head">
          <div class="label">产品列表</div>
          <div class="new" @click="addPdt">新增产品</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input class="name" v-model="name" placeholder="产品名称/SKU/海关编码"></el-input>
            <el-select class="selList" v-model="status" placeholder="产品状态">
              <el-option
                v-for="item in prdStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="selList" v-model="type" placeholder="产品分类">
              <el-option
                v-for="item in prdType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="selList" v-model="brand" placeholder="品牌">
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="selList" v-model="people" placeholder="采购员">
              <el-option
                v-for="item in peopleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="skuId"
            label="SKU"
            align="center">
          </el-table-column>
          <el-table-column
            label="产品图片"
            align="center">
            <template slot-scope="scope">
              <img :src="scope.row.fnskuPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align="center"
            label="产品信息">
          </el-table-column>
          <el-table-column
            prop="fnskuId"
            align="center"
            label="FNSKU">
          </el-table-column>
          <el-table-column
            prop="customId"
            align="center"
            label="海关编码">
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            label="产品状态">
            <template slot-scope="scope">
              <div>{{scope.row.status ? scope.row.status === 1 ? '停售' : '删除' : '在售'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierCount"
            align="center"
            label="供应商">
          </el-table-column>
          <el-table-column
            prop="purchaserName"
            align="center"
            label="采购员">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleLook(scope.row.id)">查看</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
  </div>
</template>

<script>
import pageination from '#/pagination/pagination.vue';
export default {
  components: {
    'pageination': pageination
  },
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '产品管理',
        path: '/F0201/F020101'
      }, {
        name: '产品列表',
        path: ''
      }],
      name: '', // 产品名称/SKU/海关编码
      status: '', // 产品状态
      prdStatus: [{ // 产品状态选项
        label: '全部',
        value: ''
      }, {
        label: '在售',
        value: '1'
      }, {
        label: '停售',
        value: '2'
      }],
      type: '', // 产品分类
      prdType: [], // 产品分类
      brand: '', // 品牌,
      brandList: [{ // 品牌列表
        label: '全部',
        value: ''
      }],
      people: '', // 采购人
      peopleList: [{ // 采购人列表
        label: '全部',
        value: ''
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    };
  },
  mounted () {
    this.getPrdType();
    this.getBrand();
    this.getPeople();
    this.queryList();
  },
  activated () {
    this.queryList();
  },
  methods: {
    async getBrand () { // 获取品牌
      let data = await window.axios.post('/product/queryProductBrandList', {
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
    async getPrdType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategory', {
        pageSize: 999999,
        pageNum: 1
      });
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
      let buf = [{
        label: '全部',
        value: ''
      }];
      data.list.forEach(item => {
        buf.push({
          label: item.goodsCategoryName,
          value: item.id
        });
      });
      this.prdType = buf; // 初始化新增分类页面可选分类
    },
    async getPeople () { // 获取采购人
      let data = await window.axios.get('/user/queryUserList4Select/purchase');
      data.data.forEach(item => {
        item.label = item.userName,
        item.value = item.id
      });
      this.peopleList.push(...data.data);
    },
    async queryList () { // 查询列表
      let data = await window.axios.post('/product/queryProductInfoList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        skuIdOrGoodsNameOrCustomId: this.name
      });
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    handleEdit (index) { // 编辑角色
      this.$router.push({path: '/addRole', query: {id: this.tableData[index].roleId}});
    },
    async handleDelete (index) { // 删除角色
      let data = await window.axios.get(`/role/deleteRole/${this.tableData[index].roleId}`);
      this.$message({
        message: data.message,
        type: 'success'
      });
      if (this.tableData.length === 1) { // 当前页最后一条数据
        this.pageNum = (this.pageNum - 1) || 1;
      }
      this.queryList(); // 重新获取数据
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.queryList();
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },
    addPdt () { // 新增角色
      this.$router.push('/addPdt');
    }
  }
}
</script>

<style lang="less">
.pdtList {
  .el-input--small .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
}
</style>

<style lang="less" scoped>
.pdtList {
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
        &.label{
          color: #666;
        }
        &.new {
          font-size: 14px;
          background-color: #1ABC9C;
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
          border: 1px solid #1ABC9C;
          border-radius: 4px;
          color: #1ABC9C;
          cursor: pointer;
          text-align: center;
        }
        &.name {
          width: 180px;
          font-size: 14px;
          border-radius: 4px;
          color: #1ABC9C;
          margin-right: 10px;
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