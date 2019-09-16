<template>
  <div class="addOrEdit_wrap">
    <div class="addOrEdit_border">
      <div class="addOrEdit_top">新增用户</div>
      <div class="addOrEdit_main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="ruleForm.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" placeholder="6到20位数字与字母组合"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="ruleForm.roleId" placeholder="选择角色">
              <el-option label="" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择部门" prop="deptIds">
            <el-transfer v-model="ruleForm.deptIds" :data="deptList"></el-transfer>
          </el-form-item>
          <div class="chooseDptHints">部门支持多选</div>
          <el-button type="primary" size="medium" @click="submitForm('ruleForm')" class="submitBtn">提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      let res = /^[a-z0-9]{6,20}$/i.test(value); //6到20位数字与字母组合
      if (!res) callback(new Error('请输入6到20位数字与字母组合'));
      callback();
    };
    return {
      ruleForm: {
        userName: "",
        mobile: "",
        email: "",
        password: "",
        roleId: "",
        status: null,
        deptIds: []
      },
      deptList: [
        {
          key: 1,
          label: "采购部"
        }
      ],
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
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
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