<template>
  <div class="dialogContent">
    <!-- 弹窗 - 新建一级部门 / 编辑部门-->
    <el-form v-if="dialogType === '1' || dialogType === '3'" :model="ruleForm1" ref="ruleForm" label-width="100px">
      <el-form-item label="部门名称" prop="deptName" required>
        <el-input v-model="ruleForm1.deptName" placeholder="请输入部门名称，不超过10个字" maxlength="10"></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹窗 - 新建部门 -->
    <el-form v-if="dialogType === '2'" :model="ruleForm2" ref="ruleForm" label-width="100px">
      <el-form-item label="分组类型" prop="deptLevel" required>
        <el-select v-model="ruleForm2.deptLevel" placeholder="请选择新建分组所在层级">
          <el-option label="新建同级部门" value="sameLevel"></el-option>
          <el-option label="新建下级部门" value="childLevel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName" required>
        <el-input v-model="ruleForm2.deptName" placeholder="请输入部门名称，不超过10个字" maxlength="10"></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹窗 - 删除部门 -->
    <div v-if="dialogType === '4'">确定要删除{{deptName}}吗？</div>
    <!-- 弹窗 - 批量修改部门 -->
    <el-form v-if="dialogType === '5'" :model="ruleForm3" ref="ruleForm" label-width="100px">
      <el-form-item label="选择部门" prop="deptList" required>
        <el-transfer v-model="ruleForm3.deptList" :data="dptList"></el-transfer>
      </el-form-item>
    </el-form>
    <!-- 弹窗 - 批量修改角色 -->
    <el-form v-if="dialogType === '6'" :model="ruleForm4" ref="ruleForm" label-width="100px">
      <el-alert title="更改角色会将用户强制登出系统，请谨慎操作" type="warning" show-icon></el-alert>
      <el-form-item label="选择角色" prop="roleName" required>
        <el-select v-model="ruleForm4.roleName" placeholder="请选择角色">
          <el-option
            v-for="item in roleNameList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 弹窗 - 表格内删除用户 -->
    <div v-if="dialogType === '7'">确定要删除此用户吗？</div>
  </div>
</template>
<script>
export default {
  props: {
    dialogType: {
      type: String,
      required: true
    },
    deptName: {
      type: String,
      default: "该部门"
    },
    dptList: {
      type: Array,
      default: () => {
        return []
      }
    },
    roleNameList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      ruleForm1: {
        deptName: ""
      },

      ruleForm2: {
        deptLevel: "",
        deptName: ""
      },

      ruleForm3: {
        deptList: []
      },

      ruleForm4: {
        roleName: ""
      }
    }
  },
  methods: {
    submitForm() {
      let type = this.dialogType;
      if (type === '1' || type === '2' || type === '3' || type === '5' || type === '6') {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.$emit("submitForm", type);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      } else {
        this.$emit("submitForm", type);
      }
    }
  },
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
.el-form-item__content .el-transfer {
  /deep/.el-checkbox:first-of-type {
    .el-checkbox__label {
      margin-bottom: -15px;
    }
  }
}
</style>