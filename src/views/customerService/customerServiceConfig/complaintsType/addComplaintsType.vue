<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addType">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="base">
          <el-form ref="formData" :model="formData" :rules="rules" label-width="110px">
            <el-form-item label="分类名称：" prop="emailCategoryName">
              <el-input maxlength="100" v-model="formData.emailCategoryName" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="上级分类：">
              <el-select filterable class="selList" :disabled="disable" v-model="formData.parentId" placeholder="请选择分类">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="desc">不选择上级分类默认为顶级分类</div>
            </el-form-item>
            <el-form-item label="排序：" prop="goodsBrandPicUrl">
              <el-input min="0" type="number" @blur="() => {if (this.formData.emailCategorySortId < 0) {this.formData.emailCategorySortId = 0} else if (this.formData.emailCategorySortId > 999) {this.formData.emailCategorySortId = 999}}" v-model="formData.emailCategorySortId" placeholder="请输入分类排序"></el-input>
            </el-form-item>
            <el-form-item label="分类描述：">
              <el-input type="textarea" maxlength="100" :rows="12" v-model="formData.emailCategoryDescribe" placeholder="请输入内容"></el-input>
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
        name: '产品管理',
        path: '/F1002/F100205'
      }, {
        name: '投诉分类',
        path: '/F1002/F100205'
      }],
      title: '新增分类',
      typeOptions: [{
        label: '顶级',
        value: 0
      }],
      formData: { // 基本信息
        emailCategoryName: '',
        parentId: '',
        emailCategoryLevel: 0,
        emailCategorySortId: '',
        emailCategoryDescribe: ''
      },
      rules: {
        emailCategoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      id: '',
      flag: false,
      disable: false
    };
  },
  mounted () {
    let query = this.$route.query;
    this.typeOptions = [{
      label: '顶级',
      value: 0
    }, ...query.list];
    this.id = query.id;
    if (!this.id) { // 新增
      this.title = '新增分类';
      this.crumbList.push({
        name: '添加分类',
        path: ''
      });
    } else { // 编辑
      let data = query.data;
      this.disable = true;
      if (data.emailCategoryName) { // 存在名称时表示当前处于编辑状态
        this.flag = true;
        this.title = '编辑分类';
        this.formData = data;
        this.crumbList.push({
          name: '编辑分类',
          path: ''
        });
      } else { // 否则为新增下级状态
        this.title = '新增下级';
        this.crumbList.push({
          name: '新增下级',
          path: ''
        });
        this.formData.parentId = this.id;
      }
    }
  },
  methods: {
    submit (formName) { // 提交
      this.$refs[formName].validate((valid) => { // 提交
        if (valid) {
          let type = this.flag ? 'updateCategory' : 'addCategory'; // 存在id时表示是修改
          let buf = JSON.parse(JSON.stringify(this.formData));
          if (!buf.parentId) {
            buf.parentId = 0; // 未选择分类时设置为顶级分类
            buf.emailCategoryLevel = 0; // 设置一级类目
          } else {
            buf.emailCategoryLevel = 1; // 设置二级类目
          }
          if (!buf.emailCategorySortId) {
            buf.emailCategorySortId = 255; // 排序id为设置时默认255
          }
          let param = this.flag ? {
            id: this.id,
            ...buf
          } : {
            ...buf
          }
          this.API[type](param).then(data => {
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
    height: calc(100% - 50px);
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
      background-color:  @themeColor;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>