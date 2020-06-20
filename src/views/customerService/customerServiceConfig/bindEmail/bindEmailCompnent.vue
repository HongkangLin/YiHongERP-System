<template>
  <section>
    <!-- 顶部面包屑 -->
    <crumbs :list="crumbList" :showReturn="true"></crumbs>
    <div class="brandManagement">
      <div class="title">
        <div class="head">{{title}}</div>
      </div>
      <div class="form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
          style="margin:0 auto;width:550px;padding: 60px 0;"
        >
          <el-form-item label="网店名称：" prop="shopId">
            <el-select filterable v-model="ruleForm.shopId" placeholder="选择网店" class="select">
              <el-option
                v-for="(item,index) in shopNameList"
                :key="index"
                :label="item.shopName"
                :value="item.shopId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱账号:" prop="emailUsername">
            <el-input v-model="ruleForm.emailUsername" placeholder="请输入当前网店Amazon绑定邮箱" clearable></el-input>
          </el-form-item>
          <el-form-item label="邮箱密码:" prop="emailPassword">
            <el-input
              v-model="ruleForm.emailPassword"
              placeholder="请输入当前邮箱密码"
              type="passWord"
              autocomplete="new-password"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="收件协议:" prop="emailProtocol">
            <el-radio-group v-model="ruleForm.emailProtocol">
              <el-radio label="imap"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="IMAP服务器:" prop="emailReceiveHost">
            <el-input v-model="ruleForm.emailReceiveHost" placeholder="请输入IMAP服务器地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="启用SSL端口:" prop="useSSL" class="switch">
            <el-switch
              v-model="useSSL"
              active-color="#1ABC9C"
              active-text="是"
              inactive-text="否"
              inactive-color="#ccc"
              @change="useSSLChange"
            ></el-switch>
          </el-form-item>
          <el-form-item label="SSL端口号:" prop="emailReceiveSslPort">
            <el-input
              v-model="ruleForm.emailReceiveSslPort"
              placeholder="请输入SSL端口号"
              :disabled="!useSSL"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="SMTP服务器:" prop="emailSmtpHost">
            <el-input v-model="ruleForm.emailSmtpHost" placeholder="请输入SMTP服务器地址" clearable></el-input>
          </el-form-item>
          <el-form-item label="启用TLS端口:" prop="useTLS" class="switch">
            <el-switch
              v-model="useTLS"
              active-color="#1ABC9C"
              active-text="是"
              inactive-text="否"
              inactive-color="#ccc"
              @change="useTLSChange"
            ></el-switch>
          </el-form-item>
          <el-form-item label="TLS端口号:" prop="emailSmtpSslPort">
            <el-input
              v-model="ruleForm.emailSmtpSslPort"
              placeholder="请输入TLS端口号"
              :disabled="!useTLS"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm','bind')">立即绑定</el-button>
            <el-button @click="submitForm('ruleForm')">测试邮箱状态</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    const emailUsernameReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    let validateEmailUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入当前网店Amazon绑定邮箱"));
      } else if (!emailUsernameReg.test(value)) {
        //正则验证不通过，格式不对
        callback(new Error("邮箱格式不正确!"));
      } else {
        callback();
      }
    };
    let validateShopId = (rule, value, callback) => {
      if (typeof value != "number") {
        callback(new Error("请选择网店名称"));
      } else {
        callback();
      }
    };
    let validateEmailPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validateEmailReceiveHost = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入IMAP服务器地址"));
      } else {
        callback();
      }
    };
    return {
      crumbList: [
        {
          // 面包屑
          name: "客服配置",
          path: "/F1002/F100201"
        },
        {
          // 面包屑
          name: "邮箱绑定",
          path: "/F1002/F100201"
        },
        {
          name: "绑定邮箱",
          path: ""
        }
      ],
      useSSL: false,
      useTLS: false,
      ruleForm: {
        shopId: "",
        emailUsername: "",
        emailPassword: "",
        emailProtocol: "imap",
        emailReceiveHost: "",
        emailReceiveSslPort: "",
        emailSmtpHost: "",
        emailSmtpSslPort: ""
      },
      rules: {
        shopId: [
          { validator: validateShopId, trigger: "blur", required: true }
        ],
        emailUsername: [
          { validator: validateEmailUsername, trigger: "blur", required: true }
        ],
        emailPassword: [
          { validator: validateEmailPassword, trigger: "blur", required: true }
        ],
        emailReceiveHost: [
          {
            validator: validateEmailReceiveHost,
            trigger: "blur",
            required: true
          }
        ]
      },
      title: "绑定邮箱",
      id: "",
      encryptedPwd: "",
      isChange: 0,
      shopNameList: []
    };
  },
  mounted() {
    this.queryAllShopNameList();
    let query = this.$route.query;
    this.id = query.id;
    if (this.id) {
      // 编辑
      this.title = "编辑邮箱";
      this.$set(this.crumbList, 2, {
        name: "编辑邮箱",
        path: ""
      });
      this.query4UpdateBox(this.id);
    }
  },
  watch: {
    "ruleForm.emailPassword"(v) {
      if (!this.id) return;
      if (this.isChange === 1) {
        //编辑时,首次改动密码输入框
        this.ruleForm.emailPassword = "";
      }
      this.isChange++;
    }
  },
  methods: {
    queryAllShopNameList() {
      this.API.queryAllShopNameList().then(res => {
        if (res.code === 0) {
          this.shopNameList = [...res.data];
        }
      });
    },
    useSSLChange(i) {
      this.ruleForm.emailReceiveSslPort = i ? 993 : "";
    },
    useTLSChange(i) {
      this.ruleForm.emailSmtpSslPort = i ? 465 : "";
    },
    query4UpdateBox(id) {
      this.API.query4UpdateBox(id).then(res => {
        if (res.code === 0 && res.data != null) {
          this.encryptedPwd = res.data.emailPassword; //原始密码
          this.ruleForm.shopId = res.data.shopId;
          this.ruleForm.emailUsername = res.data.emailUsername;
          this.ruleForm.emailProtocol = res.data.emailProtocol;
          this.ruleForm.emailReceiveHost = res.data.emailReceiveHost;
          this.ruleForm.emailSmtpHost = res.data.emailSmtpHost;
          this.ruleForm.emailPassword = "*******0";
          if (res.data.emailReceiveSslPort != -1) {
            this.useSSL = true;
            this.ruleForm.emailReceiveSslPort = res.data.emailReceiveSslPort;
          }
          if (res.data.emailSmtpSslPort != -1) {
            this.useTLS = true;
            this.ruleForm.emailSmtpSslPort = res.data.emailSmtpSslPort;
          }
        }
      });
    },
    async submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkBoxStatus(this.dealData("checkBoxStatus"), type);
          this.$loading({
            text: "数据处理中....",
            background: "rgba(0, 0, 0, 0.8)"
          });
        } else {
          this.$message.error("请完善信息!");
        }
      });
    },
    checkBoxStatus(parmas, type) {
      this.API.checkBoxStatus(parmas)
        .then(res => {
          if (res.code === 0) {
            if (type) {
              let operate;
              if (type === "bind" && this.id) {
                operate = "updateBox";
              } else if (type === "bind") {
                operate = "addBox";
              }
              this.request(this.dealData(operate), operate);
            } else {
              this.$loading().close();
              this.$message.success(`${res.message}`);
            }
          } else {
            this.$loading().close();
          }
        })
        .catch(err => {
          this.$loading().close();
          this.$message.error("网络错误,请重试");
        });
    },
    request(parmas, operate) {
      this.API[operate](parmas)
        .then(res => {
          this.$loading().close();
          if (res.code === 0) {
            this.$message.success(`${res.message}`);
            this.$router.back();
          }
        })
        .catch(err => {
          this.$loading().close();
          this.$message.error("网络错误,请重试");
        });
    },
    dealData(operate) {
      let parmas = JSON.parse(JSON.stringify(this.ruleForm));
      if (this.id) {
        parmas.emailPassword =
          this.isChange > 1
            ? this.encrypt(parmas.emailPassword)
            : this.encryptedPwd;
      } else {
        parmas.emailPassword = this.encrypt(parmas.emailPassword);
      }
      if (operate === "updateBox") {
        parmas.id = this.id;
      }
      if (!this.useSSL) parmas.emailReceiveSslPort = -1;
      if (!this.useTLS) parmas.emailSmtpSslPort = -1;
      parmas.emailReceiveSslPort = Number(parmas.emailReceiveSslPort);
      parmas.emailSmtpSslPort = Number(parmas.emailSmtpSslPort);
      return parmas;
    }
  }
};
</script>

<style lang="less" scoped>
.brandManagement {
  box-sizing: content-box;
  padding: 20px 50px;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  border: 1px solid #efefef;
  color: #666666;
  .title {
    border: 1px solid #e4e4e4;
    height: 50px;
    font-family: "PingFangSC-Regular", "PingFang SC";
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    text-align: left;
    line-height: 28px;
    background: rgb(243, 243, 243);
    .head {
      margin-left: 20px;
      line-height: 50px;
    }
  }
  .form {
    border: 1px solid #e4e4e4;
    border-top: none;
    .omit {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .select {
      width: 100%;
    }
  }
}
</style>