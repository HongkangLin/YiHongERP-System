<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="indexPage_wrap">
      <div class="main">
        <!-- 快捷入口 -->
        <div class="fastEntries">
          <div class="secHeader">代办事项</div>
          <div class="secBody">
            <div class="info">敬请期待</div>
          </div>
        </div>
        <div class="towcol">
          <div class="fastEntries prd">
            <div class="secHeader">产品总览</div>
            <div class="secBody">
              <div class="info">敬请期待</div>
            </div>
          </div>
          <div class="fastEntries store">
            <div class="secHeader">库存总览</div>
            <div class="secBody">
              <div class="info">敬请期待</div>
            </div>
          </div>
        </div>
        <div class="fastEntries">
          <div class="secHeader">运营快捷入库</div>
          <div class="secBody">
            <div class="info">敬请期待</div>
          </div>
        </div>
        <div class="fastEntries">
          <div class="secHeader">采购单统计</div>
          <div class="secBody">
            <div class="info">敬请期待</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crumbList: [{ // 面包屑
        name: '首页',
        path: '/F0901/F090101'
      }, {
        name: '系统首页',
        path: ''
      }]
    }
  },
};
</script>
<style lang="less" scoped>
.indexPage_wrap {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  .main {
    background-color: #f9f9f9;
    padding: 20px 50px;
    font-size: 14px;
    .towcol {
      overflow: hidden;
      .prd {
        float: left;
        width: 49%;
      }
      .store {
        float: right;
        width: 49%;
      }
    }
    .fastEntries {
      border: 1px solid #e4e4e4;
      margin-bottom: 20px;
      .secHeader {
        background-color: #f3f3f3;
        font-weight: bold;
        color: #666;
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
  .info {
    font-size: 40px;
    color: #ccc;
    text-align: center;
    line-height: 150px;
  }
}
</style>
