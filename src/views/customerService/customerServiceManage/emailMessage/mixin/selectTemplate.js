export default {
    data() {
        return {
            options: [],
        }
    },
    created() {
        this.queryList()
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
                    res.data.forEach(item => {
                        item.label = item.complaintLevelOneName;
                        item.value = item.complaintLevelOneId;
                        item.children = [];
                        item.children.push({
                            label: item.complaintLevelTwoName,
                            value: item.complaintLevelTwoId
                        });
                        item.children.forEach(list => {
                            list.children = [];
                            list.children.push({
                                label: item.templateName,
                                value: item.id
                            });
                        });
                    });
                    this.options.push(...res.data); // 初始化新增分类页面可选分类
                }
            });
        }
    }
}