<template>
  <div class="login_wrap">
    <img src="../../assets/image/svg/hexagon.svg" alt="">
    <div class="login">
      <div class="title">毅宏ERP管理系统</div>
      <div class="input">
        <el-input v-model="name" placeholder="请输入用户名">
          <i class="el-icon-s-custom el-input__icon" slot="prefix"></i>
        </el-input>
        <el-input v-model="pwd" placeholder="请输入密码">
          <i class="el-icon-edit el-input__icon" slot="prefix"></i>
        </el-input>
      </div>
      <div class="submit">登陆</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      pwd: ''
    }
  },
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
      line-height: 50px;
      text-align: center;
      background-color: #1ABC9C;
      color: white;
      margin-top: 15px;
    }
  }
}
</style>
