<template>
  <div>
    <crumbs :list="crumbList"></crumbs>
    <div class="addRole">
      <div class="title">{{title}}</div>
      <div class="content">
        <div class="label">基础信息</div>
        <div class="base">
          <el-form ref="formData" :model="formData" label-width="110px">
            <el-form-item label="角色类型：">
              <el-radio v-model="formData.roleType" v-if="formData.roleType === '1'" label="1">超级管理员</el-radio>
              <el-radio v-model="formData.roleType" v-if="formData.roleType !== '1'" label="2">管理员</el-radio><span class="info">管理员可对员工提的审核内容进行审批</span><br>
              <el-radio v-model="formData.roleType" v-if="formData.roleType !== '1'" label="3">员工</el-radio>
            </el-form-item>
            <el-form-item label="角色名：" maxlength="100" prop="roleName" :rules="{ required: true, message: '角色名不能为空', trigger: 'blur'}">
              <el-input v-model="formData.roleName" placeholder="请输入角色名"></el-input>
            </el-form-item>
            <el-form-item label="角色描述：">
              <el-input type="textarea" maxlength="100" :rows="7" v-model="formData.roleDesc" placeholder="请输入角色描述"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="label">权限配置</div>
        <div class="roleConfig">
          <div class="selArea">
            <div class="selTitle"><el-checkbox v-model="checkAll" @change="selAll" key="main">选择全部</el-checkbox></div>
          </div>
          <div class="selArea" v-for="(items, idx) in roleList" :key="'list' + idx">
            <div class="selTitle"><el-checkbox :disabled="items.disable" v-model="items.check" @change="selArr(idx)">{{items.menuName}}</el-checkbox></div>
            <div class="selContent">
              <div v-for="(item, index) in items.funcList" :key="'item' + index">
                <el-checkbox :disabled="item.disable" v-model="item.check" @change="selSome(idx, index)">{{item.funcName.replace(items.menuName + '-', '')}}</el-checkbox>
              </div>
              <div v-for="(empty, i) in (6 - items.funcList.length % 6)" :key="'empty' + i"></div>
            </div>
          </div>
        </div>
        <div class="submit" @click="submit('formData')">提交</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      crumbList: [{ // 面包屑
        name: '权限管理',
        path: '/F0101/F010102'
      }, {
        name: '角色权限管理',
        path: '/F0101/F010102'
      }],
      title: '新增角色',
      formData: { // 基本信息
        roleType: '2',
        roleName: '',
        roleDesc: ''
      },
      id: '',
      roleList: [],
      checkAll: false // 全选
    };
  },
  mounted () {
    this.id = this.$route.query.id;
    if (!this.id) { // 新增
      this.title = '新增角色';
      this.crumbList.push({
        name: '新增角色',
        path: ''
      });
      this.queryList();
    } else { // 编辑
      this.title = '编辑角色';
      this.crumbList.push({
        name: '编辑角色',
        path: ''
      });
      this.queryListByRole();
    }
  },
  methods: {
    async queryList () { // 新增权限查询
      let data = await window.axios.get('/func/queryAllFuncList');
      this.roleList = data.data;
    },
    async queryListByRole () { // 编辑权限查询
      let data = await window.axios.get(`/func/queryFuncListByRoleId/${this.id}`);
      data = data.data;
      this.formData = {
        roleType: data.roleType + '',
        roleName: data.roleName,
        roleDesc: data.roleDesc
      };
      let all = 0;
      data.menuFuncList.forEach(item => {
        if (data.roleType === 1 && item.menuId === 4) { // 超级管理员不允许编辑角色权限管理模块
          item.disable = true;
        }
        let curr = 0, pos = 0;
        item.funcList.forEach((key, idx) => {
          if (key.funcName.split('-')[1] === '查看') { // 找到查看位置
            pos = idx;
          }
          if (data.roleType === 1 && item.menuId === 4) { // 超级管理员不允许编辑角色权限管理模块
            key.disable = true;
          }
          if (key.ownFlag) {
            curr++;
          }
          key.check = !!key.ownFlag;
        });
        if (curr > 1) { // 有其他项目选择时查看不可操作
          item.funcList[pos].disable = true;
        }
        if (curr === item.funcList.length) {
          item.check = true;
          all++;
        } else {
          item.check = false;
        }
      });
      this.roleList = data.menuFuncList;
      this.checkAll = all === this.roleList.length;
    },
    selAll () { // 全选
      this.roleList.forEach(item => {
        if (!item.disable) { // 设置勾选时过滤掉不可操作模块
          this.$set(item, 'check', this.checkAll);
          item.funcList.forEach(key => {
            this.$set(key, 'check', this.checkAll);
            if (key.funcName.split('-')[1] === '查看') {
              this.$set(key, 'disable', this.checkAll);
            }
          });
        }
      });
    },
    selArr (idx) { // 选择某组
      let curr = this.roleList[idx].check;
      this.roleList[idx].funcList.forEach(item => {
        this.$set(item, 'check', curr);
        if (item.funcName.split('-')[1] === '查看') {
          this.$set(item, 'disable', curr);
        }
      });
      let list = this.roleList.filter(item => item.check || item.disable); // 计算全选时将不可选和已选中认为已选择
      this.checkAll = list.length === this.roleList.length;
    },
    selSome (idx, index) { // 选择某个
      let funcList = this.roleList[idx].funcList;
      if (funcList[index].funcName.split('-')[1] !== '查看') { // 当前操作非查看
        let pos = 0;
        for (let i = 0, len = funcList.length; i < len; i++) {
          if (funcList[i].funcName.split('-')[1] === '查看') { // 查看勾选上
            pos = i;
            break;
          }
        }
        if (funcList[index].check) { // 选择时
          this.$set(funcList[pos], 'check', true);
          this.$set(funcList[pos], 'disable', true);
        } else { // 取消勾选且当前只有查看被选择时
          let arr = funcList.filter(item => item.check);
          if (arr.length === 1) {
            this.$set(funcList[pos], 'disable', false);
          }
        }
      }
      let list = funcList.filter(item => item.check);
      this.$set(this.roleList[idx], 'check', list.length === funcList.length);
      let slist = this.roleList.filter(item => item.check || item.disable);
      this.checkAll = slist.length === this.roleList.length;
    },
    submit (formName) { // 提交
      let menuWithFuncList = [];
      this.roleList.forEach(item => { // 整理权限列表
        let curr = {
          'menuId': item.menuId,
          'funcIds': []
        };
        item.funcList.forEach(key => {
          if (key.check) {
            curr.funcIds.push(key.funcId);
          }
        });
        if (curr.funcIds.length) {
          menuWithFuncList.push(curr);
        }
      });
      if (!menuWithFuncList.length) { // 检查权限列表是否为空
        this.$message({
          message: '请先给角色分配权限',
          type: 'warning'
        });
        return;
      }
      this.$refs[formName].validate((valid) => { // 提交
        if (valid) {
          let url = this.id ? '/role/updateRole' : '/role/addRole'; // 存在id时表示是修改
          let param = this.id ? {
            roleId: this.id,
            ...this.formData,
            menuWithFuncList: menuWithFuncList
          } : {
            ...this.formData,
            menuWithFuncList: menuWithFuncList
          }
          window.axios.post(url, param).then(data => {
            this.$message({
              message: data.message,
              type: 'success'
            });
            window.axios.get('/menu/menu').then(data => { // 更新store权限数据
              this.$store.commit('role/setMenu', data.data);
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
            });
            this.$router.back();
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.addRole {
  padding: 20px 50px;
  font-size: 12px;
  height: calc(100% - 50px);
  overflow: auto;
  .title {
    color: #666;
    background-color: #f3f3f3;
    height: 50px;
    line-height: 50px;
    border: 1px solid rgb(228, 228, 228);
    text-indent: 20px;
  }
  .content {
    border: 1px solid rgb(228, 228, 228);
    border-top: none;
    overflow: hidden;
    .label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.847);
      text-indent: 30px;
      line-height: 80px;
      font-weight: bold;
    }
    .base {
      box-sizing: border-box;
      margin: 0 100px;
      .el-input--small {
        width: 400px;
      }
      .el-radio {
        margin-right: 10px;
      }
      .info {
        color: #999;
      }
    }
    .roleConfig {
      box-sizing: border-box;
      margin: 0 30px;
      .selArea {
        margin-bottom: 10px;
        line-height: 50px;
        .selTitle {
          background-color: #f9fafc;
          padding: 0 20px;
          border: 1px solid rgb(228, 228, 228);
        }
        .selContent {
          display: flex;
          flex-wrap: wrap;
          border-right: 1px solid rgb(228, 228, 228);
          div {
            width: 16.66%;
            border-left: 1px solid rgb(228, 228, 228);
            border-bottom: 1px solid rgb(228, 228, 228);
            box-sizing: border-box;
            padding-left: 20px;
          }
        }
      }
    }
    .submit {
      float: right;
      cursor: pointer;
      width: 80px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background-color: #1ABC9C;
      margin-top: 20px;
      border-radius: 4px;
      color: white;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
}
</style>