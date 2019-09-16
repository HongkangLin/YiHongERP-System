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
        <el-select v-model="ruleForm1.deptName" placeholder="请选择新建分组所在层级">
          <el-option label="新建同级部门" value="sameLevel"></el-option>
          <el-option label="新建下级部门" value="childLevel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName" required>
        <el-input v-model="ruleForm1.deptName" placeholder="请输入部门名称，不超过10个字" maxlength="10"></el-input>
      </el-form-item>
    </el-form>
    <!-- 弹窗 - 删除部门 -->
    <div v-if="dialogType === '4'">确定要删除采购一部吗？</div>
    <!-- 弹窗 - 批量修改部门 -->

    <!-- 弹窗 - 批量修改角色 -->

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
      }
    }
  },
  created() {
    
  },
  methods: {
    
  },
}
</script>
<style lang="less" scoped>

</style>