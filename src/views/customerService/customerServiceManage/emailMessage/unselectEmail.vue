<template>
  <section>
    <div class="pleaseSelectEmail" v-if="!opt.isSelectEmail&&opt.emailType!='newEmail'">
      <div class="el-icon-message"></div>
      <p>请选择邮件</p>
    </div>
  </section>
</template>
<script>
export default {
  name: "unselectEmail",
  props: {
    opt: {
      type:Object
    }
  }
};
</script>
<style lang="less" scoped>
.pleaseSelectEmail {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 14px;
  .el-icon-message {
    font-size: 40px;
  }
}
</style>