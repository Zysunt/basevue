import Vue from 'vue'
import VueRouter from './vue-router'
import Home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:'home',
        component:Home
    },
    {
        path:'/tab',
        name:'tab',
        component:()=> import('../views/tab.vue')
    }

]

const router = new VueRouter({
    routes
})
export default router