<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addType">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="模板名称：" prop="templateName">
              <el-input maxlength="100" v-model="formData.templateName" placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="网店名称：" prop="boxId">
              <el-select filterable class="selList" v-model="formData.boxId" placeholder="请选择网店">
                <el-option
                  v-for="(item,index) in shopNameList"
                  :key="index"
                  :label="item.shopName"
                  :value="item.shopId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投诉类型：">
              <el-cascader
                v-model="complaintLevelIdList"
                clearable
                placeholder="投诉分类"
                :options="complaintsClassify"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="模板内容：">
              <el-select
                filterable
                class="selList"
                v-model="txt"
                placeholder="插入占位符"
                @change="insertTxt"
              >
                <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <p class="txt">剩余字符{{residualCharacter}}</p>
              <el-input
                type="textarea"
                :maxlength="maxlen"
                ref="textArea"
                id="textarea"
                :rows="18"
                v-model="formData.templateContent"
                placeholder="请输入模板内容"
                @input="descInput"
                @blur="handleInputBlur($event)"
              ></el-input>
            </el-form-item>
            <el-form-item>
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
      crumbList: [
        {
          // 面包屑
          name: "客服配置",
          path: "/F1002/F100204"
        },
        {
          name: "消息模板",
          path: "/F1002/F100204"
        },
        {
          name: "创建模板",
          path: ""
        }
      ],
      title: "创建模板",
      complaintsClassify: [],
      shopNameList: [],
      complaintLevelIdList: [],
      typeOptions: ["买家昵称", "店铺名称", "订单编号","亚马逊商品编号"],
      formData: {
        // 基本信息
        templateName: "",
        boxId: "",
        complaintLevelOneId: "",
        complaintLevelTwoId: "",
        templateContent: ""
      },
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ]
      },
      flag: false,
      residualCharacter: 4000,
      maxlen: 4000,
      txt: "",
      blurEndIndex: undefined,
      blurStartIndex: undefined
    };
  },
  mounted() {
    let query = this.$route.query;
    this.complaintsClassify = JSON.parse(
      decodeURIComponent(query.complaintsClassify)
    );
    this.shopNameList = JSON.parse(decodeURIComponent(query.shopNameList));
    if (query.data) {
      // 编辑
      this.flag = true;
      this.title = "编辑模板";
      let data = JSON.parse(decodeURIComponent(query.data));
      this.formData.id = data.id;
      this.formData.templateName = data.templateName;
      this.formData.boxId = data.boxId;
      this.formData.complaintLevelOneId = data.complaintLevelOneId;
      if (data.complaintLevelTwoId) {
        this.formData.complaintLevelTwoId = data.complaintLevelTwoId;
      }
      this.formData.templateContent = data.templateContent;
      if (this.formData.complaintLevelOneId) {
        this.complaintLevelIdList.push(this.formData.complaintLevelOneId);
      }
      if (this.formData.complaintLevelTwoId) {
        this.complaintLevelIdList.push(this.formData.complaintLevelTwoId);
      }
      this.crumbList[this.crumbList.length] = {
        name: "编辑模板",
        path: ""
      };
      if(this.formData.templateContent.length){
        this.descInput()
      }
    }
  },
  methods: {
    descInput() {
      this.residualCharacter =
        this.maxlen - this.formData.templateContent.length;
    },
    handleChange(val) {
      this.formData.complaintLevelOneId = val[0];
      this.formData.complaintLevelTwoId = val[1] || "";
    },
    handleInputBlur(e) {
      this.blurStartIndex = e.srcElement.selectionStart;
      this.blurEndIndex = e.srcElement.selectionEnd;
    },
    insertTxt() {
      let val = `{{${this.txt}}}`;
      const textArea = document.getElementById("textarea");
      if (typeof this.blurStartIndex === "number") {
        this.formData.templateContent =
          textArea.value.substring(0, this.blurStartIndex) +
          val +
          textArea.value.substring(this.blurEndIndex);
        this.$nextTick(); 
        textArea.focus();
        textArea.setSelectionRange(
          this.blurStartIndex + val.length,
          this.blurStartIndex + val.length
        );
      } else {
        this.formData.templateContent += val;
      }
      this.descInput()
    },
    submit(formName) {
      // 提交
      this.$refs[formName].validate(valid => {
        // 提交
        if (valid) {
          let url = this.flag ? "updateTemplate" : "addTemplate"; // 存在id时表示是修改
          if (this.complaintLevelIdList.length < 2) {
            this.$message.warning(
              "该投诉类型不能添加模板,请添加对应的二级分类!"
            );
            return;
          }
          this.API[url](this.formData).then(data => {
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
    overflow-y: auto;
    height: calc(100% - 50px);
    .base {
      box-sizing: border-box;
      width: 760px;
      margin: 40px auto 0 auto;
      .el-input--small {
        width: 650px;
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
      background-color:  @themeColor;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
    .txt {
      font-size: 10px;
      text-align: end;
      line-height: 26px;
      color: rgb(153, 153, 153);
    }
  }
}
</style>