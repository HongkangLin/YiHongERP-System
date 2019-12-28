<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="dataTable">
      <div v-for="(item, idx) in data" :key="idx" class="subTab">
        <div class="title">{{item.name}}</div>
        <div class="content">
          <div v-for="(cnt, index) in item.children" :key="index" class="item" @click="goTable(cnt.id)">
            <div class="label"><i class="el-icon-date"></i></div>
            <div class="other">
              <div class="name">{{cnt.name}}</div>
              <div class="desc">{{cnt.desc}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060101'
      }, {
        name: '数据报表',
        path: ''
      }],
      data: [
        {
          name: '产品报表',
          children: [
            {
              id: 1,
              name: '产品信息报表',
              desc: '所有产品信息的汇总信息'
            }
          ]
        }, {
          name: '供应商报表',
          children: [
            {
              id: 2,
              name: '供应商信息报表',
              desc: '所有供应商信息的汇总'
            }, {
              id: 3,
              name: '供应商供货产品报表',
              desc: '所有供应商供货产品的数据，按月'
            }, {
              id: 4,
              name: '采购价报表',
              desc: '所有SKU的采购报价报表'
            }, {
              id: 5,
              name: '供应商业绩报表',
              desc: '所有供应商业绩的汇总，按月'
            }
          ]
        }, {
          name: '库存报表',
          children: [
            {
              id: 6,
              name: '入库报表',
              desc: '所有入库数据的汇总'
            }, {
              id: 7,
              name: '出库报表',
              desc: '所有出库数据的汇总'
            }, {
              id: 8,
              name: '仓库库存盘点报表',
              desc: '所有产品库存数据的汇总'
            }, {
              id: 9,
              name: '库存结存采购报表',
              desc: '所有库存结存的采购数据汇总'
            }
          ]
        }, {
          name: '财务报表',
          children: [
            {
              id: 10,
              name: '财务付款报表',
              desc: '所有财务应付数据汇总'
            }, {
              id: 11,
              name: '入库货款总金额报表',
              desc: '所有入库货款数据汇总'
            }
          ]
        }
      ]
    };
  },
  methods: {
    goTable (id) { // 跳转table
      switch (id) {
        case 1: // 产品信息报表
          this.$router.push('/F0601/F060101/pdtTable');
          break;
        case 2: // 供应商信息报表
          this.$router.push('/F0601/F060101/supplierTable');
          break;
        case 3: // 供应商供货产品报表
          break;
        case 4: // 采购价报表
          this.$router.push('/F0601/F060101/purchaseTable');
          break;
        case 5: // 供应商业绩报表
          this.$router.push('/F0601/F060101/achievementTable');
          break;
        case 6: // 入库报表
          this.$router.push('/F0601/F060101/inStoreTable');
          break;
        case 7: // 出库报表
          break;
        case 8: // 仓库库存盘点报表
          break;
        case 9: // 库存结存采购报表
          break;
        case 10: // 财务付款报表
          this.$router.push('/F0601/F060101/financeTable');
          break;
        case 11: // 入库货款总金额报表
          this.$router.push('/F0601/F060101/moneyTable');
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dataTable {
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  .subTab {
    border: 1px solid rgba(228, 228, 228, 1);
    margin-bottom: 20px;
    .title {
      height: 45px;
      background-color: #f2f2f2;
      font-size: 14px;
      line-height: 45px;
      text-indent: 20px;
      border-bottom: 1px solid rgba(228, 228, 228, 1);
    }
    .content {
      background-color: white;
      overflow: hidden;
      padding: 20px 0 0 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .item {
        width: 30%;
        height: 70px;
        margin-bottom: 20px;
        background-color: rgba(242, 242, 242, 1);
        display: flex;
        margin-right: 3.3%;
        cursor: pointer;
        padding-left: 10px;
        .label {
          width: 45px;
          text-align: center;
          line-height: 85px;
          /deep/.el-icon-date {
            font-size: 36px;
          }
        }
        .other {
          .name {
            display: inline-block;
            font-weight: bold;
            color: #1ABC9C;
            font-size: 16px;
            margin-top: 17px;
            vertical-align: bottom;
          }
          .desc {
            font-size: 14px;
            margin-top: 4px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>