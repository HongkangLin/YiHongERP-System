import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
	path: '/',
	name: 'index',
	component: () => import(/* webpackChunkName: "index" */ '../views/index/index.vue'),
	redirect: '/F0101/F010101',
	children: [{
		path: '/F0101/F010101', //首页
		name: 'indexPage',
		component: () => import(/* webpackChunkName: "indexPage" */ '../views/indexPage/index.vue'),
	}]
}, {
	path: '/login', //登录页
	name: 'login',
	component: () => import(/* webpackChunkName: "login" */ '../views/index/login.vue'),
}]

export default new VueRouter({
	routes
})