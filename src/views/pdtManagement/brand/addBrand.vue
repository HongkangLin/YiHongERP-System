<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addBrand">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="品牌名称：" prop="goodsBrandName">
              <el-input v-model="formData.goodsBrandName" placeholder="请输入品牌名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌缩写：" prop="goodsBrandLetter">
              <el-input v-model="formData.goodsBrandLetter" maxlength="100" placeholder="请输入品牌缩写"></el-input>
            </el-form-item>
            <el-form-item label="logo：" prop="goodsBrandPicUrl">
              <el-upload
                action="/erp/file/upload"
                list-type="picture-card"
                :headers="{'x-token': token}"
                accept=".jpg, .png"
                :limit="1"
                :file-list="formData.goodsBrandPicUrl"
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
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="7" v-model="formData.goodsBrandDecription" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="submit" @click="submit('formData')">提交</div>
            </el-form-item>
          </el-form>
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
      crumbList: [{ // 面包屑
        name: '产品管理',
        path: '/F0201/F020103'
      }, {
        name: '品牌管理',
        path: '/F0201/F020103'
      }],
      title: '新增品牌',
      formData: { // 基本信息
        goodsBrandName: '',
        goodsBrandLetter: '',
        goodsBrandPicUrl: [],
        goodsBrandDecription: ''
      },
      rules: {
        goodsBrandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        goodsBrandLetter: [
          { required: true, message: '请输入品牌缩写', trigger: 'blur' }
        ],
        goodsBrandPicUrl: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ]
      },
      id: '',
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  mounted () {
    let query = this.$route.query;
    this.id = query.id;
    if (!this.id) { // 新增
      this.title = '新增品牌';
      this.crumbList.push({
        name: '新增品牌',
        path: ''
      });
    } else { // 编辑
      this.title = '编辑品牌';
      this.crumbList.push({
        name: '编辑品牌',
        path: ''
      });
      this.formData = {
        goodsBrandName: query.goodsBrandName,
        goodsBrandLetter: query.goodsBrandLetter,
        goodsBrandPicUrl: [{url: query.goodsBrandPicUrl}],
        goodsBrandDecription: query.goodsBrandDecription
      };
      this.dialogImageUrl = query.goodsBrandPicUrl.replace('_80x80', '');
    }
  },
  methods: {
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
    handleRemove() { // 删除文件
      this.formData.goodsBrandPicUrl = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url.replace('_80x80', '');
      this.dialogVisible = true;
    },
    up (response) { // 上传成功
      this.formData.goodsBrandPicUrl.push({
        url: response.data.thumbUrl
      });
    },
    submit (formName) { // 提交
      this.$refs[formName].validate((valid) => { // 提交
        if (valid) {
          let url = this.id ? '/product/updateProductBrand' : '/product/addProductBrand'; // 存在id时表示是修改
          let buf = JSON.parse(JSON.stringify(this.formData));
          buf.goodsBrandPicUrl = buf.goodsBrandPicUrl[0].url;
          let param = this.id ? {
            id: this.id,
            ...buf
          } : {
            ...buf
          }
          window.axios.post(url, param).then(data => {
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              this.$router.back();
            }
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.addBrand {
  /deep/.el-input--small {
    .el-input__inner {
      width: 240px;
      height: 35px;
      line-height: 35px;
    }
  }
  padding: 20px 50px;
  font-size: 12px;
  height: calc(100% - 50px);
  overflow: auto;
  .title {
    color: #666;
    background-color: #f3f3f3;
    height: 50px;
    line-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    text-indent: 20px;
  }
  .content {
    border: 1px solid rgb(228, 228, 228);
    border-top: none;
    overflow: hidden;
    .base {
      box-sizing: border-box;
      width: 510px;
      margin: 40px auto 0 auto;
      .el-input--small {
        width: 400px;
      }
      .el-radio {
        margin-right: 10px;
      }
    }
    .info {
      color: rgb(153, 153, 153)
    }
    .submit {
      cursor: pointer;
      width: 80px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background-color: #1ABC9C;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>