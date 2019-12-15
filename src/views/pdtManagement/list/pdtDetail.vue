<template>
  <div>
    <div class="crumbsDiv">
      <div class="changeTab">
        <span @click="changeTab(0)" :class="active === 0 ? 'active' : ''">产品信息</span>
        <span @click="changeTab(1)" :class="active === 1 ? 'active' : ''">产品图片</span>
        <!-- <span @click="changeTab(2)" :class="active === 2 ? 'active' : ''">关联供应商</span> -->
      </div>
      <div class="tool">
        <span @click="refreash"><i class="el-icon-refresh"></i>&nbsp;刷新</span>
        <span @click="goBack"><i class="el-icon-arrow-left"></i>&nbsp;返回</span>
      </div>
    </div>
    <div class="supplierDetail" v-if="active === 0">
      <div class="title"><i class="el-icon-collection-tag"></i><span>基础信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">产品分类</div></el-col>
          <el-col :span="8"><div class="td">{{info.firstName}}&nbsp;>&nbsp;{{info.seconedName}}</div></el-col>
          <el-col :span="4"><div class="td label">产品状态</div></el-col>
          <el-col :span="8"><div class="td">{{info.status ? '停售' : '在售'}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">产品品牌</div></el-col>
          <el-col :span="8"><div class="td">{{info.brandName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">产品名称</div></el-col>
          <el-col :span="8"><div class="td">{{info.goodsName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">SKU编码</div></el-col>
          <el-col :span="8"><div class="td">{{info.skuId}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">销售目标价</div></el-col>
          <el-col :span="8"><div class="td">{{info.goodsGoalPrice}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">产品链接</div></el-col>
          <el-col :span="8"><div class="td"><a target="_black" :href="info.goodsUrl">点击查看</a>&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">是否清货</div></el-col>
          <el-col :span="8"><div class="td">{{info.clearStocksFlag ? '清' : '不清'}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">FNSKU编号</div></el-col>
          <el-col :span="8"><div class="td">{{info.fnskuId}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">FNSKU文件</div></el-col>
          <el-col :span="8"><div class="td"><a target="_black" :href="info.fnskuFileUrl">点击下载</a>&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">防跟卖标签</div></el-col>
          <el-col :span="8"><div class="td"><a target="_black" :href="info.fnskuPicUrl">点击查看</a>&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">交期（天）</div></el-col>
          <el-col :span="8"><div class="td">{{maxDeliverDay}}&nbsp;</div></el-col>
        </el-row>
        <el-row type="flex" align="stretch">
          <el-col :span="4" class="td label"><div>产品描述</div></el-col>
          <el-col :span="20"><div class="td">{{info.goodsDescribe}}&nbsp;</div></el-col>
        </el-row>
        <el-row type="flex" align="stretch">
          <el-col :span="4" class="td label"><div>合同描述</div></el-col>
          <el-col :span="20"><div class="td">{{info.contractDescribe}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>报关信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">海关编码</div></el-col>
          <el-col :span="8"><div class="td">{{info.customId}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">申报价值（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.claimPrice}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">中文报关名</div></el-col>
          <el-col :span="8"><div class="td">{{info.chineseName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">英文报关名</div></el-col>
          <el-col :span="8"><div class="td">{{info.englishName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">美国进口关税（元）</div></el-col>
          <el-col :span="8"><div class="td">{{info.tariffs}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">&nbsp;</div></el-col>
          <el-col :span="8"><div class="td">&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>规格信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">产品包装尺寸（cm）</div></el-col>
          <el-col :span="8"><div class="td">{{info.goodsLength + ' * ' + info.goodsWide + ' * ' + info.goodsHigh}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">产品包装尺寸（in）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.goodsLength * 0.3937).toFixed(2) + ' * ' + (info.goodsWide * 0.3937).toFixed(2) + ' * ' + (info.goodsHigh * 0.3937).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">每个产品重量（kg）</div></el-col>
          <el-col :span="8"><div class="td">{{info.goodsWeight}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">单个产品重量（lb）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.goodsWeight * 2.2046226).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">整箱重量（kg）</div></el-col>
          <el-col :span="8"><div class="td">{{info.packingWeight}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">整箱重量（lb）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.packingWeight * 2.2046226).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">外箱尺寸（cm）</div></el-col>
          <el-col :span="8"><div class="td">{{info.packingLength + ' * ' + info.packingWide + ' * ' + info.packingHigh}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">外箱尺寸（in）</div></el-col>
          <el-col :span="8"><div class="td">{{(info.packingLength * 0.3937).toFixed(2) + ' * ' + (info.packingWide * 0.3937).toFixed(2) + ' * ' + (info.packingHigh * 0.3937).toFixed(2)}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">装箱数（套）</div></el-col>
          <el-col :span="8"><div class="td">{{info.packingQuantity}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">&nbsp;</div></el-col>
          <el-col :span="8"><div class="td">&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="spanDiv"></div>
    </div>
    <div class="pdt" v-if="active === 1">
      <div class="title">
        <i class="el-icon-s-operation"></i>数据列表
      </div>
      <div class="imgDiv">
        <img @click="showImg(info.mainPicUrl)" :src="info.mainPicUrl" alt="">
        <img @click="showImg(info.picUrl1)" :src="info.picUrl1" alt="">
        <img @click="showImg(info.picUrl2)" :src="info.picUrl2" alt="">
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
    <div class="pdt" v-if="active === 2">
      <div class="title">
        <i class="el-icon-s-operation"></i>数据列表
      </div>
      <el-table
        :data="list"
        key="some"
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
          prop="purchasePrice"
          label="采购价（元）"
          align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '供应商管理',
        path: '/F0302/F030201'
      }, {
        name: '供应商管理',
        path: '/F0302/F030201'
      }, {
        name: '供应商详情',
        path: ''
      }],
      maxDeliverDay: '', // 最大交期
      active: 0,
      typeList: [], // 产品分类
      info: {},
      list: [],
      dialogVisible: false,
      dialogImageUrl: ''
    };
  },
  async mounted () {
    await this.getType();
    this.getInfo(this.$route.query.skuid);
    this.getSupplier();
  },
  methods: {
    showImg (src) {
      this.dialogVisible = true;
      this.dialogImageUrl = src.replace('_80x80', '');
    },
    async getType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategoryRule', {
        pageNum: 1,
        pageSize: 999999
      });
      this.typeList = data.data.list;
    },
    async getInfo (id) { // 获取信息
      let data = await window.axios.post(`/product/queryProductInfoDetail`, {
        skuId: id
      });
      for (let i = 0, len = this.typeList.length; i < len; i++) {
        for (let j = 0, jLen = this.typeList[i].listChildCategory.length; j < jLen; j++) {
          let curr = this.typeList[i].listChildCategory[j];
          if (curr.id === data.data.categoryId) {
            data.data.firstName = this.typeList[i].goodsCategoryName;
            data.data.seconedName = curr.goodsCategoryName;
            break;
          }
        }
      }
      this.info = data.data;
    },
    async getSupplier () { // 获取关联供应商
      let data = await window.axios.get(`/supplyrel/querybygoods?pageSize=99999&pageNum=1&goodsId=${this.$route.query.id}`);
      let day = 0;
      data.data.list.forEach(item => {
        if (item.supplierDeliverDay > day) {
          day = item.supplierDeliverDay;
        }
      });
      this.maxDeliverDay = day;
      this.list = data.data.list;
    },
    changeTab (idx) { // 改变tab
      this.active = idx;
    },
    refreash () {
      location.reload();
    },
    goBack () { // 返回
      history.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.crumbsDiv {
  position: fixed;
  z-index: 10;
  width: calc(100% - 64px);
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(228, 228, 228);
  background-color: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgb(228, 228, 228);
    padding: 0 10px;
    border-radius: 3px;
    color: #666;
    background-color: white;
    cursor: pointer;
  }
  .changeTab {
    span {
      margin-right: 10px;
    }
    span.active {
      background-color: #1ABC9C;
      color: white;
      border: 1px solid #1ABC9C;
    }
  }
  .tool {
    span {
      margin-left: 10px;
    }
  }
}
.supplierDetail {
  box-sizing: border-box;
  margin: 70px 50px 20px;
  border: 1px solid rgb(228, 228, 228);
  padding: 0 30px;
  color: #666;
  .title {
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
    margin-top: 20px;
    span {
      margin-left: 5px;
    }
  }
  .info {
    line-height: 45px;
    border-top: 1px solid rgb(228, 228, 228);
    border-left: 1px solid rgb(228, 228, 228);
    .td {
      border-right: 1px solid rgb(228, 228, 228);
      border-bottom: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      padding: 0 10px;
      height: auto;
    }
    .label {
      background-color: #f2f2f2;
      text-align: right;
    }
  }
  .spanDiv {
    width: 100%;
    height: 30px;
  }
}
.pdt {
  box-sizing: border-box;
  margin: 70px 50px 20px;
  color: #666;
  .title {
    height: 50px;
    line-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    background-color: rgba(243, 243, 243, 1);
    text-indent: 10px;
  }
  .imgDiv {
    width: 100%;
    border: 1px solid rgb(228, 228, 228);
    padding: 20px;
    > img {
      display: inline-block;
      margin-right: 10px;
      width: 80px;
      height: 80px;
      cursor: pointer;
    }
  }
}
</style>