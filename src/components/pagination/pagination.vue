/**
* @Description: 分页组件
* 必传参数: total(记录总数), pageNum(页码)
*/
<template>
  <div class="pagination_wrap">
    <div class="total">
      <span>共<i>{{pagetotal}}</i>页/</span>
      <span><i>{{total}}</i>条数据</span>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      layout="sizes, prev, pager, next, jumper"
      small
      background
      class="pagination">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [5, 10, 20 ,30, 50]
      }
    }
  },
  computed: {
    pagetotal() {
      return Math.ceil(this.total/this.pageSize);
    }
  },
  methods: {
    // 改变pageSize
    handleSizeChange(size) {
      this.$emit("changePageSize", size);
    },

    // 改变pageNum
    handleCurrentChange(num) {
      this.$emit("changePageNum", num);
    }
  },
}
</script>
<style lang="less" scoped>
.pagination_wrap {
  font-size: 14px;
  height: 50px;
  display: flex;
  align-items: center;
  .total {
    margin-left: 50px;
    >span>i {
      font-size: 12px;
      color: #65c87a;
    }
  }
  .pagination {}
}
</style>

