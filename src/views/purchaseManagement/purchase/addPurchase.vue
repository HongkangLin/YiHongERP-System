<template>
  <div>
    <crumbs :list="crumbList" :goBack="goBack"></crumbs>
    <div class="addSupplier">
      <el-steps :active="active" finish-status="success" :align-center="true">
        <el-step title="填写基础信息"></el-step>
        <el-step title="选择产品"></el-step>
        <el-step title="生成合同"></el-step>
      </el-steps>
      <div v-if="active === 0" class="page">
        <div class="left firstLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            基础信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="form" class="form" :model="form" :rules="rules" label-width="170px">
            <el-form-item label="采购单号：">
              <el-input disabled placeholder="提交后自动生成"></el-input>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId">
              <el-select filterable v-model="form.supplierId" @change="chanSupplier" placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商编号：">
              <el-input disabled v-model="form.sn" placeholder="选择供应商自动带入"></el-input>
            </el-form-item>
            <el-form-item label="采购员：" prop="purchaseUserId">
              <el-select filterable :disabled="disabled" v-model="form.purchaseUserId" placeholder="请选择采购员">
                <el-option
                  v-for="item in peopleSel"
                  :key="item.id"
                  :label="item.userName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库：" prop="warehouseId">
              <el-select filterable v-model="form.warehouseId" placeholder="请选择采购入库仓库">
                <el-option
                  v-for="item in store"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计交期：">
              <el-date-picker
                v-model="form.expectDueTime"
                type="date"
                :picker-options="{disabledDate: disabledDate}"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" maxlength="20" :rows="7" v-model="form.bak" placeholder="请输入备注，20字以内"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(0, 1)">下一步，请选择产品</div>
          </div>
        </div>
      </div>
      <div v-if="active === 1" class="page">
        <div class="left thirdLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            选择产品
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <div class="add" @click="addPdt">+添加产品</div>
          <el-table border
            :data="form.productOfPurchaseDTOList"
            show-summary
            :summary-method="getSummaries"
            style="width: 100%">
            <el-table-column
              align="center"
              label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.mainPicUrl" alt="">
              </template>
            </el-table-column>
            <el-table-column
              prop="sku"
              align="center"
              label="SKU">
            </el-table-column>
            <el-table-column
              align="center"
              label="产品名称"
              prop="goodsName">
            </el-table-column>
            <el-table-column
              align="center"
              prop="purchasePrice"
              label="采购价（元）">
            </el-table-column>
            <el-table-column
              align="center"
              sortable
              width="160px"
              label="采购数量（套）">
              <template slot-scope="scope">
                <el-input-number :min="1" :max="99999999" :controls="false" v-model="scope.row.purchaseAmount" placeholder="输入套数"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              sortable
              label="货款（套）">
              <template slot-scope="scope">
                <div>{{(scope.row.purchaseAmount * scope.row.purchasePrice).toFixed(2) || 0}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.$index)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(1, 0)" class="pre">上一步，填写基础信息</div>
            <div @click="next(1, 2)">下一步，生成合同</div>
          </div>
        </div>
      </div>
      <div class="addSome" v-if="show">
        <div class="title">
          <span>添加产品</span>
          <i class="el-icon-close" @click="closePdt"></i>
        </div>
        <div class="content">
          <div class="search">
            <el-input maxlength="100" placeholder="商品名称/SKU" v-model="pdtName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchPdt"></el-button>
            </el-input>
          </div>
          <el-table
            :data="pdtList"
            border
            style="width: 100%">
            <el-table-column
              prop="goodsName"
              label="产品名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sku"
              label="SKU"
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
          <div class="pagin">
            <el-pagination background layout="prev, pager, next" :pageSize="pageSize" :total="total" @current-change="changeNum"></el-pagination>
          </div>
        </div>
      </div>
      <div v-if="active === 2" class="page">
        <div class="left" :style="'height:' + (1140 + 163 * (form.productOfPurchaseDTOList.length - 1)) + 'px'">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            完善合同信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable moneyLabel">
            <i class="el-icon-collection-tag"></i>
            核对合同描述
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable" :style="'top:' + (650 + 163 * (form.productOfPurchaseDTOList.length - 1)) + 'px'">
            <i class="el-icon-collection-tag"></i>
            核对合同条款
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="info" class="form last" :model="info" :rules="infoRule" label-width="210px">
            <el-form-item label="甲方企业抬头：" prop="companyId">
              <el-select filterable v-model="info.companyId" placeholder="请选择甲方企业抬头，不同的企业对应不同的公章">
                <el-option
                  v-for="item in compList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="已方收款账号：" prop="accountNo">
              <el-select filterable v-model="info.accountNo" placeholder="请选择乙方收款账号，可选择私账与公账">
                <el-option
                  v-for="item in compList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="放款方式备注：" prop="payBak">
              <el-input type="textarea" maxlength="100" :rows="7" v-model="info.payBak" placeholder="示例：自双方签订合同起付乙方30%定金27702元，剩余货款64638元出货前付清；"></el-input>
            </el-form-item>
            <el-form-item label="交货日期：" prop="dueTime">
              <el-input type="textarea" :rows="7" v-model="info.dueTime" maxlength="100" placeholder="请输入交货日期"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item v-for="(item, index) in form.productOfPurchaseDTOList" :key="index" :label="item.sku + '：'">
              <el-input type="textarea" :rows="7" v-model="form.productOfPurchaseDTOList[index].contractDescribe" placeholder="示例：1、哑面黑色PVC板+1.8cm磨边玻璃+相纸
2、背板用E1原色背板和支架，支架摆件在框内，背面为4个弹片，弹片位置不能居中，要不然会影响挂件
3、15个/套（配件：S挂钩和无痕钉各18个,每个相框四个护角然后过塑，2层气泡袋入黑底白字彩盒,包装时要放产品说明书（甲方提供）；"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="合同条款（可自定义编辑）：" prop="contractTerms">
              <el-input type="textarea" :rows="11" v-model="info.contractTerms" placeholder="请输入合同条款"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(2, 1)" class="pre">上一步，选择产品</div>
            <el-button @click="submit" type="primary" :loading="loading">完成，提交采购单</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      token: localStorage.getItem('token'),
      active: 0, // 进度控制
      loading: false,
      crumbList: [{ // 面包屑
        name: '采购管理',
        path: '/F0301/F030101'
      }, {
        name: '采购单',
        path: '/F0301/F030101'
      }, {
        name: '发起采购',
        path: ''
      }],
      compList: [{
        id: 1,
        name: '深圳市一弘科技有限公司'
      }, {
        id: 2,
        name: '深圳市毅弘电子商务有限公司'
      }, {
        id: 3,
        name: '深圳市长弘电子商务有限公司'
      }],
      supplierList: [], // 供应商列表
      peopleSel: [], // 采购员
      store: [], // 仓库
      form: { // form表单
        supplierId: '', // 供应商id
        sn: '', // 供应商编号
        purchaseUserId: '', // 采购员id
        warehouseId: '', // 仓库id
        expectDueTime: '', // 预计交期
        bak: '', // 备注
        productOfPurchaseDTOList: [] // 产品集合
      },
      rules: {
        supplierId: [
          {required: true, message: '请选择供应商', trigger: 'change'}
        ],
        purchaseUserId: [
          {required: true, message: '请选择采购员', trigger: 'change'}
        ],
        warehouseId: [
          {required: true, message: '请选择仓库', trigger: 'change'}
        ]
      },
      pdtList: [], // 产品列表
      pdtName: '', // 商品名称
      pageSize: 10, // 页面大小
      pageNum: 1, // 当前页
      total: 0, // 总条数
      show: false, // 是否显示添加界面
      disabled: false,
      info: { // 合同信息
        companyId: '', // 甲方公司id
        accountName: '', // 乙方收款人
        accountBankname: '', // 乙方开户行
        accountNo: '', // 乙方收款账号
        dueTime: '', // 交货日期
        payBak: '', // 放款方式备注
        contractTerms: '' // 产品合同描述
      },
      infoRule: { // 信息规则
        companyId: [
          {required: true, message: '请选择甲方公司', trigger: 'blur'}
        ],
        accountNo: [
          {required: true, message: '请选择乙方收款账号', trigger: 'blur'}
        ],
        dueTime: [
          {required: true, message: '请输入交货日期', trigger: 'blur'}
        ],
        payBak: [
          {required: true, message: '请输入放款方式备注', trigger: 'blur'}
        ],
        contractTerms: [
          {required: true, message: '请输入合同条款', trigger: 'blur'}
        ]
      }
    };
  },
  mounted () {
    this.getSupplier();
    this.getRole();
    this.getStore();
    this.getContract();
  },
  methods: {
    goBack () { // 返回
      history.go(-1);
    },
    async getContract () { // 获取合同条款
      let data = await window.axios.get('/purchase/queryContractTerms/con.purchase');
      this.info.contractTerms = data.data.contractTerms;
    },
    async getSupplier () { // 获取供应商
      let data = await window.axios.get(`/supplier/simpList`);
      this.supplierList = data.data.filter(item => item.status);
    },
    async getRole () { // 获取采购员列表
      let data = await window.axios.get('/user/queryUserList4Select/purchase');
      this.peopleSel = data.data;
      if (this.peopleSel.length === 1) {
        this.form.purchaseUserId = this.peopleSel[0].id;
        this.disabled = true;
      }
    },
    async getStore () { // 获取仓库
      let data = await window.axios.get(`/warehouse/simpList`);
      this.store = data.data;
    },
    searchPdt () { // 搜索
      this.pageNum = 1;
      this.getPdt();
    },
    async getPdt () { // 获取产品列表
      let data = await window.axios.post('/supplyrel/queryProductInfoBySupplierId', {
        supplierId: this.form.supplierId,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchValue: this.pdtName
      });
      data.data.list.forEach(item => {
        item.purchaseAmount = 1;
        for (let i = 0, len = this.form.productOfPurchaseDTOList.length; i < len; i++) {
          if (item.goodsId === this.form.productOfPurchaseDTOList[i].goodsId) {
            item.sel = true;
            break;
          }
        }
      });
      this.pdtList = data.data.list;
    },
    chanSupplier () { // 修改供应商编号
      for (let i = 0, len = this.supplierList.length; i < len; i++) {
        if (this.form.supplierId === this.supplierList[i].id) {
          this.form.sn = this.supplierList[i].sn;
          break;
        }
      }
      this.form.productOfPurchaseDTOList = [];
    },
    disabledDate (data) { // 设置可选日期
      return data < new Date().getTime();
    },
    next (curr, idx) { // 子页面间跳转
      if (curr > idx) { // 上一页
        this.active = idx;
      } else { // 下一页
        if (idx === 2) {
          if (!this.form.productOfPurchaseDTOList.length) {
            this.$message.warning('请先选择产品');
            return;
          } else {
            let flag = false;
            for (let i = 0, len = this.form.productOfPurchaseDTOList.length; i < len; i++) {
              if (!this.form.productOfPurchaseDTOList[i].purchaseAmount) {
                flag = true;
                break;
              }
            }
            if (flag) {
              this.$message.warning('请先输入采购数量');
              return;
            }
          }
        }
        if (idx === 1) { // 往第二页跳转
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.getPdt();
              this.active = idx;
            } else {
              return false;
            }
          });
        } else {
          this.active = idx;
        }
      }
    },
    getSummaries (param) { // 计算汇总
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if (index === 1) {
          sums[index] = '共' + data.length + '类SKU';
          return;
        }
        if (index === 2 || index === 3 || index === 6) {
          sums[index] = '';
          return;
        }
        if (index === 4) {
          let sum = 0;
          for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].purchaseAmount) {
              sum += parseInt(data[i].purchaseAmount);
            }
          }
          sums[index] = sum || 0;
          return;
        }
        if (index === 5) {
          let sum = 0;
          for (let j = 0, len = data.length; j < len; j++) {
            if (data[j].purchaseAmount && data[j].purchasePrice) {
              sum += data[j].purchaseAmount * data[j].purchasePrice;
            }
          }
          sum = sum.toFixed(2);
          sums[index] = sum || 0;
          return;
        }
      });

      return sums;
    },
    changeNum (num) { // 改变页数
      this.pageNum = num;
      this.getPdt();
    },
    handleAdd (idx) { // 添加产品
      if (this.pdtList[idx].sel) { // 移除
        this.$set(this.pdtList[idx], 'sel', false);
        let pos = 0;
        for (let i = 0, len = this.form.productOfPurchaseDTOList.length; i < len; i++) {
          if (this.form.productOfPurchaseDTOList[i].goodsId === this.pdtList[idx].goodsId) {
            pos = i;
            break;
          }
        }
        this.form.productOfPurchaseDTOList.splice(pos, 1);
      } else { // 新增
        this.$set(this.pdtList[idx], 'sel', true);
        this.form.productOfPurchaseDTOList.push(this.pdtList[idx]);
      }
    },
    handleDelete (idx) { // 删除产品
      for (let i = 0, len = this.pdtList.length; i < len; i++) {
        if (this.pdtList[i].goodsId === this.form.productOfPurchaseDTOList[idx].goodsId) {
          this.$set(this.pdtList[i], 'sel', false);
          break;
        }
      }
      this.form.productOfPurchaseDTOList.splice(idx, 1);
    },
    addPdt () { // 添加产品
      this.show = true;
    },
    closePdt () { // 关闭产品
      this.show = false;
    },
    submit () { // 提交
      this.loading = true;
      this.$refs['info'].validate((valid) => {
        if (valid) {
          let curr = {...this.form, ...this.info};
          let param = JSON.parse(JSON.stringify(curr));
          // let time = new Date(param.expectDueTime);
          // param.expectDueTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
          window.axios.post('/purchase/addPurchaseInfo', param).then(data => {
            this.loading = false;
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              history.go(-1);
            }
          });
        } else {
          this.loading = false;
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addSupplier {
  position: relative;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  /deep/.el-step__head.is-success {
    color: #1ABC9C;
    border-color: #1ABC9C;
  }
  /deep/.el-step__head.is-process,/deep/.el-step__head.is-wait  {
    color: rgb(153, 153, 153);
    border-color: rgb(153, 153, 153);
  }
  /deep/.el-step__title.is-success {
    color: #1ABC9C;
  }
  /deep/.el-step__title.is-process,/deep/.el-step__title.is-wait {
    color: rgb(153, 153, 153);
  }
  .page {
    display: flex;
    border: 1px solid rgb(228, 228, 228);
    margin-top: 10px;
    .firstLeft {
      height: 780px;
    }
    .secondLeft {
      height: 1980px;
    }
    .left {
      position: relative;
      width: 180px;
      border-right: 1px solid rgb(228, 228, 228);
      background-color: #fcfcfc;
      .lable {
        position: relative;
        top: 50px;
        height: 50px;
        line-height: 50px;
        background-color: rgb(153, 153, 153);
        color: white;
        font-size: 16px;
        text-indent: 10px;
        .hexagon {
          width: 60px;
          height: 60px;
          position: absolute;
          top: 0;
          right: -20px;
          color: black;
        }
      }
      .moneyLabel {
        top: 480px;
      }
      .compLabel {
        top: 420px;
      }
    }
    .right {
      box-sizing: border-box;
      width: calc(100% - 180px);
      padding: 100px;
      /deep/.el-table__row {
        .el-input-number--small {
          width: 100%;
        }
      }
      .form {
        /deep/.el-input--small .el-input__inner {
          width: 194px;
          height: 35px;
          line-height: 35px;
        }
        /deep/.el-input--small .el-textarea__inner {
          width: 400px;
        }
        &.last {
          /deep/.el-input--small .el-textarea__inner {
            width: 550px;
          }
          /deep/.el-input--small .el-input__inner {
            width: 550px;
            height: 35px;
            line-height: 35px;
          }
        }
        .info {
          color: rgb(153, 153, 153)
        }
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
        margin-bottom: 30px;
      }
      .spanDiv {
        height: 50px;
      }
      .curr {
        margin-top: 20px;
        color: #999;
        margin-bottom: 30px;
        .red {
          color: #F04844;
        }
      }
      .next {
        margin-top: 50px;
        display: flex;
        justify-content: center;
        div {
          cursor: pointer;
          margin: 0 10px;
          width: 180px;
          height: 45px;
          line-height: 45px;
          border-radius: 4px;
          color: white;
          background-color: #1ABC9C;
          border: 1px solid #1ABC9C;
          text-align: center;
        }
        .pre {
          background-color: white;
          color: #1ABC9C;
          border: 1px solid #1ABC9C;
        }
        /deep/.el-button--small {
          background-color: #1ABC9C;
          border-color: #1ABC9C;
          width: 180px;
        }
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
    .pagin {
      height: 60px;
      position: relative;
      .el-pagination {
        position: absolute;
        top: 20px;
        right: 0;
      }
    }
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
    .content {
      box-sizing: border-box;
      padding: 20px;
      .search {
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