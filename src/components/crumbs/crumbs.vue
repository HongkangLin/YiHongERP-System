<template>
  <div class="crumbsDiv">
    <div class="crumbs" v-if="showCrumbs">
      <span class="label"></span>
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click="goLink(idx)" v-for="(item, idx) in list" :key="idx" >{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb> -->
      <span class="crumbName" v-for="(item, index) in list" :key="index">
        <i class="name" @click="goLink(index)">{{item.name}}</i>
        <i v-if="index < list.length - 1" class="el-icon-arrow-right"></i>
      </span>
    </div>
    <div class="return" v-if="showReturn" @click="goBack"><i class="el-icon-arrow-left"></i>返回</div>
    <div class="refresh" v-if="showRefresh">
        <el-button class="el-icon-refresh" @click="refresh" title="刷新页面">刷新</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: 'crumbs'
    };
  },
  props: {
    list: { // 面包屑数据
      type: Array,
      default: () => {
        return [];
      }
    },
    showCrumbs: { // 是否显示面包屑
      type: Boolean,
      default: true
    },
    showReturn: { // 是否显示返回按钮
      type: Boolean,
      default: true
    },
    showRefresh: { // 是否显示刷新按钮
      type: Boolean,
      default: false
    },
    goBack: {
      type: Function,
      default: () => {
        history.go(-1);
      }
    },
    forceReload: { //是否需要刷新页面
      type: Boolean,
      default: false
    }
  },
  methods: {
    goLink (idx) {
      if (this.list[idx].path) {
        if (this.forceReload) this.goBack() // location.reload();
        this.$router.push(this.list[idx].path);
      }
    },
    refresh() {
      window.location.reload()
    }
  }
};
</script>

<style lang="less" scoped>
  .crumbsDiv {
    width: 100%;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(228, 228, 228);
    background-color: rgba(243, 243, 243, 1);
    display: flex;
    justify-content: space-between;
    .crumbs {
      margin-left: 50px;
      display: flex;
      align-items: center;
      .label {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 17px;
        margin-right: 5px;
        background-color: #1ABC9C;
      }
      .crumbName {
        color: #999999;
        &:last-of-type {
          color: #1ABC9C;
        }
        &:not(:last-of-type) {
          .name:hover {
            color: #1ABC9C;
            cursor: pointer;
          }
        }
        .el-icon-arrow-right {
          margin-right: 4px;
          margin-left: 2px;
        }

      }
      // > div {
      //   display: inline-block;
      //   vertical-align: middle;
      //   cursor: pointer;
      // }
      // /deep/.el-breadcrumb {
      //   .el-breadcrumb__inner {
      //     color: #999999;
      //     &:hover {
      //       color: #1ABC9C;
      //     }
      //   }
      //   .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      //     color: #1ABC9C;
      //   }
      // }
    }
    .return {
      margin: 10px 50px;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 70px;
      color: #999;
      cursor: pointer;
      border-radius: 4px;
      background-color: white;
      border: 1px solid rgb(228, 228, 228);
    }
    .refresh {
      margin-right: 50px;
    }
  }
</style>