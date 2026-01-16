<template>
  <div class="layout">
    <header class="header">
      <span>许愿墙后台</span>
      <div class="user-info">
        <span style="margin-right: 15px; font-size: 14px;">欢迎，{{ user?.username }}</span>
        <button @click="logout">退出登录</button>
      </div>
    </header>

    <div class="main">
      <aside class="sidebar">
        <ul>
          <li v-for="menu in visibleMenus" :key="menu.path">
            <router-link :to="menu.path">
              {{ menu.title }}
            </router-link>
          </li>
        </ul>
      </aside>

      <section class="content">
        <router-view></router-view>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/utils/auth' // 记得创建这个工具函数
import { ROLE } from '@/utils/role'      // 记得创建这个常量

const router = useRouter()

// 1. 获取用户信息（内含 role）
// 这是一个同步解析 Token 的过程，不需要 await
const user = getUserInfo()

// 2. 定义所有菜单的配置表
const allMenus = [
  {
    title: '许愿管理',
    path: '/dashboard/wish',
    roles: [ROLE.SUPER_ADMIN, ROLE.ADMIN] // 全员可见
  },
  {
    title: '管理员管理',
    path: '/dashboard/user',
    roles: [ROLE.SUPER_ADMIN] // 仅超管可见
  },
  {
    title: '操作日志',
    path: '/dashboard/logs',
    roles: [ROLE.SUPER_ADMIN] // 仅超管可见
  }
]

// 3. ⭐ 核心：根据角色异步过滤菜单
const visibleMenus = computed(() => {
  if (!user) return []
  // 只有当前用户的 role 包含在菜单定义的 roles 数组中，才显示
  return allMenus.filter(menu => menu.roles.includes(user.role))
})

const logout = () => {
  // 退出时清除所有本地存储，确保异步状态被重置
  localStorage.clear()
  router.push('/login')
}
</script>

<style>
/* ===== 1. 清除浏览器默认边距 ===== */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* ===== 2. 总布局（全贴边） ===== */
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 3. 顶部 Header（贴边） ===== */
.header {
  height: 56px;
  background: #1f2937;
  color: #ffffff;
  padding: 0 20px; /* 只保留左右内边距，视觉需要 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header span {
  font-size: 18px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info button {
  background: #ef4444;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.user-info button:hover {
  background: #dc2626;
}

/* ===== 4. 主体区域（贴边） ===== */
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ===== 5. 左侧侧边栏（贴边） ===== */
.sidebar {
  width: 220px;
  background: #111827;
  padding: 0; /* 关键：不留任何边距 */
  color: #cbd5e1;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  margin: 0;
}

/* 菜单项 */
.sidebar li a {
  display: block;
  padding: 12px 20px; /* 菜单内部可读性需要 */
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
}

.sidebar li a:hover {
  background: #1f2937;
  color: #ffffff;
}

/* 激活菜单 */
.sidebar li a.router-link-active {
  background: #2563eb;
  color: #ffffff;
  font-weight: 500;
}

/* ===== 6. 内容区（完全无边距） ===== */
.content {
  flex: 1;
  padding: 0; /* 核心：彻底去掉 */
  margin: 0;
  background: #ffffff;
  overflow: auto;
}

/* ===== 7. 禁止 router-view 默认留白 ===== */
.content > * {
  margin: 0;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}

</style>  