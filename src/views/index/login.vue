<template>
  <div class="login_wrap">
    <img src="../../assets/image/svg/hexagons.svg" alt="">
    <div class="login">
      <div class="title">毅弘ERP管理系统</div>
      <div class="input">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item prop="email">
            <el-input autocomplete="new-password" maxlength="100" @change="$refs.pas.focus()" v-model="form.email" placeholder="请输入邮箱">
              <i class="el-icon-s-custom el-input__icon" slot="prefix"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input autocomplete="new-password" ref="pas" id="pas" maxlength="100" type="password" v-model="form.password" placeholder="请输入密码">
              <i class="el-icon-edit el-input__icon" slot="prefix"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="submit" @click="login('ruleForm')">登录</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCw8LEbXLArEnUwnGiOPw0YqDUwopOs3s0c5SWZgMID2J3s3pBD+Fme1a6JuMgiisBmFOt2bYkzHfVWkiqaZEjq5u+LAvmRhRoxgP4ESKE1Z99PWu8BlANHlctA6ybBOyWilPAYbkeUy355ot7pI97GIcLSsftD1p/8VBsJ6PafwIDAQAB',
      form: {
        email: '',
        password: ''
      },
      flag: false,
      rules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    document.getElementById('pas').addEventListener('keydown', e => { // 在密码框上回车自动登录
      if (e.keyCode === 13) {
        this.login('ruleForm');
      }
    });
  },
  methods: {
    login (formName) { // 登陆
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let encrypt = new window.JSEncrypt();
          encrypt.setPublicKey(this.publicKey);
          let param = {
            email: this.form.email,
            notToken: 1,
            password: encrypt.encrypt(this.form.password) // 加密密码
          };
          window.axios.post('/user/login', param).then(e => {
            if (e.code === 0) {
              this.$message.success(e.message);
              localStorage.setItem('token', e.data.token);
              localStorage.setItem('userName', e.data.userName);
              localStorage.setItem('email', e.data.email);
              localStorage.setItem('mobile', e.data.mobile);
              localStorage.setItem('roleName', e.data.roleName);
              this.$router.replace('/F0201/F020101'); // 登陆成功
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.login_wrap {
  .el-input--small .el-input__inner {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-indent: 10px;
  }
  .el-input--small .el-input__icon {
    font-size: 20px;
    margin: 0 5px;
  }
}
</style>
<style lang="less" scoped>
.login_wrap {
  width: 100vw;
  height: 100vh;
  min-height: 767.84px;
  min-width: 740px;
  background-color: #1ABC9C;
  overflow: hidden;
  img {
    position: absolute;
    top: 80px;
    right: 70px;
    height:500px;
    width:600px;
  }
  .login {
    position: relative;
    width: 420px;
    height: 400px;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 183.92px;
    background-color: white;
    border-radius: 10px;
    z-index: 10;
    -moz-box-shadow:0px 0px 7px #01814a;
    -webkit-box-shadow:0px 0px 7px #01814a;
    box-shadow:0px 0px 7px #01814a;
    .title {
      font-size: 28px;
      line-height: 75px;
      text-align: center;
      color: #1ABC9C;
      font-weight: bold;
      margin-top: 40px;
    }
    .input {
      width: 300px;
      margin: 0 auto;
      line-height: 65px;
      font-size: 28px;
    }
    .submit {
      font-size: 20px;
      width: 300px;
      margin: 0 auto;
      border-radius: 4px;
      cursor: pointer;
      line-height: 50px;
      text-align: center;
      background-color: #1ABC9C;
      color: white;
      margin-top: 15px;
    }
  }
}
</style>
