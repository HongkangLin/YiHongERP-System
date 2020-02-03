<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="logisticsDetail">
      <div class="supplierDetail" v-if="!active">
        <div class="title"><i class="el-icon-collection-tag"></i><span>基础信息</span></div>
        <div class="info">
          <el-row>
            <el-col :span="4"><div class="td label">物流商名称</div></el-col>
            <el-col :span="8"><div class="td">{{info.companyName}}</div></el-col>
            <el-col :span="4"><div class="td label">物流商编号</div></el-col>
            <el-col :span="8"><div class="td">{{info.companyId}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">物流商简称</div></el-col>
            <el-col :span="8"><div class="td">{{info.companyShortName}}&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">是否启用</div></el-col>
            <el-col :span="8"><div class="td">{{info.status ? '启用': '禁用'}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">物流商来源</div></el-col>
            <el-col :span="8"><div class="td">{{info.companySource}}&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">供应商等级</div></el-col>
            <el-col :span="8"><div class="td">{{info.companyLevel}}&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">操作人</div></el-col>
            <el-col :span="8"><div class="td">{{info.operatorName}}&nbsp;</div></el-col>
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
            <el-col :span="4"><div class="td label">营业执照照片</div></el-col>
            <el-col :span="8"><div class="td"><a v-if="info.busLicensePicUrl" target="_black" :href="info.busLicensePicUrl">点击查看</a>&nbsp;</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="td label">企业网站</div></el-col>
            <el-col :span="8"><div class="td">{{info.website}}&nbsp;</div></el-col>
            <el-col :span="4"><div class="td label">物流商描述</div></el-col>
            <el-col :span="8"><div class="td">{{info.description}}&nbsp;</div></el-col>
          </el-row>
        </div>
        <div class="title"><i class="el-icon-collection-tag"></i><span>联系人信息</span></div>
        <el-table
          :data="info.contatList"
          border
          style="width: 100%">
          <el-table-column
            prop="contactName"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '物流',
        path: '/F0302/F030201'
      }, {
        name: '物流商管理',
        path: '/F0302/F030201'
      }, {
        name: '物流商详情',
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
    await this.getSettle();
    this.getInfo(this.$route.query.id);
  },
  methods: {
    async getSettle () { // 获取结算方式
      let data = await window.axios.get(`/settletype/simpList`);
      this.settleSel = data.data;
    },
    async getInfo (id) { // 获取信息
      let data = await window.axios.get(`/express/expressCompanyInfoDetail/${id}`);
      for (let k = 0, klen = this.settleSel.length; k < klen; k++) {
        if (this.settleSel[k].id === data.data.settleType) {
          data.data.settleType = this.settleSel[k].name;
          break;
        }
      }
      data.data.companySize = data.data.companySize && this.companySize[data.data.companySize - 1];
      this.info = data.data;
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
.logisticsDetail {
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}
.supplierDetail {
  box-sizing: border-box;
  border: 1px solid rgb(228, 228, 228);
  font-size: 12px;
  padding: 0 20px;
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