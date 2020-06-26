<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addType">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <p>基础信息</p>
            <el-form-item label="规则名称：" prop="ruleName" class="mg_l_80">
              <el-input maxlength="100" v-model="formData.ruleName" placeholder="请输入规则名称"></el-input>
            </el-form-item>
            <el-form-item label="邮箱账号：" class="mg_l_80" prop="boxId">
              <el-select filterable class="selList" v-model="formData.boxId" placeholder="选择邮箱">
                <el-option
                  v-for="(item,index) in emailList"
                  :key="index"
                  :label="item.emailUsername"
                  :value="item.boxId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮件分类：" class="mg_l_80" prop="itemId">
              <el-select filterable class="selList" v-model="formData.itemId" placeholder="选择邮件分类">
                <el-option
                  v-for="(item,index) in simpList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <p>匹配规则</p>
            <el-form-item label="发件箱包含：" prop="sendboxContains" class="mg_l_80">
              <el-input maxlength="100" v-model="formData.sendboxContains" placeholder="多个条件以';'隔开"></el-input>
            </el-form-item>
            <el-form-item label="标题包含：" prop="titleContains" class="mg_l_80">
              <el-input maxlength="100" v-model="formData.titleContains" placeholder="多个条件以';'隔开"></el-input>
            </el-form-item>
            <el-form-item class="mg_l_80" v-if="roleCtl.mailitemrule_update">
              <div class="submit" @click="submit('formData')">保存</div>
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
          path: "/F1002/F100203"
        },
        {
          name: "分发规则",
          path: "/F1002/F100203"
        }
      ],
      title: "添加规则",
      formData: {},
      rules: {
        ruleName: [
          { required: true, message: "请输入规则名称", trigger: "blur" }
        ],
        boxId: [{ required: true, message: "请选择邮箱账号", trigger: "blur" }],
        itemId: [{ required: true, message: "请选择邮件分类", trigger: "blur" }]
      },
      id: "",
      simpList: [],
      emailList: []
    };
  },
  mounted() {
    let query = this.$route.query;
    this.id = query.id;
    this.querySimpList();
    this.queryAllBoxInfo();
    if (!this.id) {
      // 新增
      this.title = "添加规则";
      this.crumbList.push({
        name: "添加规则",
        path: ""
      });
    } else {
      // 编辑
      this.title = "编辑规则";
      this.crumbList.push({
        name: "编辑规则",
        path: ""
      });
      this.queryMailitemruleDetail(this.id);
    }
  },
  methods: {
    queryMailitemruleDetail(id) {
      this.API.mailitemruleDetail(id).then(res => {
        if (res.code === 0) {
          this.formData = Object.assign({}, res.data);
        }
      });
    },
    querySimpList() {
      this.API.simpList().then(res => {
        if (res.code === 0) {
          this.simpList = [...res.data];
        }
      });
    },
    queryAllBoxInfo() {
      this.API.queryAllBoxInfo().then(res => {
        if (res.code === 0) {
          this.emailList = [...res.data];
        }
      });
    },
    submit(formName) {
      // 提交
      let formData = this.formData;
      this.$refs[formName].validate(valid => {
        // 提交
        if (valid) {
          if (!formData.sendboxContains && !formData.titleContains) {
            this.$message.error("请输入至少一条匹配规则");
            return false;
          }
          let param = {
            ruleName: formData.ruleName,
            boxId: formData.boxId,
            itemId: formData.itemId,
            sendboxContains: formData.sendboxContains,
            titleContains: formData.titleContains
          };
          let type = this.id ? "mailitemruleUpdate" : "mailitemruleAdd"; // 存在id时表示是修改

          if (this.id) {
            param.id = this.id;
          }
          this.API[type](param).then(data => {
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
@import "~@/assets/css/variables.less";
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
    .mg_l_80 {
      margin-left: 80px;
    }
    .base {
      box-sizing: border-box;
      width: 510px;
      //   margin: 40px auto 0 auto;
      .el-input--small {
        width: 400px;
      }
    }
    p {
      margin: 34px 0 34px 22px;
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
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
      background-color: @themeColor;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>