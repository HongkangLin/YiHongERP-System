<template>
  <div class="supplierDetail">
    <div class="title"><i class="el-icon-collection-tag"></i><span>联系人信息</span></div>
    <el-table
      :data="info.contactList"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="性别"
        align="center">
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
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: {}
    };
  },
  mounted () {
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.supplierDetail {
  box-sizing: border-box;
  margin: 20px 50px;
  border: 1px solid rgb(228, 228, 228);
  padding: 0 30px;
  overflow: hidden;
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