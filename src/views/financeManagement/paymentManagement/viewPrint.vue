<template>
  <div class="viewPrint_wrap">
		<div class="crumbsDiv">
      <div class="crumbs">
        <span class="label"></span>
        <span class="crumbName">付款单打印页</span>
      </div>
      <div class="btns">
        <div class="return" @click="goBack"><i class="el-icon-close"></i> 关闭</div>
        <!-- <div class="return" v-print="'#printMe'"><i class="el-icon-printer"></i> 打印</div> -->
        <div class="return" @click="print"><i class="el-icon-printer"></i> 打印</div>
      </div>
    </div>
    <div class="doc">
      <!-- 打印区 -->
      <div class="printArea" id="printMe">
        <div class="title">采购付款单</div>
        <div class="table row2">
          <el-row>
            <el-col :span="4" class="bg-grey">付款单号</el-col>
            <el-col :span="8" class="content">YH003003001</el-col>
            <el-col :span="4" class="bg-grey">收款单位</el-col>
            <el-col :span="8" class="content">浙江台州君乐电子厂</el-col>
          </el-row>
        </div>
        <div class="table row3">
          <el-row>
            <el-col :span="4" class="bg-grey">银行账号</el-col>
            <el-col :span="8" class="content">GYS20190818001</el-col>
            <el-col :span="4" class="bg-grey">开户行</el-col>
            <el-col :span="8" class="content">中国建设银行深圳福田支行</el-col>
          </el-row>
        </div>
        <div class="table row4">
          <el-row>
            <el-col :span="4" class="bg-grey">金额大写</el-col>
            <el-col :span="20" class="content">壹万肆仟叁佰元整</el-col>
          </el-row>
        </div>
        <div class="table row5">
          <el-row>
            <el-col :span="4" class="bg-grey">金额小写</el-col>
            <el-col :span="20" class="content">¥14300.00</el-col>
          </el-row>
        </div>
        <div class="table row6">
          <el-row>
            <el-col :span="4" class="bg-grey">备注</el-col>
            <el-col :span="20" class="content">这里是备注内容</el-col>
          </el-row>
        </div>
        <el-table :data="[]" border  show-summary sum-text="汇总">
          <el-table-column prop="1" label="采购单号" align="center" ></el-table-column>
          <el-table-column prop="2" label="货款总金额（元）" align="center" ></el-table-column>
          <el-table-column prop="3" label="已支付货款（元）" align="center" ></el-table-column>
          <el-table-column prop="4" label="未支付货款（元）" align="center" ></el-table-column>
          <el-table-column prop="5" label="本次申请货款（元）" align="center" ></el-table-column>
          <el-table-column prop="6" label="运费（元）" align="center" ></el-table-column>
          <el-table-column prop="7" label="其它费用（元）" align="center" ></el-table-column>
          <el-table-column prop="8" label="备注" align="center" ></el-table-column>
        </el-table>
        <div class="table last">
          <el-row>
            <el-col :span="3" class="bg-grey">审核人</el-col>
            <el-col :span="5" class="content"></el-col>
            <el-col :span="3" class="bg-grey">经理</el-col>
            <el-col :span="5" class="content"></el-col>
            <el-col :span="3" class="bg-grey">财务</el-col>
            <el-col :span="5" class="content"></el-col>
          </el-row>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      printPageData: {
        tableData: []
      }
    }
  },
  methods: {  
    // 打印
    print() {
      window.print()
    },
   
    // 面包屑关闭
    goBack() {
      history.go(-1);
    }
  },
};
</script>
<style lang="less" scoped>
.crumbsDiv {
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(228, 228, 228);
  background-color: rgba(243, 243, 243, 1);
  display: flex;
  justify-content: space-between;
  .crumbs {
    margin-left: 50px;
    display: flex;
    align-items: center;
    .label {
      display: inline-block;
      vertical-align: middle;
      width: 4px;
      height: 17px;
      margin-right: 5px;
      background-color: #1ABC9C;
    }
    .crumbName {
      color: #999999;
    }
  }
  .btns {
    display: flex;
    margin-right: 50px;
    .return {
      margin: 10px 5px;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 70px;
      color: #999;
      cursor: pointer;
      border-radius: 4px;
      background-color: white;
      border: 1px solid rgb(228, 228, 228);
    }
  }
}
.doc {
  padding: 20px 50px;
  .title {
    color: #666666;
    font-size: 20px;
    font-weight: bold;
    line-height: 80PX;
    text-align: center;
    border: 1px solid #e4e4e4;
    border-bottom: none;
  }
  .table {
    &.row2 {
      border-top: 1px solid #e4e4e4;
    }
    &.row6 {
      .el-row .el-col {
        border-bottom: none;
      }
    }
    font-size: 14px;
    border-left: 1px solid #e4e4e4;
    .el-row {
      line-height: 45px;
      .el-col {
        height: 45px;
        border-bottom: 1px solid #e4e4e4;
        border-right: 1px solid #e4e4e4;
      }
      .bg-grey {
        text-align: right;
        background-color: #f9fafc;
        padding-right: 20px;
      }
      .content {
        padding-left: 10px;
      }
    }
  }
}
</style>