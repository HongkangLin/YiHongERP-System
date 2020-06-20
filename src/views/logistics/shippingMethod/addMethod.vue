<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addType">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="运输方式：" prop="name">
              <el-input maxlength="10" v-model="formData.name" placeholder="请输入运输方式名称，不可重复"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" maxlength="200" :rows="7" v-model="formData.remark" placeholder="请输入200字以内的备注"></el-input>
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
      crumbList: [{ // 面包屑
        name: '新增运输方式',
        path: ''
      }],
      title: '新增运输方式',
      formData: { // 基本信息
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入运输方式名称，不可重复', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    const { id, name, remark } = this.$route.query;
    if (id) {
      this.formData.name = name;
      this.formData.remark = remark;
    }
  },
  methods: {
    submit (formName) { // 提交
      this.$refs[formName].validate((valid) => { // 提交
        if (valid) {
          let url = this.$route.query.id ? '/transport_type/update' : '/transport_type/create'; // 存在id时表示是修改
          let param = this.$route.query.id ? {
            id: this.$route.query.id,
            name: this.formData.name,
            remark: this.formData.remark
          } : {
            name: this.formData.name,
            remark: this.formData.remark
          }
          window.axios.post(url, param).then(data => {
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: 'success'
              });
              this.$router.back();
            } else {
              this.$message.error(data.message);
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
.addType {
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
    }
    .desc {
      font-size: 12px;
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