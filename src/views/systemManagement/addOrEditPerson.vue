<template>
  <div class="addOrEdit_wrap">
    <div class="addOrEdit_border">
      <div class="addOrEdit_top">新增用户</div>
      <div class="addOrEdit_main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
          <el-form-item label="姓名" prop="userName">
            <el-input maxlength="100" v-model="ruleForm.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input maxlength="100" v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input maxlength="100" v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input maxlength="100" v-model="ruleForm.password" placeholder="6到20位数字与字母组合" type="password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="ruleForm.roleId" placeholder="选择角色">
              <el-option v-for="(item, index) in roleNameList" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择部门" prop="deptIds">
            <el-transfer v-model="ruleForm.deptIds" :data="dptList"></el-transfer>
          </el-form-item>
          <div class="chooseDptHints">部门支持多选</div>
          <el-button type="primary" size="medium" @click="submitForm('ruleForm')" class="submitBtn">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCw8LEbXLArEnUwnGiOPw0YqDUwopOs3s0c5SWZgMID2J3s3pBD+Fme1a6JuMgiisBmFOt2bYkzHfVWkiqaZEjq5u+LAvmRhRoxgP4ESKE1Z99PWu8BlANHlctA6ybBOyWilPAYbkeUy355ot7pI97GIcLSsftD1p/8VBsJ6PafwIDAQAB';
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      let res = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(value); //6到20位数字与字母组合
      if (!res) callback(new Error('请输入6到20位数字与字母组合'));
      callback();
    };
    return {
      ruleForm: {
        userName: "",
        mobile: "",
        email: "",
        password: "",
        roleId: null,
        status: null,
        deptIds: []
      },
      encryptedPwd: "",
      pwdFlag: 0,
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        deptIds: [
          { required: true, message: '请选择部门' }
        ]
      }
    }
  },
  props: {
    roleNameList: { //角色下拉列表
      type: Array,
      required: true
    },
    dptList: { //部门列表
      type: Array,
      required: true
    },
    userId: { //编辑用户返显内容
      type: Number
    }
  },
  methods: {
    // 编辑用户返显内容
    refillForm() {
      // console.log("编辑用户返显内容");
      axios.get(`/user/queryUserInfo4Update/${this.userId}`).then((data) => {
        if (data.code !== 0) return
        let obj = JSON.parse(JSON.stringify(data.data));
        this.ruleForm.email = obj.email;
        this.ruleForm.mobile = obj.mobile;
        this.ruleForm.userName = obj.userName;
        this.ruleForm.password = "0000000a";
        // 记录原始密码-加密的
        this.encryptedPwd = obj.password;
        this.roleNameList.map((item) => {
          if (item.roleId === obj.roleId) {
            return this.ruleForm.roleId = item.roleName
          }
        })

        this.ruleForm.status = obj.status;
        this.ruleForm.deptIds = obj.deptIds;
      })
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
          if (this.userId !== null) {
            // 编辑用户
            this.editUser();
          } else {
            // 新增用户
            this.addNewUser();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addNewUser() {
      // 加密密码
      let params = JSON.parse(JSON.stringify(this.ruleForm));
      let encrypt = new window.JSEncrypt();
      encrypt.setPublicKey(publicKey);
      params.password = encrypt.encrypt(params.password);
      
      axios.post("/user/addUser", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("新增用户成功");
        this.$emit("backToListPage");
      })
    },

    editUser() {
      let params = JSON.parse(JSON.stringify(this.ruleForm));
      if (typeof(this.ruleForm.roleId) === 'string') { //直接返显,没有用下拉选
        this.roleNameList.map((item) => {
          if (item.roleName === params.roleId) {
            return params.roleId = item.roleId;
          }
        })
      }
      //是否修改密码
      params.pwdFlag = this.pwdFlag > 1 ? "yes" : "no";
      
      let encrypt = new window.JSEncrypt();
      encrypt.setPublicKey(publicKey);
      let nowPwd = encrypt.encrypt(params.password);
      params.password = params.pwdFlag === "yes" ? nowPwd : this.encryptedPwd;

      params.id = this.userId;
      axios.post("/user/updateUserInfo", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("编辑用户成功");
        this.$emit("backToListPage");
      })
    }
  },
  watch: {
    "ruleForm.password"(v) {
      if (this.userId === null ) return
      if (this.pwdFlag === 1) { //编辑时,首次改动密码输入框
        this.ruleForm.password = "";
      }
      this.pwdFlag++;
    }
  },
  created() {
    this.userId !== null && this.refillForm();
  },
}
</script>
<style lang="less" scoped>
@pageMinHeight: calc(100vh - 60px);
.addOrEdit_wrap {
  padding: 1.5% 3.5%;
  background-color: #f6f7f9;
  width: 100%;
  min-height: @pageMinHeight;
  .addOrEdit_border {
    border: 1px solid #e4e4e4;
    .addOrEdit_top {
      color: #666666;
      height: 48px;
      background-color: #f3f3f3;
      line-height: 48px;
      padding-left: 20px;
    }
    .addOrEdit_main {
      background-color: #fff;
      .ruleForm {
        width: fit-content;
        margin: 0 auto;
        padding: 50px 0;
        /deep/.el-form-item {
          width: fit-content;
          .el-form-item__content {
            width: fit-content;
            .el-input,
            .el-select {
              width: 240px;
            }
          }
          //修改form里el-transfer组件的样式bug
          .el-form-item__content .el-transfer {
            /deep/.el-checkbox:first-of-type {
              .el-checkbox__label {
                margin-bottom: -15px;
              }
            }
          }
        }
        
        .chooseDptHints {
          padding-left: 100px;
          margin-bottom: 34px;
          color: #a3a3a3;
          font-size: 12px;
        }
        .submitBtn {
          margin-left: 100px;
        }
      }
    }
  }
}
</style>