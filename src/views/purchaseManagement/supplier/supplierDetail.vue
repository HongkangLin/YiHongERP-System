<template>
  <div>
    <div class="crumbsDiv">
      <div class="changeTab">
        <span @click="changeTab(0)" :class="active ? '' : 'active'">供应商信息</span>
        <span @click="changeTab(1)" :class="active ? 'active' : ''">供应中产品</span>
      </div>
      <div class="tool">
        <span @click="refreash"><i class="el-icon-refresh"></i>&nbsp;刷新</span>
        <span @click="goBack"><i class="el-icon-arrow-left"></i>&nbsp;返回</span>
      </div>
    </div>
    <div class="supplierDetail" v-if="!active">
      <div class="title"><i class="el-icon-collection-tag"></i><span>基本信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">产品分类</div></el-col>
          <el-col :span="8"><div class="td">{{info.firstName}}&nbsp;>&nbsp;{{info.seconedName}}</div></el-col>
          <el-col :span="4"><div class="td label">供应商名称</div></el-col>
          <el-col :span="8"><div class="td">{{info.name}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">供应商编号</div></el-col>
          <el-col :span="8"><div class="td">{{info.sn}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">供应商简称</div></el-col>
          <el-col :span="8"><div class="td">{{info.shortname}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">是否启用</div></el-col>
          <el-col :span="8"><div class="td">{{info.status ? '启用': '否'}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">供应商等级</div></el-col>
          <el-col :span="8"><div class="td">{{info.level}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">供应商来源</div></el-col>
          <el-col :span="8"><div class="td">{{info.source}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">采购员</div></el-col>
          <el-col :span="8"><div class="td">{{info.purchaserName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">交期（天）</div></el-col>
          <el-col :span="8"><div class="td">{{info.deliverDay}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">&nbsp;</div></el-col>
          <el-col :span="8"><div class="td">&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>财务信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">收款人（私账）</div></el-col>
          <el-col :span="8"><div class="td">{{info.priAccountName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">银行卡号（私账）</div></el-col>
          <el-col :span="8"><div class="td">{{info.priAccountNo}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">开户行</div></el-col>
          <el-col :span="8"><div class="td">{{info.priAccountBankname}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">税率</div></el-col>
          <el-col :span="8"><div class="td">{{info.taxRate}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">结算方式</div></el-col>
          <el-col :span="8"><div class="td">{{info.settleType}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">公司全称</div></el-col>
          <el-col :span="8"><div class="td">{{info.pubAccountCompanyName}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">银行对公账号</div></el-col>
          <el-col :span="8"><div class="td">{{info.pubAccountNo}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">对公账号开户行</div></el-col>
          <el-col :span="8"><div class="td">{{info.pubAccountBankname}}&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>企业信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">所在地</div></el-col>
          <el-col :span="8"><div class="td">{{info.addrProvince + info.addrCity + info.addrArea}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">详细地址</div></el-col>
          <el-col :span="8"><div class="td">{{info.addrDetail}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">社会统一信用代码</div></el-col>
          <el-col :span="8"><div class="td">{{info.socialCreditCode}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">公司规模</div></el-col>
          <el-col :span="8"><div class="td">{{info.companySize}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">法人姓名</div></el-col>
          <el-col :span="8"><div class="td">{{info.legalPersonName}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">企业网站</div></el-col>
          <el-col :span="8"><div class="td">{{info.website}}&nbsp;</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><div class="td label">供应商描述</div></el-col>
          <el-col :span="8"><div class="td">{{info.description}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="td label">&nbsp;</div></el-col>
          <el-col :span="8"><div class="td">&nbsp;</div></el-col>
        </el-row>
      </div>
      <div class="title"><i class="el-icon-collection-tag"></i><span>联系人信息</span></div>
      <el-table
        :data="info.contact"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.gender ? scope.row.gender === 1 ? '男' : '女' : '未知'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="职务"
          align="center">
        </el-table-column>
        <el-table-column
          prop="wechat"
          label="微信"
          align="center">
        </el-table-column>
        <el-table-column
          prop="qq"
          label="QQ"
          align="center">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center">
        </el-table-column>
        <el-table-column
          label="是否首选"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.firstChoice ? '首选' : '否'}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="spanDiv"></div>
    </div>
    <div class="pdt" v-if="active">
      <div class="title">
        <i class="el-icon-s-operation"></i>数据列表
      </div>
      <el-table
        :data="list"
        key="some"
        border
        style="width: 100%">
        <el-table-column
          prop="goodsName"
          label="产品名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodsSKU"
          label="SKU"
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
      active: 0,
      companySize: ['0～20人', '20～25人', '50～100人', '100～500人', '500～1000人', '1000人以上'],
      typeList: [], // 产品分类
      settleSel: [], // 结算方式
      info: {},
      list: []
    };
  },
  async mounted () {
    await this.getType();
    await this.getSettle();
    this.getInfo(this.$route.params.id);
    this.getPdt();
  },
  methods: {
    async getType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategoryRule', {
        pageNum: 1,
        pageSize: 999999
      });
      this.typeList = data.data.list;
    },
    async getSettle () { // 获取结算方式
      let data = await window.axios.get(`/settletype/simpList`);
      this.settleSel = data.data;
    },
    async getInfo (id) { // 获取信息
      let data = await window.axios.get(`/supplier/detail/${id}`);
      for (let i = 0, len = this.typeList.length; i < len; i++) {
        for (let j = 0, jLen = this.typeList[i].listChildCategory.length; j < jLen; j++) {
          let curr = this.typeList[i].listChildCategory[j];
          if (curr.id === data.data.goodsCategoryId) {
            data.data.firstName = this.typeList[i].goodsCategoryName;
            data.data.seconedName = curr.goodsCategoryName;
            break;
          }
        }
      }
      for (let k = 0, klen = this.settleSel.length; k < klen; k++) {
        if (this.settleSel[k].id === data.data.settleType) {
          data.data.settleType = this.settleSel[k].name;
          break;
        }
      }
      data.data.companySize = data.data.companySize && this.companySize[data.data.companySize - 1];
      this.info = data.data;
    },
    async getPdt () { // 获取供应产品信息
      let data = await window.axios.get(`/supplyrel/querybysupplier?pageSize=99999&pageNum=1&supplierId=${this.$route.params.id}`);
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
}
</style>