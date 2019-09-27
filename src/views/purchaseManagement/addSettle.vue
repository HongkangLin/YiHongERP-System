<template>
  <div class="addSettle">
    <div class="title">{{title}}</div>
    <div class="content">
      <div class="base">
        <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
          <el-form-item label="结算方式：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入结算方式"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" :rows="7" v-model="formData.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="submit" @click="submit('formData')">提交</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '新增结算方式',
      formData: { // 基本信息
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入结算方式', trigger: 'blur' }
        ]
      },
      id: ''
    };
  },
  mounted () {
    let query = this.$route.query;
    this.id = query.id;
    if (!this.id) { // 新增
      this.title = '新增结算方式';
    } else { // 编辑
      this.title = '编辑结算方式';
      this.formData = {
        name: query.name,
        remark: query.remark
      };
    }
  },
  methods: {
    submit (formName) { // 提交
      this.$refs[formName].validate((valid) => { // 提交
        if (valid) {
          let url = this.id ? '/settletype/update' : '/settletype/create'; // 存在id时表示是修改
          let param = this.id ? {
            id: this.id,
            ...this.formData
          } : {
            ...this.formData
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
.addSettle {
  /deep/.el-input--small {
    .el-input__inner {
      width: 240px;
      height: 35px;
      line-height: 35px;
    }
  }
  padding: 20px;
  font-size: 12px;
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