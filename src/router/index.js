import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
	path: '/',
	name: 'index',
	component: () => import(/* webpackChunkName: "index" */ '../views/index/index.vue'),
	redirect: '/F0201/F020101',
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
		path: '/addPdt', //产品管理-产品管理-产品列表
		name: 'addPdt',
		component: () => import(/* webpackChunkName: "addPdt" */ '../views/pdtManagement/addPdt.vue'),
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
	}, {
		path: '/F0302/F030201', //采购-供应商管理-供应商管理
		name: 'supplierManagement',
		component: () => import(/* webpackChunkName: "supplierManagement" */ '../views/purchaseManagement/supplierManagement.vue'),
	}, {
		path: '/addSupplier', //采购-供应商管理-供应商管理-新增供应商
		name: 'addSupplier',
		component: () => import(/* webpackChunkName: "addSupplier" */ '../views/purchaseManagement/addSupplier.vue'),
	}, {
		path: '/supplierDetail/:id', //采购-供应商管理-供应商管理-供应商信息
		name: 'supplierDetail',
		component: () => import(/* webpackChunkName: "supplierDetail" */ '../views/purchaseManagement/supplierDetail.vue'),
	}, {
		path: '/supplierPdt/:id', //采购-供应商管理-供应商管理-供应中产品
		name: 'supplierPdt',
		component: () => import(/* webpackChunkName: "supplierPdt" */ '../views/purchaseManagement/supplierPdt.vue'),
	}, {
		path: '/F0302/F030202', //采购-供应商管理-结算方式
		name: 'settleStyle',
		component: () => import(/* webpackChunkName: "settleStyle" */ '../views/purchaseManagement/settleStyle.vue'),
	}, {
		path: '/addSettle', //采购-供应商管理-结算方式-新增结算方式
		name: 'addSettle',
		component: () => import(/* webpackChunkName: "addSettle" */ '../views/purchaseManagement/addSettle.vue'),
	}, {
		path: '/F0401/F040104', //库存管理 > 仓库设置 
		name: 'storeSetting',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/storeManagement/storeSetting/storeSetting.vue'),
	}, {
		path: '/F0401/F040104/:storeId', //库存管理 > 仓库设置 > 仓库详情
		name: 'storeInfo',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/storeManagement/storeSetting/storeInfo.vue'),
	}, {
		path: '/F0401/F040101', //库存管理 > 库存清单
		name: 'inventoryList',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/storeManagement/inventoryList/index.vue'),
	}, {
		path: '/F0401/F040102', //库存管理 > 入库管理
		name: 'inStoreManagement',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/storeManagement/inStoreManagement/index.vue'),
	}, {
		path: '/F0401/F040102/:inId', //库存管理 > 入库管理 > 入库单
		name: 'inStoreView',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/storeManagement/inStoreManagement/viewStore.vue'),
	}]
}, {
	path: '/login', //登录页
	name: 'login',
	component: () => import(/* webpackChunkName: "login" */ '../views/index/login.vue'),
}]

export default new VueRouter({
	routes
})