<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="pdtList">
      <div class="search">
        <div class="head">
          <div class="label"><i class="el-icon-s-unfold"></i>产品信息报表</div>
          <div class="new" @click="exp">导出报表</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-select filterable class="selList" @change="search" v-model="status" placeholder="产品状态">
              <el-option
                v-for="item in prdStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-cascader
              filterable
              :options="prdType"
              class="selList"
              placeholder="产品分类"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange">
            </el-cascader>
            <el-select filterable class="selList" @change="search" v-model="brand" placeholder="品牌">
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select filterable class="selList" @change="search" v-model="people" placeholder="采购人">
              <el-option
                v-for="item in peopleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker @change="search" v-model="createTimeRange" value-format="yyyy-MM-dd" type="daterange" range-separator="" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
              <img class="img" :src="scope.row.mainPicUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsName"
            align="center"
            label="产品名称">
          </el-table-column>
          <el-table-column
            align="center"
            label="分类">
            <template slot-scope="scope">
              <div>{{scope.row.categoryParentName + '/' + scope.row.categoryName}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="fnskuId"
            align="center"
            label="FNSKU">
          </el-table-column>
          <el-table-column
            prop="brandName"
            align="center"
            label="品牌">
          </el-table-column>
          <el-table-column
            align="center"
            label="产品状态">
            <template slot-scope="scope">
              <div>{{scope.row.status ? '在售' : '停售'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsFbaFee"
            align="center"
            label="FBA费">
          </el-table-column>
          <el-table-column
            align="center"
            label="产品包装尺寸">
            <template slot-scope="scope">
              <div>{{scope.row.goodsLength + '*' + scope.row.goodsWide + '*' + scope.row.goodsHigh}}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="外箱尺寸">
            <template slot-scope="scope">
              <div>{{scope.row.packingLength + '*' + scope.row.packingWide + '*' + scope.row.packingHigh}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="goodsWeight"
            align="center"
            label="单个产品重量（kg）">
          </el-table-column>
          <el-table-column
            prop="packingWeight"
            align="center"
            label="整箱重量（kg）">
          </el-table-column>
          <el-table-column
            prop="packingQuantity"
            align="center"
            label="装箱数（套）">
          </el-table-column>
          <el-table-column
            prop="purchaserName"
            align="center"
            label="采购员">
          </el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="创建日期">
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
    <el-dialog title="导出报表" :visible.sync="ruleVisible" width="70%">
      <table class="expTable">
        <tr class="expTr">
          <td class="expTd">产品类目</td>
          <td>{{categoryName}}</td>
          <td class="expTd">品牌</td>
          <td>{{brandName}}</td>
        </tr>
        <tr class="expTr">
          <td class="expTd">采购员</td>
          <td>{{peopleName}}</td>
          <td class="expTd">状态</td>
          <td>{{statusName}}</td>
        </tr>
        <tr class="expTr">
          <td class="expTd">商品创建日期</td>
          <td>{{timeStr}}</td>
          <td class="expTd"></td>
          <td></td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitExp">确 定</el-button>
      </div>
    </el-dialog>
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
      createTimeRange: [],
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060101'
      }, {
        name: '数据报表',
        path: '/F0601/F060101'
      }, {
        name: '产品信息报表',
        path: ''
      }],
      status: '', // 产品状态
      prdStatus: [{ // 产品状态选项
        label: '全部',
        value: '-1'
      }, {
        label: '在售',
        value: '0'
      }, {
        label: '停售',
        value: '1'
      }],
      categoryParentId: '', // 一级分类
      categoryId: '', // 二级分类
      categoryName: '全部', // 分类名
      prdType: [{ // 产品分类
        label: '全部',
        value: ''
      }],
      brand: '', // 品牌
      brandList: [{ // 品牌列表
        label: '全部',
        value: '-1'
      }],
      people: '', // 采购人
      peopleList: [{ // 采购人列表
        label: '全部',
        value: '-1'
      }],
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [], // 表格数据
      ruleVisible: false
    };
  },
  computed: {
    brandName () { // 品牌名
      for (let i = 0; i < this.brandList.length; i++) {
        if (this.brand === this.brandList[i].value) {
          return this.brandList[i].label;
        }
      }
      return '全部';
    },
    peopleName () { // 采购人
      for (let i = 0; i < this.peopleList.length; i++) {
        if (this.people === this.peopleList[i].value) {
          return this.peopleList[i].label;
        }
      }
      return '全部';
    },
    statusName () { // 状态
      for (let i = 0; i < this.prdStatus.length; i++) {
        if (this.status === this.prdStatus[i].value) {
          return this.prdStatus[i].label;
        }
      }
      return '全部';
    },
    timeStr () { // 创建时间
      if (!this.createTimeRange || !this.createTimeRange.length) {
        return '';
      }
      return this.createTimeRange[0] + '~' + this.createTimeRange[1];
    }
  },
  async mounted () {
    await this.getPrdType();
    await this.getBrand();
    this.getPeople();
    this.queryList();
  },
  methods: {
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
    async getPrdType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategoryRule', {
        pageSize: 999999,
        pageNum: 1
      });
      data.data.list.forEach(item => {
        item.label = item.goodsCategoryName;
        item.value = item.id;
        item.listChildCategory.forEach(sub => {
          sub.label = sub.goodsCategoryName;
          sub.value = sub.id;
        });
        item.children = item.listChildCategory;
      });
      this.prdType.push(...data.data.list); // 初始化新增分类页面可选分类
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
      let data = await window.axios.post('/report/queryProductInfoReportList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: parseInt(this.status) < 0 ? '' : this.status,
        categoryParentId: this.categoryParentId,
        categoryId: this.categoryId,
        brandId: parseInt(this.brand) < 0 ? '' : this.brand,
        purchaserId: parseInt(this.people) < 0 ? '' : this.people,
        startTime: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[0] : '',
        endTime: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[1] : ''
      });
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    handleChange (value) { // 修改产品类型
      this.categoryParentId = value[0];
      this.categoryId = value[1] || '';
      this.categoryName = '';
      for (let i = 0; i < this.prdType.length; i++) {
        if (this.prdType[i].value === this.categoryParentId) {
          this.categoryName += this.prdType[i].label;
          if (this.categoryName === '全部') {
            break;
          }
          let label = this.prdType[i].children;
          for (let j = 0; j < label.length; j++) {
            if (this.categoryId === label[j].value) {
              this.categoryName += '/' + label[j].label;
              break;
            }
          }
        }
      }
      this.search();
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
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
    exp () { // 导出报表弹框显示
      this.ruleVisible = true;
    },
    async submitExp () { // 导出报表
      let data = await window.axios.post('/report/ProductInfoReport', {
        status: parseInt(this.status) < 0 ? '' : this.status,
        categoryParentId: this.categoryParentId,
        categoryId: this.categoryId,
        brandId: parseInt(this.brand) < 0 ? '' : this.brand,
        purchaserId: parseInt(this.people) < 0 ? '' : this.people,
        startTime: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[0] : '',
        endTime: this.createTimeRange && this.createTimeRange.length ? this.createTimeRange[1] : '',
        searchContent: `{"产品类目": "${this.categoryName}", "品牌": "${this.brandName}", "采购员": "${this.peopleName}", "状态": "${this.statusName}", "商品创建日期": "${this.timeStr}"}`
      });
      if (data.code === 0) {
        this.$router.push('/F0601/F060102');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pdtList {
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  .inputDiv {
    /deep/.el-input--small .el-input__inner {
      height: 35px;
      line-height: 35px;
    }
    /deep/.el-date-editor--daterange {
      width: 260px;
    }
  }
  /deep/.el-switch__label--left {
    color: #ccc;
  }
  /deep/.el-switch__label--right {
    color: #1ABC9C;
  }
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
      /deep/.el-icon-s-unfold {
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        font-size: 16px;
      }
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
.expTable {
  width: 100%;
  .expTr {
    line-height: 60px;
    td {
      vertical-align: middle;
      color: #666;
      width: 25%;
      padding-left: 5px;
      border: 1px solid rgb(228, 228, 228);
    }
    .expTd {
      background-color: #f2f2f2;
    }
  }
}
</style>