<template>
  <div class="addOrEditStore_wrap">
		<div class="header">{{storeId ? "编辑仓库" : "新增仓库"}}</div>
    <div class="formArea">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm">
        <el-form-item label="仓库编号：" prop="id">
          <el-input maxlength="100" v-model="ruleForm.id" placeholder="提交后自动生成" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库名称：" prop="name">
          <el-input maxlength="100" v-model="ruleForm.name" placeholder="请输入仓库名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人：" prop="chargePersonId">
          <el-select filterable v-model="ruleForm.chargePersonId" placeholder="选择负责人">
            <el-option v-for="(item, index) in chargePersonList" :key="index" :label="item.userName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库状态：" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="仓库类型：" prop="type">
          <el-select filterable v-model="ruleForm.type" placeholder="选择仓库类型">
            <el-option label="国内" value=0></el-option>
            <el-option label="国外" value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="揽收联系人：" prop="collectorName">
          <el-input maxlength="100" v-model="ruleForm.collectorName" placeholder="请输入揽收联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="揽收联系人电话：" prop="collectorMobile">
          <el-input maxlength="100" v-model="ruleForm.collectorMobile" placeholder="请输入揽收联系人电话"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input maxlength="100" v-model="ruleForm.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="邮编：" prop="postCode">
          <el-input maxlength="100" v-model="ruleForm.postCode" placeholder="请输入邮编"></el-input>
        </el-form-item>
        <el-form-item label="所在地：" prop="addrProvince">
          <div class="wrap">
            <el-select filterable v-model="ruleForm.addrProvince" placeholder="省" class="province" @change="getAddressList('city')">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <el-select filterable v-model="ruleForm.addrCity" placeholder="市" class="city" @change="getAddressList('area')">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <el-select filterable v-model="ruleForm.addrArea" placeholder="区" class="area">
              <el-option v-for="(item, index) in areaList" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="详细地址：" prop="addrDetail">
          <el-input maxlength="100" v-model="ruleForm.addrDetail" placeholder="示例:某某街某某路"></el-input>
        </el-form-item>
        <el-form-item label="固定电话：" prop="fixedPhone">
          <el-input maxlength="100" v-model="ruleForm.fixedPhone" placeholder="请输入固定电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：" prop="email">
          <el-input maxlength="100" v-model="ruleForm.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('ruleForm')" class="submitBtn">提交</el-button>
      </el-form>
    </div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        id: "",
        name: "",
        chargePersonId: null, 
        status: null,
        type: null,
        collectorName: "",
        collectorMobile: "",
        companyName: "",
        postCode: "",
        addrProvince: "",
        addrCity: "",
        addrArea: "",
        addrDetail: "",
        fixedPhone: "",
        email: ""
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      rules: {
        name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        chargePersonId: [
          { required: true, message: '选择负责人', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        type: [
          { required: true, message: '选择仓库类型', trigger: 'change' }
        ],
        collectorName: [
          { required: true, message: '请输入揽收联系人姓名', trigger: 'blur' }
        ],
        collectorMobile: [
          { required: true, message: '请输入揽收联系人电话', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '请输入邮编', trigger: 'blur' }
        ],
        addrProvince: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        addrDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    storeId: {
      type: Number
    },
    chargePersonList: {
      type: Array,
      required: true
    }
  },
  created() {
    this.storeId && this.refillForm();
    this.getAddressList("province");
  },
  methods: {
    // 编辑仓库返显内容
    refillForm() {
      axios.get(`/warehouse/detail/${this.storeId}`).then((data) => {
        if (data.code !== 0) return

        let obj = JSON.parse(JSON.stringify(data.data));
        this.ruleForm.id = obj.id;
        this.ruleForm.name = obj.name;
        this.ruleForm.chargePersonId = obj.chargePersonName;
        this.ruleForm.chargePersonId_copy = obj.chargePersonId;
        this.ruleForm.status = obj.status;
        this.ruleForm.type = obj.type ? "国外" : "国内";
        this.ruleForm.type_copy = obj.type;
        this.ruleForm.collectorName = obj.collectorName;
        this.ruleForm.collectorMobile = obj.collectorMobile;
        this.ruleForm.companyName = obj.companyName;
        this.ruleForm.postCode = obj.postCode;
        this.ruleForm.addrProvince = obj.addrProvince;
        this.ruleForm.addrCity = obj.addrCity;
        this.ruleForm.addrArea = obj.addrArea;
        this.ruleForm.addrDetail = obj.addrDetail;
        this.ruleForm.fixedPhone = obj.fixedPhone;
        this.ruleForm.email = obj.email;
      })
    },

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!');
          if (this.storeId) {
            // 编辑仓库
            this.editStore();
          } else {
            // 创建新仓库
            this.addNewStore();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addNewStore() {
      let params = JSON.parse(JSON.stringify(this.ruleForm));
      params.addrProvince = params.addrProvince.split(",")[0];
      params.addrCity = params.addrCity.split(",")[0];
      params.addrArea = params.addrArea.split(",")[0];

      axios.post("/warehouse/create", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("创建新仓库成功");
        this.$emit("backToListPage");
      })
    },

    editStore() {
      let params = JSON.parse(JSON.stringify(this.ruleForm));
      params.addrProvince = params.addrProvince.split(",")[0];
      params.addrCity = params.addrCity.split(",")[0];
      params.addrArea = params.addrArea.split(",")[0];
      // 若是返显的负责人
      if (typeof(this.ruleForm.chargePersonId) !== "number") { 
        params.chargePersonId = params.chargePersonId_copy;
      }
      // 若是返显的仓库类型
      if (typeof(this.ruleForm.type) !== "number") { 
        params.type = params.type_copy;
      }
      axios.post("/warehouse/update", params).then((data) => {
        if (data.code !== 0) return
        this.$message.success("更新仓库信息成功");
        this.$emit("backToListPage");
      })
    },

    getAddressList(type) {
      let params = {
        code: "0"
      }
      if (type === "city") {
        params.code = this.ruleForm.addrProvince.split(",")[1];
      } else if (type === "area") {
        params.code = this.ruleForm.addrCity.split(",")[1];
      }

      axios.get("/region_code/lowerLvl", {params}).then((data) => {
        if (data.code !== 0) return
        let d = data.data;
        d.forEach(element => {
          element.code = element.name + "," + element.code;
        });
        if (type === "province") {
          this.provinceList = d;
        } else if (type === "city") {
          this.cityList = d;
          this.ruleForm.addrCity = "";
          this.ruleForm.addrArea = "";
        } else {
          this.areaList = d;
          this.ruleForm.addrArea = "";
        }
      })
    }
  },
};
</script>
<style lang="less" scoped>
.addOrEditStore_wrap {
  .header {
    color: #666666;
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    padding-left: 20px;
    border: 1px solid #e4e4e4;
  }

  .formArea {
    // height: 1000px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: none;
    .ruleForm {
      width: fit-content;
      margin: 0 auto;
      padding: 50px 0;
      /deep/.el-form-item {
        width: fit-content;
        .el-form-item__content {
          width: fit-content;
          >.el-input,
          >.el-select,
          >.wrap {
            width: 240px;
            .province,
            .city,
            .area {
              width: 75px;
            }
          }
          .wrap {
            display: flex;
            justify-content: space-between;
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
        margin-left: 140px;
      }
    }
  }
}
</style>
