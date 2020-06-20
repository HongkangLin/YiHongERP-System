<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addType">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="分类名称：" prop="itemName">
              <el-input maxlength="100" v-model="formData.itemName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="是否为通知:" class="switch">
              <el-switch
                active-color="#1ABC9C"
                active-text="是"
                inactive-text="否"
                inactive-color="#ccc"
                v-model="formData.noticeFlag"
              ></el-switch>
              <div class="desc el-icon-info">为防止账号关联，通知信息默认禁用所有超链接，且不支持在ERP内部进行回复</div>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                maxlength="100"
                :rows="7"
                v-model="formData.bak"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="submit" @click="submit('formData')"  v-if="roleCtl.mailitem_update">提交</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleCtl: this.$store.state.role.roleCtl,
      crumbList: [
        {
          // 面包屑
          name: "客服配置",
          path: "/F1002/F100202"
        },
        {
          name: "邮件分类",
          path: "/F1002/F100202"
        }
      ],
      title: "新增分类",
      formData: {
        // 基本信息
        itemName: "",
        bak: "",
        noticeFlag: false
      },
      rules: {
        itemName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      id: ""
    };
  },
  mounted() {
    let query = this.$route.query;
    this.id = query.id;
    if (!this.id) {
      // 新增
      this.title = "新增分类";
      this.crumbList.push({
        name: "添加分类",
        path: ""
      });
    } else {
      // 编辑
      this.title = "编辑分类";
      this.crumbList.push({
        name: "编辑分类",
        path: ""
      });
      this.queryDetail(this.id);
    }
  },
  methods: {
    queryDetail(id) {
      this.API.detail(id).then(res => {
        if (res.code === 0) {
          this.formData.itemName = res.data.itemName;
          this.formData.bak = res.data.bak;
          this.formData.noticeFlag = res.data.noticeFlag ? true : false;
          this.formData.id = res.data.id;
        }
      });
    },
    submit(formName) {
      // 提交
      this.$refs[formName].validate(valid => {
        // 提交
        if (valid) {
          let type = this.id ? "update" : "add"; // 存在id时表示是修改
          this.formData.noticeFlag = this.formData.noticeFlag ? 1 : 0;
          this.API[type](this.formData).then(data => {
            if (data.code === 0) {
              this.$message({
                message: data.message,
                type: "success"
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
};
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
      width: 550px;
      margin: 40px auto 0 auto;
      .el-input--small {
        width: 400px;
      }
    }
    .desc {
      font-size: 12px;
      color: rgb(153, 153, 153);
    }
    .submit {
      cursor: pointer;
      width: 80px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background-color: #1abc9c;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>