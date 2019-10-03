<template>
  <el-container class="index_wrap">
    <!-- 顶部一级菜单 -->
    <el-header>
      <div class="systemName"><a href="/">毅宏ERP管理系统</a></div>
      <div class="iconPanel">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <span class="userName">Admin</span>
        <el-divider direction="vertical"></el-divider>
        <i @click="loginOut" class="el-icon-switch-button"></i>
      </div>
    </el-header>
    <el-container class="navAndMain">
      <!-- 左侧二级菜单 -->
      <el-aside>
        <el-menu default-active="F0101-F010101" class="classTwoMenu" :collapse="true" background-color="#474c5a">
          <el-submenu :index="item.menuPath" v-for="(item, index) in menuList" :key="index">
            <template slot="title">
              <i class="classTwoMenuName" :class="classList[item.menuName]">{{item.menuName}}</i>
            </template>
            <el-menu-item-group v-for="(key, idx) in item.childNodeList" :key="idx">
              <span slot="title">{{key.menuName}}</span>
              <el-menu-item @click="handleSelect('/' + key.menuPath + '/' + last.menuPath)" :index="key.menuPath + '-' + last.menuPath" v-for="(last, pos) in key.childNodeList" :key="pos">{{last.menuName}}</el-menu-item>
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
      classList: {
        '产品': 'el-icon-goods',
        '采购': 'el-icon-shopping-cart-2',
        '库存': 'el-icon-box',
        '财务': 'el-icon-s-data',
        '系统': 'el-icon-setting'
      },
      menuList: [] // 菜单列表
    }
  },
  mounted () {
    this.getMenu();
  },
  methods: {
    // 跳转到对应页面
    handleSelect(path) {
      this.$router.push(path);
    },
    // 获取菜单列表
    async getMenu () {
      let data = await window.axios.get('/menu/menu');
      this.menuList = data.data;
    },
    // 退出登陆
    loginOut () {
      localStorage.removeItem('token');
      this.$router.replace('/login');
    }
  },
};
</script>

<style lang="less" scoped>
.index_wrap {
  // 顶部一级菜单
  .el-header {
    height: 50px !important;
    background-color: #1ABC9C;
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
        background-color: #1ABC9C;
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
    height: calc(100vh - 50px);
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
      height: calc(100vh - 50px);
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


