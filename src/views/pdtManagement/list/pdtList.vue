<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="pdtList">
      <div class="search">
        <div class="head">
          <el-tabs v-model="activeName" @tab-click="changeTab" class="statusTabs">
            <el-tab-pane :label="'已发布/' + total" name="0"></el-tab-pane>
            <el-tab-pane :label="'草稿/' + total1" name="1"></el-tab-pane>
          </el-tabs>
          <div class="new" v-if="roleCtl.product_add" @click="addPdt">新增产品</div>
        </div>
        <div class="content">
          <div class="inputDiv">
            <el-input maxlength="100" @change="search" class="name" v-model="name" placeholder="产品名称/SKU/海关编码"></el-input>
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
              v-model="type"
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
            <el-select filterable class="selList" @change="search" v-model="people" placeholder="采购员">
              <el-option
                v-for="item in peopleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="sel" @click="search">查询</div>
        </div>
      </div>
      <div v-if="activeName === '0'">
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
              label="产品信息">
              <template slot-scope="scope">
                <div>产品分类：{{scope.row.pdtTypeName}}</div>
                <div>品牌：{{scope.row.brandName}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="fnskuId"
              align="center"
              label="FNSKU">
            </el-table-column>
            <el-table-column
              align="center"
              label="产品状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#1ABC9C"
                  active-text="在售"
                  inactive-text="停售"
                  @change="changeStatus(scope.$index, scope.row.skuId, scope.row.status)"
                  inactive-color="#ccc">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="供应商">
              <template slot-scope="scope">
                <el-button
                  v-if="roleCtl.product_update"
                  size="mini"
                  type="text"
                  @click="handleSupplier(scope.row.id)">{{scope.row.supplierCount + '家'}}</el-button>
                <div v-else>{{scope.row.supplierCount + '家'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="purchaserName"
              align="center"
              label="采购员">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="roleCtl.product_update"
                  @click="handleEdit(scope.row.id, scope.row.skuId)">编辑</el-button>
                <el-divider direction="vertical" v-if="roleCtl.product_update && roleCtl.product_query"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleLook(scope.row.id, scope.row.skuId)">查看</el-button>
                <el-divider direction="vertical" v-if="roleCtl.product_query && roleCtl.product_update"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  v-if="roleCtl.product_update"
                  @click="handleFast(scope.row.id, scope.row.skuId)">快速编辑</el-button>
                <el-divider direction="vertical" v-if="roleCtl.product_delete && roleCtl.product_update"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  v-if="roleCtl.product_delete"
                  @click="handleDelete(scope.row.skuId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
      </div>
      <div v-else>
        <div class="table">
          <el-table
            key="save"
            :data="tableData1"
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
              label="产品信息">
              <template slot-scope="scope">
                <div>产品分类：{{scope.row.pdtTypeName}}</div>
                <div>品牌：{{scope.row.brandName}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="fnskuId"
              align="center"
              label="FNSKU">
            </el-table-column>
            <el-table-column
              align="center"
              label="产品状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  disabled
                  active-color="#1ABC9C"
                  active-text="在售"
                  inactive-text="停售"
                  inactive-color="#ccc">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="purchaserName"
              align="center"
              label="采购员">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="roleCtl.product_update"
                  @click="handleEdit1(scope.row.id)">编辑</el-button>
                <el-divider direction="vertical" v-if="roleCtl.product_update && roleCtl.product_delete"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  v-if="roleCtl.product_delete"
                  @click="handleDelete1(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="splitPage"><pageination :pageNum="pageNum1" :total="total1" :pageSize="pageSize1" @changePageSize="changePageSize1" @changePageNum="changeNum1"></pageination></div>
      </div>
    </div>
    <el-dialog title="快速编辑" :visible.sync="fastVisible" width="70%" top="20px">
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="170px">
        <el-form-item label="产品链接：">
          <el-input maxlength="100" v-model="form.goodsUrl" placeholder="请输入产品链接"></el-input>
        </el-form-item>
        <el-form-item label="FNSKU编号：" prop="fnskuId">
          <el-input maxlength="100" disabled v-model="form.fnskuId" placeholder="请输入FNSKU编号"></el-input>
        </el-form-item>
        <el-form-item label="FNSKU文件：" prop="fnskuFileUrl">
          <el-upload
            class="upload-demo"
            accept=".pdf"
            drag
            action="/erp/file/upload"
            :limit="1"
            :on-exceed="() => {this.$message.warning('上传失败，只能上传一份资料哦～')}"
            :file-list="form.fnskuFileUrl"
            :before-upload="checkSize2"
            :on-error="() => {this.$message.error('上传失败')}"
            :headers="{'x-token': token}"
            :on-success="up4"
            :on-preview="openFile"
            :on-remove="handleRemove4"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传pdf格式文件，文件不能超过2M，仅允许上传1份</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="FNSKU图片：" prop="fnskuFilePicUrl">
          <el-upload
            action="/erp/file/upload"
            list-type="picture-card"
            :headers="{'x-token': token}"
            accept=".jpg, .png"
            :limit="1"
            :file-list="form.fnskuFilePicUrl"
            :on-exceed="() => {this.$message.warning('上传失败，只能上传一张图片哦～')}"
            :before-upload="checkSize"
            :on-error="() => {this.$message.error('上传失败')}"
            :on-success="up2"
            :on-preview="handlePictureCardPreview2"
            :on-remove="handleRemove2">
            <i class="el-icon-plus"></i>
            <div class="info" slot="tip">只能上传jpg/png格式文件，文件不能超过2M</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl2" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fastVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmApplyForClose">确定</el-button>
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
      roleCtl: this.$store.state.role.roleCtl,
      activeName: '0',
      token: localStorage.getItem('token'),
      crumbList: [{ // 面包屑
        name: '产品管理',
        path: '/F0201/F020101'
      }, {
        name: '产品列表',
        path: ''
      }],
      fastVisible: false, // 快速编辑
      form: { // 产品信息
        goodsUrl: '', // 产品链接
        fnskuId: '',
        fnskuFileUrl: [],
        fnskuFilePicUrl: []
      },
      rules: {
        fnskuId: [
          {required: true, message: '请输入FNSKU编号', trigger: 'blur'}
        ],
        fnskuFileUrl: [
          {required: true, message: '请上传FNSKU文件', trigger: 'blur'}
        ],
        fnskuFilePicUrl: [
          {required: true, message: '请上传FNSKU图片', trigger: 'blur'}
        ]
      },
      skuid: '', // 当前操作的skuid
      dialogImageUrl2: '',
      dialogVisible2: false,
      name: '', // 产品名称/SKU/海关编码
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
      type: '', // 产品分类
      categoryParentId: '', // 一级分类
      categoryId: '', // 二级分类
      prdType: [{ // 产品分类
        label: '全部',
        value: ''
      }],
      brand: '', // 品牌,
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
      total1: 0, // 草稿总数
      pageNum1: 1, // 草稿pageNumber
      pageSize1: 10, // 草稿pageSize
      tableData: [], // 表格数据
      tableData1: [] // 草稿表格数据
    };
  },
  async mounted () {
    await this.getPrdType();
    await this.getBrand();
    this.getPeople();
    this.queryList();
    this.queryProductInfoTmpList();
  },
  methods: {
    changeTab (item) { // 改变tab选项
      if (item.name !== this.activeName) { // 重置搜索内容
        this.name = '';
        this.status = '';
        this.categoryParentId = '';
        this.categoryId = '';
        this.brand = '';
        this.people = '';
        this.total = 0;
        this.pageNum = 1;
        this.pageSize = 10;
        this.total1 = 0;
        this.pageNum1 = 1;
        this.pageSize1 = 10;
      }
      item.name === '0' ? this.queryList() : this.queryProductInfoTmpList(); // 重新调用接口
    },
    openFile () { // 打开fnsku文件
      window.open(this.form.fnskuFileUrl[0].url);
    },
    handleRemove4() { // 删除文件
      this.form.fnskuFileUrl = [];
    },
    up4 (response) { // 上传成功
      this.form.fnskuFileUrl.push({
        name: response.data.fileName,
        url: response.data.originUrl
      });
    },
    handleRemove2() { // 删除文件
      this.form.fnskuFilePicUrl = [];
    },
    handlePictureCardPreview2(file) { // 展示大图
      this.dialogImageUrl2 = file.url.replace('_80x80', '');
      this.dialogVisible2 = true;
    },
    up2 (response) { // 上传成功
      this.form.fnskuFilePicUrl.push({
        url: response.data.thumbUrl
      });
    },
    checkSize2 (file) { // 文件上传前检查文件大小和格式(小于2M)
      let name = file.name.split('.');
      let type = name[name.length - 1];
      if (type !== 'pdf') {
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
    },
    checkSize (file) { // 文件上传前检查文件大小和格式(小于2M)
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
    },
    confirmApplyForClose () { // 快速编辑
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let data = await window.axios.post('/product/quickUpdateProductInfo', {
            skuId: this.skuid,
            fnskuId: this.form.fnskuId,
            goodsUrl: this.form.goodsUrl,
            fnskuFileUrl: this.form.fnskuFileUrl ? this.form.fnskuFileUrl[0].url : '',
            fnskuFilePicUrl: this.form.fnskuFilePicUrl ? this.form.fnskuFilePicUrl[0].url : '',
            fnskuFileName: this.form.fnskuFileUrl ? this.form.fnskuFileUrl[0].name : ''
          });
          if (data.code === 0) {
            this.$message.success(data.message);
            this.fastVisible = false;
          }
        } else {
          return false;
        }
      });
    },
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
      let data = await window.axios.post('/product/queryProductInfoList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        skuIdOrGoodsNameOrCustomId: this.name,
        status: parseInt(this.status) < 0 ? '' : this.status,
        categoryParentId: this.categoryParentId,
        categoryId: this.categoryId,
        brandId: parseInt(this.brand) < 0 ? '' : this.brand,
        purchaserId: parseInt(this.people) < 0 ? '' : this.people
      });
      data = data.data;
      this.total = data.total;
      data.list.forEach(item => {
        item.status = item.status === 0;
        for (let i = 0, len = this.brandList.length; i < len; i++) {
          if (this.brandList[i].value === item.brandId) {
            item.brandName = this.brandList[i].label;
          }
        }
        let name = '';
        for (let j = 0, jlen = this.prdType.length; j < jlen; j++) {
          if (this.prdType[j].value === item.categoryParentId) {
            name += this.prdType[j].label + '/';
            for (let k = 0, klen = this.prdType[j].listChildCategory.length; k < klen; k++) {
              if (this.prdType[j].listChildCategory[k].value === item.categoryId) {
                name += this.prdType[j].listChildCategory[k].label;
              }
            }
          }
        }
        item.pdtTypeName = name;
      });
      this.tableData = data.list;
    },
    async queryProductInfoTmpList () { // 查询草稿列表
      let data = await window.axios.post('/product/queryProductInfoTmpList', {
        pageNum: this.pageNum1,
        pageSize: this.pageSize1,
        skuIdOrGoodsNameOrCustomId: this.name,
        status: parseInt(this.status) < 0 ? '' : this.status,
        categoryParentId: this.categoryParentId,
        categoryId: this.categoryId,
        brandId: parseInt(this.brand) < 0 ? '' : this.brand,
        purchaserId: parseInt(this.people) < 0 ? '' : this.people
      });
      data = data.data;
      this.total1 = data.total;
      data.list.forEach(item => {
        item.status = item.status === 0;
        for (let i = 0, len = this.brandList.length; i < len; i++) {
          if (this.brandList[i].value === item.brandId) {
            item.brandName = this.brandList[i].label;
          }
        }
        let name = '';
        for (let j = 0, jlen = this.prdType.length; j < jlen; j++) {
          if (this.prdType[j].value === item.categoryParentId) {
            name += this.prdType[j].label + '/';
            for (let k = 0, klen = this.prdType[j].listChildCategory.length; k < klen; k++) {
              if (this.prdType[j].listChildCategory[k].value === item.categoryId) {
                name += this.prdType[j].listChildCategory[k].label;
              }
            }
          }
        }
        item.pdtTypeName = name;
      });
      this.tableData1 = data.list;
    },
    async handleFast (id, skuid) { // 快速编辑
      this.skuid = skuid;
      let data = await window.axios.post(`/product/queryProductInfoDetail`, {
        skuId: skuid
      });
      this.form = {
        goodsUrl: data.data.goodsUrl, // 产品链接
        fnskuId: data.data.fnskuId,
        fnskuFileUrl: [{
          name: data.data.fnskuFileName,
          url: data.data.fnskuFileUrl
        }],
        fnskuFilePicUrl: data.data.fnskuFilePicUrl ? [{url: data.data.fnskuFilePicUrl}] : []
      };
      this.fastVisible = true;
    },
    handleChange (value) { // 修改产品类型
      this.categoryParentId = value[0];
      this.categoryId = value[1];
      this.search();
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.pageNum1 = 1;
      this.activeName === '0' ? this.queryList() : this.queryProductInfoTmpList();
    },
    handleLook (id, skuid) { // 查看详情
      this.$router.push({path: '/pdtDetail', query: {id, skuid}});
    },
    handleSupplier (id) { // 产品供应商
      this.$router.push(`/pdtSupplier/${id}`);
    },
    handleEdit (id, skuid) { // 编辑角色
      this.$router.push({path: '/addPdt', query: {id, skuid}});
    },
    handleEdit1 (id, skuid) { // 编辑草稿
      this.$router.push({path: '/addPdt', query: {'saveId': id}});
    },
    handleDelete (id) { // 删除产品
      this.$confirm('确定删除此产品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.post('/product/deleteProductInfo', {
          skuId: id
        }).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.message,
              type: 'success'
            });
            if (this.tableData.length === 1) { // 当前页最后一条数据
              this.pageNum = (this.pageNum - 1) || 1;
            }
            this.queryList(); // 重新获取数据
          }
        });
      });
    },
    handleDelete1 (id) { // 删除草稿
      this.$confirm('确定删除此草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.axios.post('/product/deleteProductInfoTmp', {
          id: id
        }).then(data => {
          if (data.code === 0) {
            this.$message({
              message: data.message,
              type: 'success'
            });
            if (this.tableData.length === 1) { // 当前页最后一条数据
              this.pageNum1 = (this.pageNum1 - 1) || 1;
            }
            this.queryProductInfoTmpList(); // 重新获取数据
          }
        });
      });
    },
    changeStatus (idx, id, status) { // 修改销售状态
      if (!status) {
        this.$confirm('确定要停售此产品吗？停售后将不可进行采购下单', '停售产品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitStatus(id, status);
        }).catch(() => {
          this.tableData[idx].status = true;
        });
      } else {
        this.submitStatus(id, status);
      }
    },
    async submitStatus (id, status) { // 提交修改的状态
      let data = await window.axios.post('/product/updateProductInfo', {
        skuId: id,
        status: ~~!status
      });
      data.code === 0 ? this.$message.success(data.message) : this.$message.error(data.message);
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
    changeNum1 (num) { // 改变草稿页码
      this.pageNum1 = num;
      this.queryProductInfoTmpList();
    },
    changePageSize1 (size) { // 改变草稿每页条数
      this.pageNum1 = 1;
      this.pageSize1 = size;
      this.queryProductInfoTmpList();
    },
    addPdt () { // 新增角色
      this.$router.push('/addPdt');
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
      .el-tabs {
        /deep/.el-tabs__header {
          .el-tabs__nav-wrap::after {
            display: none!important;
          }
          .el-tabs__nav {
            margin-left: 20px;
            .el-tabs__item {
              padding: 0 40px;
              &:nth-child(2) {
                padding-left: 16px;
              }
              &:last-child {
                padding-right: 16px;
              }
            }
          }
        }
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
</style>