<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="supplierDetail">
      <div class="title"><i class="el-icon-collection-tag"></i><span>基本信息</span></div>
      <div class="info">
        <el-row>
          <el-col :span="4"><div class="td label">产品分类</div></el-col>
          <el-col :span="8"><div class="td">{{info.level}}&nbsp;</div></el-col>
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
            <div>{{scope.row.gender ? scope.row.gender === 1 ? '男' : '女' : 0}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
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
          prop="name"
          label="是否首选"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.gender ? '首选' : '否'}}</div>
          </template>
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
      info: {}
    };
  },
  mounted () {
    this.getInfo(this.$route.params.id);
  },
  methods: {
    async getInfo (id) { // 获取信息
      let data = await window.axios.get(`/supplier/detail/${id}`);
      this.info = data.data;
    }
  }
};
</script>

<style lang="less" scoped>
.supplierDetail {
  box-sizing: border-box;
  margin: 20px 50px;
  height: calc(100% - 50px);
  overflow: auto;
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
}
</style>