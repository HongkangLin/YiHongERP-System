import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [{
	path: '/',
	component: () => import(/* webpackChunkName: "index" */ '../views/index/index.vue'),
	children: [{
		path: '/F001/F00101',
		component: () => import(/* webpackChunkName: "indexPage" */ '../views/indexPage/index.vue'),
	}]
}]

export default new VueRouter({
	routes
})