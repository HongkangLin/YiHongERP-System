<template>
  <div class="indexPage_wrap">
		<div class="pageTitle">
      <span class="titleIcon"></span>
      <span class="title">系统首页</span>
    </div>
    <div class="main">
      <!-- 快捷入口 -->
      <div class="fastEntries">
        <div class="secHeader">快捷入口</div>
        <div class="secBody"></div>
      </div>
    </div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
};
</script>
<style lang="less" scoped>
.indexPage_wrap {
  width: 100%;
  .pageTitle {
    height: 46px;
    background-color: #f3f3f3;
    display: flex;
    align-items: center;
    .titleIcon {
      background-color: #65c87a;
      width: 6px;
      height: 16px;
      margin-right: 6px;
    }
    .title {
      color: #a0a0a0;
    }
  }
  .main {
    background-color: #f9f9f9;
    padding: 16px;
    font-size: 14px;
    height: calc(100% - 46px);
    .fastEntries {
      border: 1px solid #e4e4e4;
      .secHeader {
        background-color: #f3f3f3;
        height: 42px;
        line-height: 42px;
        padding-left: 20px;
        border-bottom: 1px solid #e4e4e4;
      }
      .secBody {
        background-color: #fff;
        height: 150px;
      }
    }
  }
}
</style>
