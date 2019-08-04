<template>
  <div class="userMgmt_wrap">
		
    <Pagination :total="100" :pageNum="1"></Pagination>
	</div>
</template>

<script>
import Pagination from '../../components/pagination/pagination';
export default {
  data() {
    return {
      
    }
  },
  components: {
    Pagination
  }
};
</script>
<style lang="less" scoped>

</style>
