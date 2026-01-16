import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '@/layout/Layout.vue'
import WishList from '../views/dashboard/WishList.vue'
import User from '../views/dashboard/User.vue'
import Logs from '../views/dashboard/Logs.vue'
// 2. 导入解析工具
import { getUserInfo } from '@/utils/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'wish',
        component: WishList,
        meta: { requiresAuth: true }
      },
      {
        path: 'user', 
        component: User, // ⭐ 这里正式指向 User 组件
        meta: { requiresAuth: true }
      },
      {
        path: 'logs',
        component: Logs, // Logs 页面还没写，暂时先用 WishList 占位
        meta: { requiresAuth: true }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- 全局路由守卫（完整版） ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = getUserInfo() // 同步获取异步存入的身份信息

  // 1. 登录页直接放行
  if (to.path === '/login') {
    return next()
  }

  // 2. 拦截后台页面
  if (to.path.startsWith('/dashboard')) {
    // A. 没登录的拦截
    if (!token) {
      return next('/login')
    }

    // B. 权限拦截：普通管理员(role: 1)禁止进入 user 和 logs 页面
    const superAdminPaths = ['/dashboard/user', '/dashboard/logs']
    if (superAdminPaths.includes(to.path) && user?.role !== 0) {
      alert('权限不足：只有超级管理员可以访问此页面')
      return next('/dashboard/wish')
    }
  }

  next()
})

export default router