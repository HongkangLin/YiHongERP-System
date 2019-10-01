<template>
  <div class="crumbsDiv">
    <div class="crumbs" v-if="showCrumbs">
      <span class="label"></span>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item @click="goLink(idx)" v-for="(item, idx) in list" :key="idx" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="return" v-if="showReturn" @click="goBack"><i class="el-icon-arrow-left"></i>返回</div>
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
    goBack: {
      type: Function,
      default: () => {
        history.go(-1);
      }
    }
  },
  methods: {
    goLink (idx) {
      this.$router.push(this.list[idx].path);
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
      .label {
        display: inline-block;
        vertical-align: middle;
        width: 4px;
        height: 17px;
        margin-right: 5px;
        background-color: #1ABC9C;
      }
      > div {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      /deep/.el-breadcrumb {
        .el-breadcrumb__item:last-child .el-breadcrumb__inner {
          color: #1ABC9C;
        }
      }
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
  }
</style>