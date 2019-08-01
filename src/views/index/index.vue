<template>
  <el-container class="index_wrap">
    <!-- 顶部一级菜单 -->
    <el-header>
      <div class="logo"></div>
      <el-menu default-active="1" class="el-menu" mode="horizontal" background-color="#65c87a" text-color="#fff" active-text-color="#555c63" @select="handleSelect">
        <el-menu-item index="1">后台首页</el-menu-item>
        <el-menu-item index="2">产品管理</el-menu-item>
        <el-menu-item index="3">采购管理</el-menu-item>
      </el-menu>
      <div class="iconPanel">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <span class="userName">Admin</span>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-s-home"></i>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-message-solid"></i>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-switch-button"></i>
      </div>
    </el-header>
    <el-container>
      <!-- 左侧二级菜单 -->
      <el-aside width="60px"></el-aside>
      <!-- 主体区域 -->
		  <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
};
</script>

<style lang="less" scoped>
.index_wrap {
  // 顶部一级菜单
  .el-header {
    display: flex;
    padding: 0;
    .logo {
      width: 120px;
      height: 100%;
      background-color: #65c87a;
    }
    .el-menu {
      width: calc(100vw - 395px);
    }
    .iconPanel {
      width: 275px;
      display: flex;
      align-items: center;
      background-color: #65c87a;
      color: #fff;
      .el-divider {
        background-color: #51a062;
        margin: 0 15px;
      }
      .el-icon-s-home,
      .el-icon-message-solid,
      .el-icon-switch-button {
        font-size: 22px;
      }
      .userName {
        margin-left: 8px;
      }
        
    }
  }
  
}
</style>

