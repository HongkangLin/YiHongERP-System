<template>
  <div>
    <crumbs :list="crumbList" :showReturn="false"></crumbs>
    <div class="dataDownload">
      <div class="search">
        <div class="head">
          <div class="label"><i class="el-icon-s-unfold"></i>离线报表下载</div>
        </div>
      </div>
      <div class="table">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="createTime"
            label="日期"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fileName"
            label="报表名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="fileLength"
            label="大小"
            align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :disabled="scope.row.status !== '完成'"
                @click="handleDown(scope.row.url)">下载</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                :disabled="!scope.row.searchContent"
                @click="handleLook(scope.row.searchContent)">筛选条件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="splitPage"><pageination :pageNum="pageNum" :total="total" :pageSize="pageSize" @changePageSize="changePageSize" @changePageNum="changeNum"></pageination></div>
    </div>
    <!-- 筛选条件 -->
    <el-dialog title="筛选条件" :visible.sync="ruleVisible" width="70%">
      <div v-html="str"></div>
    </el-dialog>
  </div>
</template>

<script>
import pageination from '#/pagination/pagination.vue';
export default {
  components: {
    'pageination': pageination
  },
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '数据',
        path: '/F0601/F060102'
      }, {
        name: '下载中心',
        path: ''
      }],
      ruleVisible: false, // 筛选条件
      str: '', // 内容
      total: 0, // 总数
      pageNum: 1, // pageNumber
      pageSize: 10, // pageSize
      tableData: [] // 表格数据
    };
  },
  mounted () {
    this.queryList();
  },
  methods: {
    async queryList () { // 获取下载列表
      let data = await window.axios.post('/reportRecord/queryReportRecordList', {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      data = data.data;
      this.total = data.total;
      this.tableData = data.list;
    },
    handleDown (url) { // 下载
      window.open(url);
    },
    handleLook (content) { // 筛选条件
      let str = '<table style="width: 100%;">', cnt = JSON.parse(content), i = 0;
      for (let item in cnt) {
        if (!(i % 2)) {
          str += '<tr style="line-height: 60px;">';
        }
        str += `<td style="background-color: #f2f2f2;vertical-align: middle;color: #666;width: 25%;padding-left:5px;border: 1px solid rgb(228, 228, 228);">${item}</td><td style="width: 25%;vertical-align: middle;padding-left:5px;border: 1px solid rgb(228, 228, 228);">${cnt[item]}</td>`;
        if (i % 2) {
          str += '</tr>';
        }
        i++;
      }
      if (i % 2) {
        str += '<td style="border: 1px solid rgb(228, 228, 228);">&nbsp;</td><td style="border: 1px solid rgb(228, 228, 228);">&nbsp;</td></tr>';
      }
      str += '</table>';
      this.str = str;
      this.ruleVisible = true;
    },
    search () { // 查询按钮
      this.pageNum = 1;
      this.queryList();
    },
    changeNum (num) { // 改变页码
      this.pageNum = num;
      this.queryList();
    },
    changePageSize (size) { // 改变每页条数
      this.pageNum = 1;
      this.pageSize = size;
      this.queryList();
    },
    exp () { // 导出报表
      window.axios.post('/report/financePayReport', {
        supplierId: this.supplier || -1,
        payTimeStart: this.createTimeRange ? this.createTimeRange[0] : '',
        payTimeEnd: this.createTimeRange ? this.createTimeRange[1] : '',
        searchContent: ''
      });
      this.$router.push('/F0601/F060102');
    }
  }
}
</script>

<style lang="less" scoped>
.dataDownload {
  box-sizing: border-box;
  padding: 20px 50px;
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
  font-size: 12px;
  .search {
    width: 100%;
    .head {
      display: flex;
      justify-content: space-between;
      height: 50px;
      background-color: #f3f3f3;
      box-sizing: border-box;
      padding: 9px 20px;
      /deep/.el-icon-s-unfold {
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
        font-size: 16px;
      }
      div {
        display: inline-block;
        line-height: 32px;
        &.label{
          color: #666;
        }
        &.new {
          font-size: 14px;
          background-color: #1ABC9C;
          color: white;
          width: 100px;
          cursor: pointer;
          text-align: center;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>