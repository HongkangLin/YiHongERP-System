<template>
  <div>
    <crumbs :list="crumbList" :goBack="goBack"></crumbs>
    <div class="addSupplier">
      <el-steps :active="active" finish-status="success" :align-center="true">
        <el-step title="选择产品分类"></el-step>
        <el-step title="填写供应商信息"></el-step>
        <el-step title="填写联系人信息"></el-step>
      </el-steps>
      <div v-if="active === 0" class="page">
        <div class="left firstLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            选择分类
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <div class="typeList">
            <div class="typeSel">
              <div class="selTitle">选择一级分类</div>
              <div class="selList">
                <div class="selItem" :class="currFirst === idx ? 'active': ''" v-for="(item, idx) in typeList" :key="idx" @click="clickFirst(idx)">
                  <span>{{item.goodsCategoryName}}</span>
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
            <div class="center"><i class="el-icon-right"></i></div>
            <div class="typeSel">
              <div class="selTitle">选择二级分类</div>
              <div class="selList">
                <div class="selItem" :class="currSecond === idx ? 'active': ''" v-for="(item, idx) in seconedList" :key="idx" @click="clickSecond(idx)">
                  <span>{{item.goodsCategoryName}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="curr">您当前选择的商品类别是：<span class="red">{{firstName}}&nbsp;<i v-if="seconedName" class="el-icon-arrow-right"></i>&nbsp;{{seconedName}}</span></div>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(1)">下一步，填写供应商信息</div>
          </div>
        </div>
      </div>
      <div v-if="active === 1" class="page">
        <div class="left secondLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            基础信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable moneyLabel">
            <i class="el-icon-collection-tag"></i>
            财务信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable compLabel">
            <i class="el-icon-collection-tag"></i>
            企业信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="form" class="form" :model="form" :rules="rules" label-width="170px">
            <el-form-item label="商品分类：">
              {{firstName}}&nbsp;<i v-if="seconedName" class="el-icon-arrow-right"></i>&nbsp;{{seconedName}}
            </el-form-item>
            <el-form-item label="供应商名称：" prop="name">
              <el-input v-model="form.name" maxlength="100" placeholder="请输入供应商企业全称"></el-input>
            </el-form-item>
            <el-form-item prop="sn">
              <span slot="label">
                供应商编号
                <el-tooltip class="nameInfo" effect="dark" placement="top">
                  <div slot="content">所有供应商编号用10位组成ABCDEFGHIJ，<br/>AB表示供应商所在省及直辖市编号、CD表<br/>示供应商所在地市码、EFG表示产品分类、<br/>HIJ表示供应商编号；</div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
                ：
              </span>
              <el-input v-model="form.sn" maxlength="100" placeholder="请输入10位供应商编号"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称：" prop="shortname">
              <el-input v-model="form.shortname" @change="changeInput" maxlength="100" placeholder="请输入3位字母的供应商简称"></el-input>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-radio v-model="form.status" label="1">是</el-radio>
              <el-radio v-model="form.status" label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="供应商等级：" prop="level">
              <el-select filterable v-model="form.level" placeholder="请选择供应商等级">
                <el-option
                  v-for="item in levelSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商来源：">
              <el-input v-model="form.source" maxlength="100" placeholder="请输入供应商来源"></el-input>
            </el-form-item>
            <el-form-item label="采购员：" prop="purchaserId">
              <el-select filterable v-model="form.purchaserId" placeholder="请选择采购员">
                <el-option
                  v-for="item in peopleSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交期（天）：" prop="deliverDay">
              <el-input min="0" type="number" @blur="() => {if (this.form.deliverDay < 0) {this.form.deliverDay = 0}}" v-model="form.deliverDay" placeholder="请输入交期（天）"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="收款人（私账）：" prop="priAccountName">
              <el-input maxlength="100" v-model="form.priAccountName" placeholder="请输入私账收款人"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号（私账）：" prop="priAccountNo">
              <el-input maxlength="100" v-model="form.priAccountNo" placeholder="请输入私账银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="开户行：" prop="priAccountBankname">
              <el-input maxlength="100" v-model="form.priAccountBankname" placeholder="请输入私账开户行"></el-input>
            </el-form-item>
            <el-form-item class="append" label="税率：">
              <el-input min="0" type="number" @blur="() => {if (this.form.taxRate < 0) {this.form.taxRate = 0}}" @input="oninput" v-model="form.taxRate" placeholder="请输入税率">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="结算方式：">
              <el-select filterable v-model="form.settleType" placeholder="请选择结算方式">
                <el-option
                  v-for="item in settleSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司全称：">
              <el-input maxlength="100" v-model="form.pubAccountCompanyName" placeholder="请输入公司全称"></el-input>
            </el-form-item>
            <el-form-item label="银行对公账号：">
              <el-input maxlength="100" v-model="form.pubAccountNo" placeholder="请输入银行对公账号"></el-input>
            </el-form-item>
            <el-form-item label="对公账号开户行：">
              <el-input maxlength="100" v-model="form.pubAccountBankname" placeholder="请输入对公账号开户行"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="所在地：" prop="selectedOptions">
              <el-cascader
                size="large"
                :options="options"
                v-model="form.selectedOptions">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址：" prop="addrDetail">
              <el-input maxlength="100" v-model="form.addrDetail" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="统一社会信用代码：">
              <el-input maxlength="100" v-model="form.socialCreditCode" placeholder="请输入统一社会信用代码"></el-input>
            </el-form-item>
            <el-form-item label="公司规模：">
              <el-select filterable v-model="form.companySize" placeholder="请选择公司规模">
                <el-option
                  v-for="item in compSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法人姓名：">
              <el-input maxlength="100" v-model="form.legalPersonName" placeholder="请输入法人姓名"></el-input>
            </el-form-item>
            <el-form-item label="企业网站：">
              <el-input maxlength="100" v-model="form.website" placeholder="请输入企业网站"></el-input>
            </el-form-item>
            <el-form-item label="营业执照照片：" prop="busLicensePicUrl">
              <el-upload
                action="/erp/file/upload"
                list-type="picture-card"
                :headers="{'x-token': token}"
                accept=".jpg, .png"
                :limit="1"
                :file-list="form.busLicensePicUrl"
                :on-exceed="() => {this.$message.warning('上传失败，只能上传一张图片哦～')}"
                :before-upload="checkSize"
                :on-error="() => {this.$message.error('上传失败')}"
                :on-success="up"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
                <div class="info" slot="tip">只能上传jpg/png格式文件，文件不能超过2M</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="供应商描述：">
              <el-input maxlength="100" type="textarea" :rows="7" v-model="form.description" placeholder="请输入供应商描述"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(0)" class="pre">上一步，选择产品分类</div>
            <div @click="next(2)">下一步，填写联系人信息</div>
          </div>
        </div>
      </div>
      <div v-if="active === 2" class="page">
        <div class="left thirdLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            添加联系人
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <div class="add" @click="addPeople">+添加联系人</div>
          <el-table border
            :data="form.contact"
            style="width: 100%">
            <el-table-column
              align="center"
              label="姓名"
              prop="name">
            </el-table-column>
            <el-table-column
              align="center"
              label="性别">
              <template slot-scope="scope">
                <div>{{scope.row.gender === '1' ? '男' : '女'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="联系电话"
              prop="mobile">
            </el-table-column>
            <el-table-column
              align="center"
              label="是否首选">
              <template slot-scope="scope">
                <div>{{scope.row.firstChoice ? '首选' : '否'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.$index !== 0"
                  @click="handleSet(scope.$index)">设为首选</el-button>
                <el-divider v-if="scope.$index !== 0" direction="vertical"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.$index !== 0"
                  @click="handleDelete(scope.$index)">删除</el-button>
                <el-divider v-if="scope.$index !== 0" direction="vertical"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(1)" class="pre">上一步，填写供应商信息</div>
            <div @click="submit">完成，提交</div>
          </div>
        </div>
      </div>
      <div class="addSome" v-if="show">
        <div class="title">
          <span>添加联系人</span>
          <i class="el-icon-close" @click="closePeople"></i>
        </div>
        <el-form ref="peopleForm" class="peopleForm" :model="peopleForm" :rules="peopleRule" label-width="170px">
          <el-form-item label="联系人姓名：" prop="name">
            <el-input maxlength="100" v-model="peopleForm.name" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-radio v-model="peopleForm.gender" label="1">男</el-radio>
            <el-radio v-model="peopleForm.gender" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="联系人电话：" prop="mobile">
            <el-input v-model="peopleForm.mobile" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="职务：">
            <el-input maxlength="100" v-model="peopleForm.title" placeholder="请输入职务"></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input maxlength="100" v-model="peopleForm.wechat" placeholder="请输入微信"></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input maxlength="100" v-model="peopleForm.qq" placeholder="请输入QQ"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input maxlength="100" v-model="peopleForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input maxlength="100" type="textarea" :rows="5" v-model="peopleForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <div @click="addOne('peopleForm')">确定</div>
          <div class="reset" @click="closePeople">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data';
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (/[A-Z]{3}/.test(value) && value.length === 3) {
        callback();
      } else {
        callback(new Error('请输入3位字母的供应商简称'));
      }
    };
    var validateTel = (rule, value, callback) => {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('请输入正确电话号码'));
      } else {
        callback();
      }
    };
    return {
      token: localStorage.getItem('token'),
      active: 0, // 进度控制
      crumbList: [{ // 面包屑
        name: '供应商管理',
        path: '/F0302/F030201'
      }, {
        name: '供应商管理',
        path: '/F0302/F030201'
      }],
      typeList: [], // 分类数据
      currFirst: '', // 当前一级
      firstName: '', // 一级名
      seconedName: '', // 二级名
      currSecond: '', // 当前二级
      seconedList: [], // 二级分类数据
      levelSel: [ // 供应商等级
        {
          label: 'A',
          value: 'A'
        },
        {
          label: 'B',
          value: 'B'
        },
        {
          label: 'C',
          value: 'C'
        }
      ],
      options: provinceAndCityData, // 省市区选择
      peopleSel: [], // 采购员
      settleSel: [], // 结算方式
      compSel: [ // 公司规模
        {
          label: '0～20人',
          value: 1
        },
        {
          label: '20～25人',
          value: 2
        },
        {
          label: '50～100人',
          value: 3
        },
        {
          label: '100～500人',
          value: 4
        },
        {
          label: '500～1000人',
          value: 5
        },
        {
          label: '1000人以上',
          value: 6
        }
      ],
      show: false, // 是否显示添加界面
      form: { // form表单
        name: '', // 供应商名称
        sn: '', // 供应商编号
        shortname: '', // 供应商简称
        status: '1', // 是否启用
        level: '', // 供应商等级
        source: '', // 供应商来源
        purchaserId: '', // 采购员
        deliverDay: '', // 交期
        priAccountName: '', // 收款人
        priAccountNo: '', // 银行卡号
        priAccountBankname: '', // 开户行
        taxRate: '', // 税率
        settleType: '', // 结算方式
        pubAccountCompanyName: '', // 公司全称
        pubAccountNo: '', // 银行对公账号
        pubAccountBankname: '', // 对公账号开户行
        selectedOptions: [], // 省市区
        addrDetail: '', // 详细地址
        socialCreditCode: '', // 社会统一信用代码
        companySize: '', // 公司规模
        legalPersonName: '', // 法人姓名
        website: '', // 公司网站
        busLicensePicUrl: [], // 营业执照
        description: '', // 描述
        contact: [] // 联系人
      },
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        name: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'}
        ],
        sn: [
          {required: true, min: 10, max: 10, message: '请输入10位供应商编号', trigger: 'blur'}
        ],
        shortname: [
          {required: true, message: '请输入3位字母的供应商简称', trigger: 'blur'},
          { validator: validatePass, trigger: 'blur' }
        ],
        level: [
          {required: true, message: '请选择供应商等级', trigger: 'change'}
        ],
        purchaserId: [
          {required: true, message: '请选择采购员', trigger: 'change'}
        ],
        deliverDay: [
          {required: true, message: '请输入交期', trigger: 'blur'}
        ],
        priAccountName: [
          {required: true, message: '请输入私账收款人', trigger: 'blur'}
        ],
        priAccountNo: [
          {required: true, message: '请输入私账银行卡号', trigger: 'blur'}
        ],
        priAccountBankname: [
          {required: true, message: '请输入私账开户行', trigger: 'blur'}
        ],
        selectedOptions: [
          {required: true, message: '请选择所在地', trigger: 'change'}
        ],
        addrDetail: [
          {required: true, message: '请输入详细地址', trigger: 'blur'}
        ]
      },
      peopleForm: { // 添加人员
        name: '',
        gender: '1',
        mobile: '',
        title: '',
        wechat: '',
        qq: '',
        firstChoice: 0,
        email: '',
        remark: ''
      },
      peopleRule: { // 人员规则
        name: [
          {required: true, message: '请输入联系人姓名', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入联系人电话', trigger: 'blur'},
          { validator: validateTel, trigger: 'blur' }
        ]
      },
      id: '',
      mode: 0, // 0：新增，1:编辑
      curr: 0 // 当前操作索引
    };
  },
  async mounted () {
    await this.getType();
    await this.getRole();
    await this.getSettle();
    this.id = this.$route.query.id;
    if (this.id) { // 编辑时
      this.crumbList.push({
        name: '编辑供应商',
        path: ''
      });
      this.getDetail();
    } else {
      this.crumbList.push({
        name: '新增供应商',
        path: ''
      });
    }
  },
  methods: {
    goBack () { // 返回
      history.go(-1);
    },
    oninput (e) { // 输入小数保留两位有效数字
      this.form.taxRate = this.form.taxRate.match(/^\d*(\.?\d{0,2})/g)[0];
    },
    changeInput () {
      this.form.shortname = this.form.shortname.toUpperCase();
    },
    async getDetail () { // 获取详情
      let data = await window.axios.get(`/supplier/detail/${this.id}`);
      data = data.data;
      // 处理产品分类
      for (let i = 0, len = this.typeList.length; i < len; i++) {
        for (let j = 0, jLen = this.typeList[i].listChildCategory.length; j < jLen; j++) {
          if (data.goodsCategoryId === this.typeList[i].listChildCategory[j].id) {
            this.firstName = this.typeList[i].goodsCategoryName;
            this.currFirst = i;
            this.seconedList = this.typeList[i].listChildCategory;
            this.seconedName = this.typeList[i].listChildCategory[j].goodsCategoryName;
            this.currSecond = j;
            break;
          }
        }
      }
      // 处理联系人
      data.contact.forEach(item => {
        item.gender = item.gender + '';
      });
      // 处理供应商信息
      this.form = data;
      this.form.status = this.form.status + '';
      this.form.busLicensePicUrl = this.form.busLicensePicUrl ? [{url: this.form.busLicensePicUrl.replace('80*80', '')}] : [];
      let arr = [];
      for (let i = 0, len = provinceAndCityData.length; i < len; i++) {
        if (data.addrProvince === provinceAndCityData[i].label) {
          arr.push(provinceAndCityData[i].value); // 省编号
          if (!data.addrCity) { // 不存在市跳出
            break;
          }
          for (let j = 0, jLen = provinceAndCityData[i].children.length; j < jLen; j++) {
            let curr = provinceAndCityData[i].children;
            if (curr[j].label === data.addrCity) {
              arr.push(curr[j].value); // 市编号
              // for (let k = 0, kLen = curr[j].children.length; k < kLen; k++) {
              //   let kCurr = curr[j].children;
              //   if (kCurr[k].label === data.addrArea) {
              //     arr.push(kCurr[k].value); // 区编号
              //   }
              // }
            }
          }
        }
      }
      this.form.selectedOptions = arr;
    },
    async getType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategoryRule', {
        pageNum: 1,
        pageSize: 999999
      });
      this.typeList = data.data.list;
    },
    async getRole () { // 获取采购员列表
      let data = await window.axios.get('/user/queryUserList4Select/purchase');
      data.data.forEach(item => {
        item.label = item.userName,
        item.value = item.id
      });
      this.peopleSel = data.data;
    },
    async getSettle () { // 获取结算方式
      let data = await window.axios.get(`/settletype/simpList`);
      data.data.forEach(item => {
        item.label = item.name,
        item.value = item.id
      });
      this.settleSel = data.data;
    },
    clickFirst (idx) { // 选择一级分类
      this.seconedList = this.typeList[idx].listChildCategory;
      this.firstName = this.typeList[idx].goodsCategoryName;
      this.seconedName = '';
      this.currFirst = idx;
      this.currSecond = '';
    },
    clickSecond (idx) { // 选择二级分类
      this.currSecond = idx;
      this.seconedName = this.seconedList[idx].goodsCategoryName;
    },
    next (idx) { // 下一步
      if (idx === 2) { // 往第三页跳转
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.active = idx;
          } else {
            return false;
          }
        });
      } else if (!this.seconedName) { // 未选择分类
        this.$message({
          message: '请先选择精确产品分类',
          type: 'warning'
        });
        return;
      } else {
        this.active = idx;
      }
    },
    checkSize (file) { // 文件上传前检查文件大小(小于2M)
      let name = file.name.split('.');
      let type = name[name.length - 1];
      if (type !== 'png' && type !== 'jpg') {
        this.$message({
          message: '文件格式错误',
          type: 'warning'
        });
        return false;
      }
      if (file.size >= 2 * 1024 * 1024) {
        this.$message({
          message: '文件超过限制大小',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    handleRemove() { // 删除文件
      this.form.busLicensePicUrl = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url.replace('_80x80', '');
      this.dialogVisible = true;
    },
    up (response) { // 上传成功
      this.form.busLicensePicUrl.push({
        url: response.data.thumbUrl
      });
    },
    handleSet (idx) { // 设为首选
      this.form.contact[0].firstChoice = 0;
      this.form.contact.unshift(...this.form.contact.splice(idx, 1));
      this.form.contact[0].firstChoice = 1;
    },
    handleDelete (idx) { // 删除联系人
      this.form.contact.splice(idx, 1);
    },
    handleEdit (idx) { // 编辑联系人
      this.mode = 1;
      this.curr = idx;
      this.show = true;
      this.peopleForm = JSON.parse(JSON.stringify(this.form.contact[idx]));
    },
    addPeople () { // 添加联系人
      this.mode = 0;
      this.peopleForm = { // 新增时清空数据
        name: '',
        gender: '1',
        mobile: '',
        title: '',
        wechat: '',
        qq: '',
        firstChoice: 0,
        email: '',
        remark: ''
      }
      this.show = true;
    },
    closePeople () { // 关闭联系人
      this.show = false;
    },
    addOne (formName) { // 添加联系人
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.mode) { // 新增
            this.peopleForm.firstChoice = this.form.contact.length ? 0 : 1;
            this.form.contact.push(JSON.parse(JSON.stringify(this.peopleForm)));
          } else { // 编辑
            this.form.contact.splice(this.curr, 1, JSON.parse(JSON.stringify(this.peopleForm)));
          }
          this.show = false;
        } else {
          return false;
        }
      });
    },
    async submit () { // 提交
      if (!this.form.contact.length) {
        this.$message({
          message: '请先添加联系人',
          type: 'warning'
        });
        return;
      }
      let param = JSON.parse(JSON.stringify(this.form));
      for (let i = 0, len = provinceAndCityData.length; i < len; i++) {
        if (param.selectedOptions[0] === provinceAndCityData[i].value) {
          param.addrProvince = provinceAndCityData[i].label; // 省
          if (!param.selectedOptions[1]) { // 不存在市，跳过
            break;
          }
          for (let j = 0, jLen = provinceAndCityData[i].children.length; j < jLen; j++) {
            let curr = provinceAndCityData[i].children;
            if (curr[j].value === param.selectedOptions[1]) {
              param.addrCity = curr[j].label; // 市
              // for (let k = 0, kLen = curr[j].children.length; k < kLen; k++) {
              //   let kCurr = curr[j].children;
              //   if (kCurr[k].value === param.selectedOptions[2]) {
              //     param.addrArea = kCurr[k].label; // 区
              //   }
              // }
            }
          }
        }
      }
      param.addrRegionCode = param.selectedOptions[1] || param.selectedOptions[0]; // 地区编号
      delete param.selectedOptions;
      param.busLicensePicUrl = param.busLicensePicUrl[0] && param.busLicensePicUrl[0].url; // 图片url
      param.goodsCategoryId = this.seconedList[this.currSecond].id; // 商品目录
      let url = this.id ? '/supplier/update' : '/supplier/create'; // 存在id时表示是修改
      let postData = this.id ? {
        id: this.id,
        ...param
      } : {
        ...param
      }
      let data = await window.axios.post(url, postData);
      if (data.code === 0) {
        this.$message({
          message: data.message,
          type: 'success'
        });
        history.go(-1);
      }
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
      height: 710px;
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
        top: 510px;
      }
      .compLabel {
        top: 940px;
      }
    }
    .right {
      box-sizing: border-box;
      width: calc(100% - 180px);
      padding: 100px;
      .nameInfo {
        cursor: pointer;
      }
      .typeList {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        .typeSel {
          width: 250px;
          border: 1px solid rgb(228, 228, 228);
          border-radius: 4px;
          > div {
            text-indent: 20px;
            line-height: 40px;
            border-bottom: 1px solid rgb(228, 228, 228);
          }
          .selTitle {
            background-color: rgb(228, 228, 228);
          }
          .selList {
            border-bottom: none;
            height: 280px;
            overflow-y: scroll;
            box-sizing: border-box;
            .selItem {
              display: flex;
              cursor: pointer;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgb(228, 228, 228);
              i {
                margin-right: 10px;
              }
            }
            .selItem.active {
              color: #1ABC9C;
            }
          }
        }
        .center {
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 100px;
          border: 1px solid #999;
          font-size: 30px;
          margin: 0 30px;
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
        .info {
          color: rgb(153, 153, 153)
        }
      }
      .append {
        /deep/.el-input--small .el-input__inner {
          width: 141px;
          height: 35px;
          line-height: 35px;
        }
        /deep/.el-input--small {
          width: 140px;
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
    /deep/.el-input--small .el-input__inner {
      width: 340px;
      height: 35px;
      line-height: 35px;
    }
    /deep/.el-input--small .el-textarea__inner {
      width: 340px;
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
    .peopleForm {
      margin-top: 20px;
    }
    .btn {
      border-top: 1px solid rgb(228, 228, 228);
      overflow: hidden;
      padding-right: 10px;
      div {
        float: right;
        cursor: pointer;
        width: 80px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        margin: 10px 10px;
        border: 1px solid #1ABC9C;
        text-align: center;
        border-radius: 4px;
        background-color: #1ABC9C;
        color: white;
        &.reset {
          border: 1px solid rgb(228, 228, 228);
          background-color: white;
          color: #777;
        }
      }
    }
  }
}
</style>