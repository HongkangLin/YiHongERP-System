<template>
  <el-cascader placeholder="请选择模板" :props="prop" :options="options" @change="handleChange" :show-all-levels="false"></el-cascader>
</template>  


<script>
import { jsonMerge } from "@/lib/utils/common";
export default {
  data() {
    return {
      prop: {
        expandTrigger: "hover"
      },
      options: [],
      backupData: {},
      // isResouceShow:0
    };
  },
  mounted() {
    this.queryList();
  },
  methods: {
    async queryList() {
      // 查询模板列表
      let data = {
        pageSize: 9999,
        pageNum: 1
      };
      this.API.selectEmailTemplateInfoList(data).then(res => {
        if (res.code === 0) {
          this.backupData = [...res.data];
          res.data.forEach(item => {
            (item.label = item.templateName), (item.value = item.id);
          });
          let arr = jsonMerge(res.data, [
            "complaintLevelOneId",
            "complaintLevelTwoId"
          ]);
          arr.forEach(item => {
            res.data.forEach(list => {
              if (item.complaintLevelOneId == list.complaintLevelOneId) {
                item.label = list.complaintLevelOneName;
                item.value = list.complaintLevelOneId;
                if (item.children && item.children.length) {
                  item.children.forEach(l => {
                    if (l.complaintLevelTwoId == list.complaintLevelTwoId) {
                      l.label = list.complaintLevelTwoName;
                      l.value = list.complaintLevelTwoId;
                    }
                  });
                }
              }
            });
          });
          this.options.push(...arr);
        //   console.log(this.options);
        }
      });
    },
    handleChange(val) {
      let complaintLevelOneId = val[0];
      let complaintLevelTwoId = val[1] || "";
      this.backupData.forEach(item => {
        if (
          val[0] == item.complaintLevelOneId &&
          val[1] == item.complaintLevelTwoId &&
          val[2] == item.id
        ) {
          let data = {
            complaintLevelOneId: item.complaintLevelOneId,
            complaintLevelTwoId: item.complaintLevelTwoId,
            id: item.id,
            templateContent: item.templateContent
          };
          this.$emit("handleChange", data);
          // ++this.isResouceShow;
          // console.log(this.isResouceShow)
        }
      });
    },
  }
};
</script>