<template>
  <el-container class="index_wrap">
    <!-- 顶部一级菜单 -->
    <el-header>
      <div class="systemName"><a href="/">毅弘ERP管理系统</a></div>
      <div class="iconPanel">
        <el-popover
          placement="bottom-start"
          width="360"
          trigger="click">
            <div class="userInfo">
              <div class="header">账户信息</div>
              <div class="span"></div>
              <div class="content"><span>·&nbsp;角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色：</span>{{roleName}}</div>
              <div class="content"><span>·&nbsp;联系方式：</span>{{mobile}}</div>
              <div class="content"><span>·&nbsp;电子邮箱：</span>{{email}}</div>
            </div>
            <div slot="reference" class="userInfoClick">
              <div v-if="avatarFilePath" style="width: 40px;height:40px">
                <img :src="avatarFilePath" style="width: 100%; height: 100%" alt="">
              </div>
              <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
              <span class="userName">{{userName}}</span>
            </div>
        </el-popover>
        <el-divider direction="vertical"></el-divider>
        <i @click="loginOut" class="el-icon-switch-button"></i>
      </div>
    </el-header>
    <el-container class="navAndMain">
      <!-- 左侧二级菜单 -->
      <el-aside>
        <el-menu :default-active="activeMenu" class="classTwoMenu" :collapse="true" background-color="#474c5a">
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
      <router-view v-if="menuList.length" class="mainView"></router-view>
      <el-dialog
        title="退出确认"
        :visible.sync="dialogVisible"
        width="30%">
        <span>确认要退出登陆吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="out">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      classList: {
        '首页': 'el-icon-s-home',
        '产品': 'el-icon-goods',
        '采购': 'el-icon-shopping-cart-2',
        '库存': 'el-icon-box',
        '财务': 'el-icon-data-line',
        '数据': 'el-icon-s-data',
        '物流': 'el-icon-truck',
        '审批': 'el-icon-s-check',
        '系统': 'el-icon-setting'
      },
      userName: localStorage.getItem('userName'),
      roleName: localStorage.getItem('roleName'),
      mobile: localStorage.getItem('mobile'),
      email: localStorage.getItem('email'),
      avatarFilePath: localStorage.getItem('avatarFilePath'),
      dialogVisible: false,
      activeMenu: 'F0901-F090101' // active菜单
    }
  },
  computed: {
    menuList () {
      return this.$store.state.role.menu;
    }
  },
  mounted () {
    this.getMenu();
    let param = this.$route.path.substring(1);
    this.activeMenu = param.replace(/\//g, '-');
  },
  watch: {
    "$route.path" (param) {
      param = param.substring(1);
      this.activeMenu = param.replace(/\//g, '-');
    }
  },
  methods: {
    goHome (number) {
      number === 1 ? this.$router.push('/F0901/F090101') : this.$router.push('/F0001/F000102');
    },
    // 跳转到对应页面
    handleSelect(path) {
      this.$router.push(path);
    },
    // 获取菜单列表
    async getMenu () {
      let data = await window.axios.get('/menu/menu');
      this.$store.commit('role/setMenu', data.data);
      this.roleCtl();
    },
    // 获取按键权限控制字段
    roleCtl() {
      let fn = (array, obj) => {
        for (let index = 0; index < array.length; index++) {
          let item = array[index];
          if (item.childNodeList && item.childNodeList.length > 0) item.childNodeList = fn(item.childNodeList, obj)
          item.funcList.map((i) => {
            obj[i.funcTag] = i.ownFlag ? true : false;
          })
        }
        return array;
      }
      let controlObj = {};
      fn(this.$store.state.role.menu, controlObj);
      this.$store.commit('role/getRoleCtl', controlObj);
    },

    // 退出登陆事件
    loginOut () {
      this.dialogVisible = true;
    },
    // 退出
    out () {
      localStorage.removeItem('token');
      this.$router.replace('/login');
    }
  },
};
</script>

<style lang="less" scoped>
.userInfo {
  font-size: 12px;
  box-sizing: border-box;
  padding: 0 10px;
  color: #666;
  .header {
    color: #999;
    line-height: 30px;
    text-indent: 10px;
  }
  .span {
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  .content {
    margin-top: 10px;
    line-height: 20px;
    span {
      text-indent: 10px;
      display: inline-block;
      margin-right: 4px;
      color: #999;
    }
  }
}
.userInfoClick {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
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
      cursor: pointer;
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
