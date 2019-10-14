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
		component: () => import(/* webpackChunkName: "userRoleMgmt" */ '../views/systemManagement/role/userRoleMgmt.vue'),
	}, {
		path: '/addRole', //系统管理-权限-用户角色管理-新增角色
		name: 'addRole',
		component: () => import(/* webpackChunkName: "addRole" */ '../views/systemManagement/role/addRole.vue'),
	}, {
		path: '/F0201/F020101', //产品管理-产品管理-产品列表
		name: 'pdtList',
		component: () => import(/* webpackChunkName: "pdtList" */ '../views/pdtManagement/list/pdtList.vue'),
	}, {
		path: '/addPdt', //产品管理-产品管理-产品列表-新增产品
		name: 'addPdt',
		component: () => import(/* webpackChunkName: "addPdt" */ '../views/pdtManagement/list/addPdt.vue'),
	}, {
		path: '/pdtDetail', //产品管理-产品管理-产品列表-产品详情
		name: 'pdtDetail',
		component: () => import(/* webpackChunkName: "pdtDetail" */ '../views/pdtManagement/list/pdtDetail.vue'),
	}, {
		path: '/pdtSupplier/:id', //产品管理-产品管理-产品列表-已关联供应商
		name: 'pdtSupplier',
		component: () => import(/* webpackChunkName: "pdtSupplier" */ '../views/pdtManagement/list/pdtSupplier.vue'),
	}, {
		path: '/F0201/F020102', //产品管理-产品管理-产品分类
		name: 'pdtType',
		component: () => import(/* webpackChunkName: "pdtType" */ '../views/pdtManagement/type/pdtType.vue'),
	}, {
		path: '/addType', //产品管理-产品管理-产品分类-新增分类
		name: 'addType',
		component: () => import(/* webpackChunkName: "addType" */ '../views/pdtManagement/type/addType.vue'),
	}, {
		path: '/F0201/F020103', //产品管理-产品管理-品牌管理
		name: 'brandManagement',
		component: () => import(/* webpackChunkName: "brandManagement" */ '../views/pdtManagement/brand/brandManagement.vue'),
	}, {
		path: '/addBrand', //产品管理-产品管理-品牌管理-新增品牌
		name: 'addBrand',
		component: () => import(/* webpackChunkName: "addBrand" */ '../views/pdtManagement/brand/addBrand.vue'),
	}, {
		path: '/F0301/F030101', //采购-采购管理-采购单
		name: 'purchaseOrder',
		component: () => import(/* webpackChunkName: "purchaseOrder" */ '../views/purchaseManagement/purchase/purchaseOrder.vue'),
	}, {
		path: '/F0301/purchaseOrderDetail', //采购-采购管理-采购单详情
		name: 'purchaseOrderDetail',
		component: () => import(/* webpackChunkName: "purchaseOrderDetail" */ '../views/purchaseManagement/purchase/purchaseOrderDetail.vue'),
	}, {
		path: '/F0301/arrivePage', //采购-采购管理-采购单-到货
		name: 'arrivePage',
		component: () => import(/* webpackChunkName: "arrivePage" */ '../views/purchaseManagement/purchase/arrivePage.vue'),
	}, {
		path: '/F0301/approvalPage', //采购-采购管理-采购单-审批
		name: 'approvalPage',
		component: () => import(/* webpackChunkName: "approvalPage" */ '../views/purchaseManagement/purchase/approvalPage.vue'),
	}, {
		path: '/F0301/applyForPay', //采购-采购管理-采购单-申请付款
		name: 'applyForPay',
		component: () => import(/* webpackChunkName: "applyForPay" */ '../views/purchaseManagement/purchase/applyForPay.vue'),
	}, {
		path: '/addPurchase', //采购-采购管理-采购单-发起采购
		name: 'addPurchase',
		component: () => import(/* webpackChunkName: "addPurchase" */ '../views/purchaseManagement/purchase/addPurchase.vue'),
	}, {
		path: '/F0302/F030201', //采购-供应商管理-供应商管理
		name: 'supplierManagement',
		component: () => import(/* webpackChunkName: "supplierManagement" */ '../views/purchaseManagement/supplier/supplierManagement.vue'),
	}, {
		path: '/addSupplier', //采购-供应商管理-供应商管理-新增供应商
		name: 'addSupplier',
		component: () => import(/* webpackChunkName: "addSupplier" */ '../views/purchaseManagement/supplier/addSupplier.vue'),
	}, {
		path: '/supplierDetail/:id', //采购-供应商管理-供应商管理-供应商信息
		name: 'supplierDetail',
		component: () => import(/* webpackChunkName: "supplierDetail" */ '../views/purchaseManagement/supplier/supplierDetail.vue'),
	}, {
		path: '/supplierPdt/:id', //采购-供应商管理-供应商管理-供应中产品
		name: 'supplierPdt',
		component: () => import(/* webpackChunkName: "supplierPdt" */ '../views/purchaseManagement/supplier/supplierPdt.vue'),
	}, {
		path: '/F0302/F030202', //采购-供应商管理-结算方式
		name: 'settleStyle',
		component: () => import(/* webpackChunkName: "settleStyle" */ '../views/purchaseManagement/settle/settleStyle.vue'),
	}, {
		path: '/addSettle', //采购-供应商管理-结算方式-新增结算方式
		name: 'addSettle',
		component: () => import(/* webpackChunkName: "addSettle" */ '../views/purchaseManagement/settle/addSettle.vue'),
	}, {
		path: '/F0401/F040104', //库存管理 > 仓库设置 
		name: 'storeSetting',
		component: () => import(/* webpackChunkName: "storeSetting" */ '../views/storeManagement/storeSetting/storeSetting.vue'),
	}, {
		path: '/F0401/F040104/:storeId', //库存管理 > 仓库设置 > 仓库详情
		name: 'storeInfo',
		component: () => import(/* webpackChunkName: "storeInfo" */ '../views/storeManagement/storeSetting/storeInfo.vue'),
	}, {
		path: '/F0401/F040101', //库存管理 > 库存清单
		name: 'inventoryList',
		component: () => import(/* webpackChunkName: "inventoryList" */ '../views/storeManagement/inventoryList/index.vue'),
	}, {
		path: '/F0401/F040102', //库存管理 > 入库管理
		name: 'inStoreManagement',
		component: () => import(/* webpackChunkName: "inStoreManagement" */ '../views/storeManagement/inStoreManagement/index.vue'),
	}, {
		path: '/F0401/F040102/:inId', //库存管理 > 入库管理 > 入库单
		name: 'inStoreView',
		component: () => import(/* webpackChunkName: "inStoreView" */ '../views/storeManagement/inStoreManagement/viewStore.vue'),
	}, {
		path: '/F0401/inStoreAddOrEdit', //库存管理 > 入库管理 > 新增/编辑入库
		name: 'inStoreAddOrEdit',
		component: () => import(/* webpackChunkName: "inStoreAddOrEdit" */ '../views/storeManagement/inStoreManagement/addOrEdit.vue'),
	}, {
		path: '/F0401/inStore', //库存管理 > 入库管理 > 入库
		name: 'inStore',
		component: () => import(/* webpackChunkName: "inStore" */ '../views/storeManagement/inStoreManagement/inStore.vue'),
	}, {
		path: '/F0401/F040103', //库存管理 > 出库管理
		name: 'outStoreManagement',
		component: () => import(/* webpackChunkName: "outStoreManagement" */ '../views/storeManagement/outStoreManagement/index.vue'),
	}, {
		path: '/F0401/F040103/:outId', //库存管理 > 出库管理 > 出库单
		name: 'outStoreView',
		component: () => import(/* webpackChunkName: "outStoreView" */ '../views/storeManagement/outStoreManagement/viewOutStoreDetail.vue'),
	}, {
		path: '/F0401/outStoreAddOrEdit', //库存管理 > 出库管理 > 新增/编辑出库
		name: 'outStoreAddOrEdit',
		component: () => import(/* webpackChunkName: "outStoreAddOrEdit" */ '../views/storeManagement/outStoreManagement/outStoreAddOrEdit.vue'),
	}, {
		path: '/F0401/outStore', //库存管理 > 出库管理 > 出库
		name: 'outStore',
		component: () => import(/* webpackChunkName: "outStore" */ '../views/storeManagement/outStoreManagement/outStore.vue'),
	}, {
		path: '/F0501/F050101', //财务管理 > 应付费管理
		name: 'paymentManagement',
		component: () => import(/* webpackChunkName: "paymentManagement" */ '../views/financeManagement/paymentManagement/index.vue'),
	}, {
		path: '/F0501/viewPrint', //财务管理 > 应付费管理 > 付款单打印页
		name: 'viewPrint',
		component: () => import(/* webpackChunkName: "viewPrint" */ '../views/financeManagement/paymentManagement/viewPrint.vue'),
	}, {
		path: '/F0501/approvePayment', //财务管理 > 应付费管理 > 付款单打印页
		name: 'approvePayment',
		component: () => import(/* webpackChunkName: "approvePayment" */ '../views/financeManagement/paymentManagement/approvePayment.vue'),
	}]
}, {
	path: '/login', //登录页
	name: 'login',
	component: () => import(/* webpackChunkName: "login" */ '../views/index/login.vue'),
}]

export default new VueRouter({
	routes
})