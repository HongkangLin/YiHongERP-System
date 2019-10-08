<template>
  <div>
    <crumbs :list="crumbList" :goBack="goBack"></crumbs>
    <div class="addPdt">
      <el-steps :active="active" finish-status="success" :align-center="true">
        <el-step title="选择产品分类"></el-step>
        <el-step title="填写产品信息"></el-step>
        <el-step title="上传产品图片"></el-step>
        <el-step title="关联供应商"></el-step>
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
            <div @click="next(0, 1)">下一步，填写供应商信息</div>
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
            报关信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
          <div class="lable compLabel">
            <i class="el-icon-collection-tag"></i>
            规格信息
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-form ref="form" class="form" :model="form" :rules="rules" label-width="170px">
            <el-form-item label="商品分类：">
              {{firstName}}&nbsp;<i v-if="seconedName" class="el-icon-arrow-right"></i>&nbsp;{{seconedName}}
            </el-form-item>
            <el-form-item label="产品状态：">
              <el-radio v-model="form.status" label="0">在售</el-radio>
              <el-radio v-model="form.status" label="1">停售</el-radio>
            </el-form-item>
            <el-form-item label="产品品牌：" prop="brandId">
              <el-select v-model="form.brandId" placeholder="请选择产品品牌">
                <el-option
                  v-for="item in brandList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品名称：" prop="goodsName">
              <el-input v-model="form.goodsName" placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="SKU编码：" prop="skuId">
              <el-input :disabled="disabled" v-model="form.skuId" placeholder="请输入SKU编码"></el-input>
            </el-form-item>
            <el-form-item label="销售目标价：">
              <el-input type="number" v-model="form.goodsGoalPrice" placeholder="请输入销售目标价"></el-input>
            </el-form-item>
            <el-form-item label="产品链接：">
              <el-input v-model="form.goodsUrl" placeholder="请输入产品链接"></el-input>
            </el-form-item>
            <el-form-item label="是否清货：">
              <el-switch
                v-model="form.clearStocksFlag"
                active-color="#1ABC9C"
                active-text="清"
                inactive-text="不清"
                inactive-color="#ccc">
              </el-switch>
            </el-form-item>
            <el-form-item label="FNSKU编号：" prop="fnskuId">
              <el-input :disabled="disabled" v-model="form.fnskuId" placeholder="请输入FNSKU编号"></el-input>
            </el-form-item>
            <el-form-item label="FNSKU文件：" prop="fnskuFileUrl">
              <el-upload
                class="upload-demo"
                accept=".jpg, .png, .pdf"
                drag
                action="/erp/file/upload"
                :limit="1"
                :on-exceed="() => {this.$message.warning('上传失败，只能上传一份资料哦～')}"
                :file-list="form.fnskuFileUrl"
                :before-upload="checkSize"
                :on-error="() => {this.$message.error('上传失败')}"
                :headers="{'x-token': token}"
                :on-success="up2"
                :on-remove="handleRemove2"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png/pdf格式文件，文件不能超过2M，仅允许上传1份</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="防跟卖标签：">
              <el-upload
                action="/erp/file/upload"
                list-type="picture-card"
                :headers="{'x-token': token}"
                accept=".jpg, .png"
                :limit="1"
                :file-list="form.fnskuPicUrl"
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
            <el-form-item label="合同描述：">
              <el-input type="textarea" :rows="5" v-model="form.contractDescribe" placeholder="请输入合同描述，合同描述将会在生成合同时使用"></el-input>
            </el-form-item>
            <el-form-item label="产品描述：">
              <el-input type="textarea" maxlength="500" :rows="5" v-model="form.goodsDescribe" placeholder="请输入产品描述内容，500字以内"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="海关编码：">
              <el-input v-model="form.customId" placeholder="请输入海关编码"></el-input>
            </el-form-item>
            <el-form-item label="申报价值：">
              <el-input v-model="form.claimPrice" type="number" placeholder="请输入申报价值"></el-input>
            </el-form-item>
            <el-form-item label="中文报关名：">
              <el-input v-model="form.chineseName" placeholder="请输入中文报关名"></el-input>
            </el-form-item>
            <el-form-item label="英文报关名：">
              <el-input v-model="form.englishName" placeholder="请输入英文报关名"></el-input>
            </el-form-item>
            <el-form-item label="美国进口关税：">
              <el-input v-model="form.tariffs" placeholder="请输入美国进口关税"></el-input>
            </el-form-item>
            <div class="spanDiv"></div>
            <el-form-item label="产品包装尺寸（cm）：" class="inline">
              <el-input v-model="form.goodsLength" type="number" placeholder="长"></el-input>
              <el-input v-model="form.goodsWide" type="number" class="leftSpan" placeholder="宽"></el-input>
              <el-input v-model="form.goodsHigh" type="number" class="leftSpan" placeholder="高"></el-input>
            </el-form-item>
            <el-form-item label="产品包装尺寸（in）：" class="inline">
              <el-input disabled v-model="goodsLengthIn" placeholder="-"></el-input>
              <el-input disabled v-model="goodsWideIn" class="leftSpan" placeholder="-"></el-input>
              <el-input disabled v-model="goodsHighIn" class="leftSpan" placeholder="-"></el-input>
            </el-form-item>
            <el-form-item label="每个产品重量：" class="inline">
              <el-input v-model="form.goodsWeight" type="number" placeholder="">
                <template slot="append">kg</template>
              </el-input>
              <el-input disabled v-model="goodsWeightLb" type="number" class="leftSpan" placeholder="-">
                <template slot="append">lb</template>
              </el-input>
            </el-form-item>
            <el-form-item label="整箱重量：" class="inline">
              <el-input v-model="form.packingWeight" type="number" placeholder="">
                <template slot="append">kg</template>
              </el-input>
              <el-input disabled v-model="packingWeightLb" class="leftSpan" placeholder="">
                <template slot="append">lb</template>
              </el-input>
            </el-form-item>
            <el-form-item class="append" label="装箱数：">
              <el-input v-model="form.packingQuantity" type="number" placeholder="">
                <template slot="append">套</template>
              </el-input>
            </el-form-item>
            <el-form-item label="外箱尺寸（cm）：" class="inline">
              <el-input v-model="form.packingLength" type="number" placeholder="长"></el-input>
              <el-input v-model="form.packingWide" type="number" class="leftSpan" placeholder="宽"></el-input>
              <el-input v-model="form.packingHigh" type="number" class="leftSpan" placeholder="高"></el-input>
            </el-form-item>
            <el-form-item label="外箱尺寸（in）：" class="inline">
              <el-input disabled v-model="packingLengthIn" placeholder="-"></el-input>
              <el-input disabled v-model="packingWideIn" class="leftSpan" placeholder="-"></el-input>
              <el-input disabled v-model="packingHighIn" class="leftSpan" placeholder="-"></el-input>
            </el-form-item>
          </el-form>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(1, 0)" class="pre">上一步，选择产品分类</div>
            <div @click="next(1, 2)">下一步，上传产品图片</div>
          </div>
        </div>
      </div>
      <div v-if="active === 2" class="page">
        <div class="left thirdLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            产品图片
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <el-upload
            class="upload-demo"
            action="/erp/file/upload"
            accept=".jpg, .png"
            :headers="{'x-token': token}"
            :on-exceed="() => {this.$message.warning('上传失败，只能上传3张图片哦～')}"
            :on-error="() => {this.$message.error('上传失败')}"
            :before-upload="checkSize"
            :on-success="up3"
            :on-remove="handleRemove3"
            :file-list="pdtPhoto"
            :on-preview="changeMain"
            :limit="3"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">选择jpg/png格式文件，文件尺寸不能超过2M，最多可以上传3张图片</div>
          </el-upload>
          <el-divider></el-divider>
          <div class="next">
            <div @click="next(2, 1)" class="pre">上一步，填写产品信息</div>
            <div @click="next(2, 3)">下一步，关联供应商</div>
          </div>
        </div>
      </div>
      <div v-if="active === 3" class="page">
        <div class="left thirdLeft">
          <div class="lable">
            <i class="el-icon-collection-tag"></i>
            关联供应商
            <img class="hexagon" src="../../../assets/image/svg/hexagon.svg" alt="">
          </div>
        </div>
        <div class="right">
          <div class="add" @click="addSupplier">+添加供应商</div>
          <el-table border
            :data="form.contact"
            style="width: 100%">
            <el-table-column
              align="center"
              label="供应商编号"
              prop="sn">
            </el-table-column>
            <el-table-column
              align="center"
              prop="name"
              label="供应商名称">
            </el-table-column>
            <el-table-column
              align="center"
              label="交期（天）"
              prop="deliverDay">
            </el-table-column>
            <el-table-column
              align="center"
              label="采购价（元）">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" placeholder="输入采购价"></el-input>
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
            <div @click="next(3, 2)" class="pre">上一步，上传产品图片</div>
            <div @click="submit">完成，提交</div>
          </div>
        </div>
      </div>
      <div class="addSome" v-if="show">
        <div class="title">
          <span>添加供应商</span>
          <i class="el-icon-close" @click="closeSupplier"></i>
        </div>
        <div class="content">
          <div class="search">
            <el-input placeholder="供应商名称" v-model="supplierName" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchSupplier"></el-button>
            </el-input>
          </div>
          <el-table
            :data="supplierList"
            border
            style="width: 100%">
            <el-table-column
              prop="sn"
              label="供应商编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="供应商名称"
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
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      token: localStorage.getItem('token'),
      active: 0, // 进度控制
      crumbList: [{ // 面包屑
        name: '产品管理',
        path: '/F0201/F020101'
      }, {
        name: '产品列表',
        path: '/F0201/F020101'
      }],
      typeList: [], // 分类数据
      currFirst: '', // 当前一级
      firstName: '', // 一级名
      currSecond: '', // 当前二级
      seconedName: '', // 二级名
      seconedList: [], // 二级分类数据
      show: false, // 是否显示添加界面
      brandList: [], // 品牌列表
      form: { // form表单
        status: '0', // 状态
        brandId: '', // 品牌
        goodsName: '', // 名称
        skuId: '', // sku
        goodsGoalPrice: '', // 销售目标价
        fnskuFileUrl: [], // fnsku文件
        goodsUrl: '', // 产品链接
        clearStocksFlag: false, // 是否清货
        fnskuId: '', // fnsku
        fnskuPicUrl: [], // 防跟卖标签
        contractDescribe: '', // 合同描述
        goodsDescribe: '', // 产品描述
        customId: '', // 海关编码
        claimPrice: '', // 申报价值
        chineseName: '', // 中文报关名
        englishName: '', // 英文报关名
        tariffs: '', // 进口关税
        goodsLength: '', // 包装尺寸-长
        goodsWide: '', // 包装尺寸-宽
        goodsHigh: '',  // 包装尺寸-高
        goodsWeight: '', // 产品重量
        packingWeight: '', // 整箱重量
        packingQuantity: '', // 装箱数
        packingLength: '', // 外箱尺寸-长
        packingWide: '', // 外箱尺寸-宽
        packingHigh: '', // 外箱尺寸-高
        contact: [] // 供应商列表
      },
      pdtPhoto: [], // 产品图片
      supplierList: [], // 供应商列表
      supplierName: '', // 供应商名称
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        brandId: [
          {required: true, message: '请选择产品品牌', trigger: 'change'}
        ],
        goodsName: [
          {required: true, message: '请输入产品名称', trigger: 'blur'}
        ],
        skuId: [
          {required: true, message: '请输入SKU编码', trigger: 'blur'}
        ],
        fnskuId: [
          {required: true, message: '请输入FNSKU编号', trigger: 'blur'}
        ],
        fnskuFileUrl: [
          {required: true, message: '请上传FNSKU文件', trigger: 'blur'}
        ]
      },
      id: '',
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10 // pageSize
    };
  },
  computed: {
    goodsLengthIn () { // 包装尺寸英寸长
      return this.form.goodsLength ? (this.form.goodsLength * 0.3937).toFixed(2) : '-';
    },
    goodsWideIn () { // 包装尺寸英寸宽
      return this.form.goodsWide ? (this.form.goodsWide * 0.3937).toFixed(2) : '-';
    },
    goodsHighIn () { // 包装尺寸英寸高
      return this.form.goodsHigh ? (this.form.goodsHigh * 0.3937).toFixed(2) : '-';
    },
    goodsWeightLb () { // 单个产品重量磅
      return this.form.goodsWeight ? (this.form.goodsWeight * 2.2046226).toFixed(2) : '-';
    },
    packingWeightLb () { // 整箱重量磅
      return this.form.packingWeight ? (this.form.packingWeight * 2.2046226).toFixed(2) : '-';
    },
    packingLengthIn () { // 外箱尺寸英寸长
      return this.form.packingLength ? (this.form.packingLength * 0.3937).toFixed(2) : '-';
    },
    packingWideIn () { // 外箱尺寸英寸宽
      return this.form.packingWide ? (this.form.packingWide * 0.3937).toFixed(2) : '-';
    },
    packingHighIn () { // 外箱尺寸英寸高
      return this.form.packingHigh ? (this.form.packingHigh * 0.3937).toFixed(2) : '-';
    },
    disabled () {
      return !!this.id;
    }
  },
  async mounted () {
    await this.getType();
    await this.getBrand();
    await this.getSupplier('');
    this.id = this.$route.query.id;
    if (this.id) { // 编辑时
      this.crumbList.push({
        name: '编辑产品',
        path: ''
      });
      this.getDetail();
    } else {
      this.crumbList.push({
        name: '新增产品',
        path: ''
      });
    }
  },
  methods: {
    goBack () { // 返回
      switch (this.active) {
        case 0:
          history.go(-1);
          break;
        case 1:
          this.active = 0;
          break;
        case 2:
          this.active = 1;
          break;
        case 3:
          this.active = 2;
          break;
      }
    },
    async getDetail () { // 获取详情
      let data = await window.axios.post(`/product/queryProductInfoDetail`, {
        skuId: this.id
      });
      for (let i = 0, len = this.typeList.length; i < len; i++) {
        for (let j = 0, jLen = this.typeList[i].listChildCategory.length; j < jLen; j++) {
          let curr = this.typeList[i].listChildCategory[j];
          if (curr.id === data.data.categoryId) {
            this.firstName = this.typeList[i].goodsCategoryName;
            this.currFirst = i;
            this.seconedList = this.typeList[i].listChildCategory;
            this.seconedName = curr.goodsCategoryName;
            this.currSecond = j;
            break;
          }
        }
      }
      data.data.status = data.data.status + '';
      data.data.clearStocksFlag = !!data.data.clearStocksFlag;
      data.data.fnskuFileUrl = [{
        name: data.data.fnskuFileName,
        url: data.data.fnskuFileUrl
      }];
      data.data.fnskuPicUrl = [{url: data.data.fnskuPicUrl}];
      data.data.mainPicUrl && this.pdtPhoto.push({
        name: '商品主图',
        url: data.data.mainPicUrl
      });
      data.data.picUrl1 && this.pdtPhoto.push({
        name: '设为主图',
        url: data.data.picUrl1
      });
      data.data.picUrl2 && this.pdtPhoto.push({
        name: '设为主图',
        url: data.data.picUrl2
      });
      this.form = data.data;
    },
    async getType () { // 获取产品分类
      let data = await window.axios.post('/product/queryAllCategory', {
        pageNum: 1,
        pageSize: 999999
      });
      this.typeList = data.data.list;
    },
    async getBrand () { // 获取品牌
      let data = await window.axios.post('/product/queryProductBrandList', {
        pageSize: 9999999,
        pageNum: 1,
        goodsBrandNameOrLetter: ''
      });
      data.data.list.forEach(item => {
        item.label = item.goodsBrandName,
        item.value = item.id
      });
      this.brandList = data.data.list;
    },
    async getSupplier (key) { // 获取供应商
      let data = await window.axios.get(`/supplier/listAll?pageSize=${this.pageSize}&pageNum=${this.pageNum}&snOrNameKeyword=${key}`);
      this.total = data.data.total;
      data.data.list.forEach(item => {
        for (let i = 0, len = this.form.contact.length; i < len; i++) {
          if (item.id === this.form.contact[i].id) {
            item.sel = true;
            break;
          }
        }
      });
      this.supplierList = data.data.list;
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
    next (curr, idx) { // 下一步
      if (curr > idx) {
        this.active = idx;
      } else {
        if (idx === 3 && !this.pdtPhoto.length) { // 第三页验证
          this.$message({
            message: '请先上传产品图片',
            type: 'warning'
          });
          return;
        } else if (idx === 2) { // 第二页验证
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.active = idx;
            } else {
              return false;
            }
          });
        } else if (idx === 1 && !this.seconedName) { // 第一页验证
          this.$message({
            message: '请先选择精准产品分类',
            type: 'warning'
          });
          return;
        } else {
          this.active = idx;
        }
      }
    },
    checkSize (file) { // 文件上传前检查文件大小(小于2M)
      if (file.size >= 2 * 1024 * 1024) {
        this.$message({
          message: '文件超过限制大小',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    handleRemove3 (file) { // 删除图片
      let arr = JSON.parse(JSON.stringify(this.pdtPhoto));
      let idx = 0;
      for (let i = 0, len = arr.length; i < len; i++) {
        if (file.url === arr[i].url) {
          idx = i;
          break;
        }
      }
      if (idx === 0 && this.pdtPhoto.length > 1) {
        this.pdtPhoto[1].name = '商品主图';
      }
      this.pdtPhoto.splice(idx, 1);
    },
    changeMain (file) { // 修改主辅
      if (file.name === '商品主图') {
        return;
      }
      let arr = JSON.parse(JSON.stringify(this.pdtPhoto));
      let idx = 0;
      for (let i = 0, len = arr.length; i < len; i++) {
        if (file.url === arr[i].url) {
          idx = i;
          break;
        }
      }
      this.pdtPhoto[0].name = '设为主图';
      this.pdtPhoto.unshift(...this.pdtPhoto.splice(idx, 1));
      this.pdtPhoto[0].name = '商品主图';
    },
    up3 (response) { // 上传成功
      let param = this.pdtPhoto.length ? {
        name: '设为主图',
        url: response.data.thumbUrl
      } : {
        name: '商品主图',
        url: response.data.thumbUrl
      };
      this.pdtPhoto.push(param);
    },
    handleRemove2() { // 删除文件
      this.form.fnskuFileUrl = [];
    },
    up2 (response) { // 上传成功
      this.form.fnskuFileUrl.push({
        name: response.data.fileName,
        url: response.data.thumbUrl
      });
    },
    handleRemove() { // 删除图片
      this.form.fnskuPicUrl = [];
    },
    handlePictureCardPreview(file) { // 展示大图
      this.dialogImageUrl = file.url.replace('_80x80', '');
      this.dialogVisible = true;
    },
    up (response) { // 上传成功
      this.form.fnskuPicUrl.push({
        url: response.data.thumbUrl
      });
    },
    handleDelete (idx) { // 移除供应商
      for (let i = 0, len = this.supplierList.length; i < len; i++) {
        if (this.form.contact[idx].id === this.supplierList[i].id) {
          this.$set(this.supplierList[i], 'sel', false);
        }
      }
      this.form.contact.splice(idx, 1);
    },
    addSupplier () { // 添加供应商
      this.show = true;
    },
    searchSupplier () { // 搜索供应商
      this.pageNum = 1;
      this.getSupplier(this.supplierName);
    },
    closeSupplier () { // 关闭供应商
      this.show = false;
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.getSupplier('');
    },
    handleAdd (idx) { // 添加/移除
      if (this.supplierList[idx].sel) { // 移除
        this.$set(this.supplierList[idx], 'sel', false);
        let pos = 0;
        for (let i = 0, len = this.form.contact.length; i < len; i++) {
          if (this.supplierList[idx].id === this.form.contact[i].id) {
            pos = i;
          }
        }
        this.form.contact.splice(pos, 1);
      } else { // 添加
        this.$set(this.supplierList[idx], 'sel', true);
        this.form.contact.push(this.supplierList[idx]);
      }
    },
    async submit () { // 提交
      let param = JSON.parse(JSON.stringify(this.form));
      param.categoryParentId = this.typeList[this.currFirst].id; // 一级分类id
      param.categoryId = this.currSecond !== '' ? this.seconedList[this.currSecond].id : ''; // 二级分类id
      param.clearStocksFlag = ~~param.clearStocksFlag; // 是否清货
      param.fnskuFileName = param.fnskuFileUrl[0].name; // fnsku文件名称
      param.fnskuFileUrl = param.fnskuFileUrl[0].url; // fnsku文件
      param.fnskuPicUrl = param.fnskuPicUrl[0].url; // 防跟卖标签
      param.mainPicUrl = this.pdtPhoto[0].url; // 商品主图
      param.picUrl1 = this.pdtPhoto[1] && this.pdtPhoto[1].url; // 商品图片
      param.picUrl2 = this.pdtPhoto[2] && this.pdtPhoto[2].url; // 商品图片
      console.log(param);
      let data = await window.axios.post('/product/addOrUpdateProductInfo', param);
      if (data.code === 0) {
        this.$message.success(data.message);
        history.go(-1);
        // let params = JSON.parse(JSON.stringify(this.form.contact));
        // params.forEach(item => {
        //   item.goodsId = this.form.skuId,
        //   item.supplierId = item.id,
        //   item.price = item.price || 0
        // });
        // console.log(params);
        // let list = await window.axios.post('/supplyrel/create', params); // 绑定供应关系
        // if (list.code === 0) {
        //   this.$message.success(list.message);
        //   history.go(-1);
        // }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.addPdt {
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
      height: 2200px;
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
        top: 1210px;
      }
      .compLabel {
        top: 1470px;
      }
    }
    .right {
      box-sizing: border-box;
      width: calc(100% - 180px);
      padding: 100px;
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
      .inline {
        overflow: hidden;
        /deep/.el-input--small {
          float: left;
          width: 90px;
          .el-input__inner {
            width: 90px;
            height: 35px;
            line-height: 35px;
            text-align: center;
          }
        }
        .leftSpan {
          margin-left: 16px;
        }
      }
      .append {
        /deep/.el-input--small {
          width: 180px;
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