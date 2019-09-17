<template>
  <el-container class="index_wrap">
    <!-- 顶部一级菜单 -->
    <el-header>
      <div class="systemName"><a href="/">毅宏ERP管理系统</a></div>
      <div class="iconPanel">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <span class="userName">Admin</span>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-switch-button"></i>
      </div>
    </el-header>
    <el-container class="navAndMain">
      <!-- 左侧二级菜单 -->
      <el-aside>
        <el-menu default-active="F0101-F010101" class="classTwoMenu" :collapse="true" background-color="#474c5a">
          <el-submenu index="F0101">
            <template slot="title">
              <i class="classTwoMenuName el-icon-menu">导航一</i>
            </template>
            <el-menu-item-group>
              <span slot="title">分组名</span>
              <el-menu-item index="F0101-F010101">•选项1</el-menu-item>
              <el-menu-item index="F0101-F010102">•选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="F0201">
            <template slot="title">
              <i class="classTwoMenuName el-icon-menu">导航二</i>
            </template>
            <el-menu-item-group>
              <span slot="title">分组名</span>
              <el-menu-item index="F0201-F020101">•选项1</el-menu-item>
              <el-menu-item index="F0201-F020102">•选项2</el-menu-item>
              <el-menu-item index="F0201-F020102">•选项3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
		  <router-view class="mainView"></router-view>
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
    height: 50px !important;
    background-color: #68c0a7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .systemName > a{
      font-size: 18px;
      font-weight: bold;
      color: #fff;
    }
    .iconPanel {
      display: flex;
      align-items: center;
      color: #fff;
      .el-avatar {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
      .el-divider {
        background-color: #539a86;
        margin: 0 15px;
      }
      .userName {
        margin-left: 8px;
      }
      .el-icon-switch-button:hover {
        cursor: pointer;
      }
    }
  }
  // 左侧导航栏及内容区
  .navAndMain {
    height: calc(100vh - 60px);
    >.el-aside {
      width: 64px !important;
      height: 100%;
      .classTwoMenu {
        height: 100%;
        /deep/.el-submenu__title {
          padding: 0 !important;
          .classTwoMenuName {
            color: #fff;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            line-height: 20px;
            &::before {
              font-size: 18px;
            }
          }
        }
        
      }
    }

    // router-view区域
    .mainView {
      width: calc(100vw - 64px);
      height: calc(100vh - 60px);
      overflow: auto;
      font-size: 14px;
    }
  }
}
</style>
<style lang="less">
.el-menu--vertical {
  .el-menu.el-menu--popup {
    padding: 0;
    margin-left: 0;
    background-color: #eaedf1!important;
    .el-menu-item-group {
      .el-menu-item-group__title {
        height: 50px;
        font-size: 14px;
        line-height: 50px;
        padding: 0 0 0 20px;
        background-color: #f2f2f2!important;
      }
      .el-menu-item {
        background-color: #eaedf1!important;
      }
    }
  }
}
</style>


