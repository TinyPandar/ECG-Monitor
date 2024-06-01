import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 创建并暴露一个路由器
export default new VueRouter({
    routes: [
        // 一级路由
        {
            path: '/',
            redirect: 'login'
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import("../pages/Login.vue")
        },
        {
            path: '/manage',
            name: 'Manage',
            redirect: 'manage/home',
            component: () =>
                import("../pages/Manage.vue"),
            children: [
                {
                    path: 'oldMessage',
                    name: 'OldMessage',
                    component: () => import("../pages/OldMessage"),
                },
                {
                    path: 'home',
                    name: 'Home',
                    component: () => import("../pages/Home"),
                },
                {
                    path: 'recordDisplay',
                    name: 'RecordDisplay',
                    component: () => import("../pages/RecordDisplay"),
                },
                {
                    path: 'check',
                    name: 'Check',
                    component: () => import("../pages/Check")
                },
            ]
        },
        

    ]
})