import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
	path: '/',
	name: 'index',
	component: () => import(/* webpackChunkName: "index" */ '../views/index/index.vue'),
	redirect: '/F0101/F010101',
	children: [{
		path: '/F0101/F010101', //系统管理-权限-用户管理
		name: 'userMgmt',
		component: () => import(/* webpackChunkName: "userMgmt" */ '../views/systemManagement/userMgmt.vue'),
	}, {
		path: '/F0101/F010102', //系统管理-权限-用户角色管理
		name: 'userRoleMgmt',
		component: () => import(/* webpackChunkName: "userRoleMgmt" */ '../views/systemManagement/userRoleMgmt.vue'),
	}, {
		path: '/addRole', //系统管理-权限-用户角色管理-新增角色
		name: 'addRole',
		component: () => import(/* webpackChunkName: "addRole" */ '../views/systemManagement/addRole.vue'),
	}, {
		path: '/F0201/F020101', //产品管理-产品管理-产品列表
		name: 'pdtList',
		component: () => import(/* webpackChunkName: "pdtList" */ '../views/pdtManagement/pdtList.vue'),
	}, {
		path: '/F0201/F020102', //产品管理-产品管理-产品分类
		name: 'pdtType',
		component: () => import(/* webpackChunkName: "pdtType" */ '../views/pdtManagement/pdtType.vue'),
	}, {
		path: '/addType', //产品管理-产品管理-产品分类-新增分类
		name: 'addType',
		component: () => import(/* webpackChunkName: "addType" */ '../views/pdtManagement/addType.vue'),
	}, {
		path: '/F0201/F020103', //产品管理-产品管理-品牌管理
		name: 'brandManagement',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/pdtManagement/brandManagement.vue'),
	}, {
		path: '/addBrand', //产品管理-产品管理-品牌管理-新增品牌
		name: 'addBrand',
		component: () => import(/* webpackChunkName: "addBrand" */ '../views/pdtManagement/addBrand.vue'),
	}]
}, {
	path: '/login', //登录页
	name: 'login',
	component: () => import(/* webpackChunkName: "login" */ '../views/index/login.vue'),
}]

export default new VueRouter({
	routes
})