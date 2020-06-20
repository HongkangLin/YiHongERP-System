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
                <el-input disabled v-model="email"></el-input>
              </el-form-item>
              <el-form-item label="姓名：" prop="userName">
                <el-input maxlength="100" placeholder="请输入姓名" v-model="form.userName"></el-input>
              </el-form-item>
              <el-form-item label="手机号：" prop="mobile">
                <el-input maxlength="11" placeholder="请输入手机号" v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="新密码：" prop="newPwd">
                <el-input maxlength="100" placeholder="请输入密码" v-model="form.newPwd"></el-input>
              </el-form-item>
              <el-form-item label="确定密码：" prop="confirmPwd">
                <el-input maxlength="100" placeholder="请输入密码" v-model="form.confirmPwd"></el-input>
              </el-form-item>
            </el-form>
            <div @click="submit" class="save" v-if="roleCtl.ownuser_update">提&nbsp;交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCw8LEbXLArEnUwnGiOPw0YqDUwopOs3s0c5SWZgMID2J3s3pBD+Fme1a6JuMgiisBmFOt2bYkzHfVWkiqaZEjq5u+LAvmRhRoxgP4ESKE1Z99PWu8BlANHlctA6ybBOyWilPAYbkeUy355ot7pI97GIcLSsftD1p/8VBsJ6PafwIDAQAB';
export default {
  data() {
    var validateTel = (rule, value, callback) => {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
        callback(new Error('请输入正确电话号码'));
      } else {
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        callback(new Error('密码中不能包含中文'));
      } else {
        callback();
      }
    };
    return {
      roleCtl: this.$store.state.role.roleCtl,
      token: localStorage.getItem('token'),
      crumbList: [{ // 面包屑
        name: '首页',
        path: '/home'
      }, {
        name: '账户设置',
        path: ''
      }],
      headImg: localStorage.getItem('avatarFilePath') || require('../../assets/image/head.png'),
      fileList: [], // 文件列表
      email: localStorage.getItem('email'),
      form: { // 表单数据
        userName: localStorage.getItem('userName'),
        mobile: localStorage.getItem('mobile'),
        newPwd: '',
        confirmPwd: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: validateTel, trigger: 'blur' }
        ],
        newPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { validator: validatePwd, trigger: 'blur' }
        ],
        confirmPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { validator: validatePwd, trigger: 'blur' }
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
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.form.newPwd !== this.form.confirmPwd) {
            this.$message.warning('两次输入密码必须一致');
            return;
          }
          let param = JSON.parse(JSON.stringify(this.form));
          let encrypt = new window.JSEncrypt();
          encrypt.setPublicKey(publicKey);
          param.newPwd = encrypt.encrypt(param.newPwd);
          param.confirmPwd = encrypt.encrypt(param.confirmPwd);
          param.avatarFilePath = this.fileList[0] ? this.fileList[0].url : '';
          let data = await window.axios.post('/user/updateOwnUserInfo', param);
          if (data.code === 0) {
            this.$message.success(data.message);
            localStorage.removeItem('token');
            this.$router.replace('/login');
          }
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
