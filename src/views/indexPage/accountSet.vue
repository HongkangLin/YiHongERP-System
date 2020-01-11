<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="indexPage_wrap">
      <div class="main">
        <div class="fastEntries">
          <div class="secHeader">账户设置</div>
          <div class="secBody">
            <div class="head">
              <img :src="headImg" alt="">
            </div>
            <div class="up">
              <el-upload
                action="/erp/file/upload"
                :headers="{'x-token': token}"
                :show-file-list="false"
                :before-upload="checkSize"
                :file-list="fileList"
                :on-error="() => {this.$message.error('上传失败')}"
                :on-success="up"
                accept=".jpg, .png">
                <span>上传头像</span>
              </el-upload>
            </div>
            <el-form class="form" ref="form" label-width="100px" :model="form" :rules="rules">
              <el-form-item label="邮箱：">
                <el-input disabled v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号：" prop="tel">
                <el-input v-model="form.tel"></el-input>
              </el-form-item>
              <el-form-item label="新密码：" prop="newPwd">
                <el-input v-model="form.newPwd"></el-input>
              </el-form-item>
              <el-form-item label="确定密码：" prop="surePwd">
                <el-input v-model="form.surePwd"></el-input>
              </el-form-item>
            </el-form>
            <div @click="submit" class="save">提&nbsp;交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      crumbList: [{ // 面包屑
        name: '首页',
        path: '/home'
      }, {
        name: '账户设置',
        path: ''
      }],
      headImg: require('../../assets/image/head.png'),
      fileList: [], // 文件列表
      form: { // 表单数据
        email: '',
        name: '',
        tel: '',
        newPwd: '',
        surePwd: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        newPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        surePwd: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
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
    up (response) { // 上传
      this.fileList = [{
        name: response.data.fileName,
        url: response.data.originUrl
      }];
      this.headImg = response.data.originUrl;
    },
    submit () { // 提交
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(11);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.indexPage_wrap {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  .main {
    background-color: #f9f9f9;
    padding: 20px 50px;
    font-size: 14px;
    height: 100%;
    .fastEntries {
      border: 1px solid #e4e4e4;
      .secHeader {
        background-color: #f3f3f3;
        color: #666;
        height: 42px;
        line-height: 42px;
        padding-left: 20px;
        border-bottom: 1px solid #e4e4e4;
      }
      .secBody {
        background-color: #fff;
        padding: 40px 40px 60px;
        .head {
          overflow: hidden;
          border-radius: 100px;
          width: 100px;
          height: 100px;
          margin: 0 auto 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .up {
          text-align: center;
          color: #1ABC9C;
          cursor: pointer;
        }
        .form {
          width: 420px;
          padding-right: 80px;
          margin: 10px auto 0;
        }
        .save {
          width: 80px;
          height: 35px;
          line-height: 35px;
          margin: 0 auto;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
          background-color: #1ABC9C;
          color: white;
        }
      }
    }
  }
}
</style>
