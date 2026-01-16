<template>
  <div class="login-container">
    <div class="bg-shape shape1"></div>
    <div class="bg-shape shape2"></div>

    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dz6n"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
        </div>
        <h2>星愿墙后台管理系统</h2>
        <p>欢迎回来，请登录您的账户</p>
      </div>

      <div class="login-form">
        <div class="input-group">
          <label>用户名</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名" 
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="input-group">
          <label>密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码" 
            @keyup.enter="handleLogin"
          />
        </div>

        <button 
          :disabled="loading" 
          @click="handleLogin" 
          :class="{ 'btn-loading': loading }"
        >
          <span v-if="!loading">立即登录</span>
          <span v-else class="loader"></span>
        </button>
      </div>

      <div class="login-footer">
        <span><a href="https://space.bilibili.com/1772424360?spm_id_from=333.1007.0.0">© 点击跳转主包哔哩哔哩</a></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/request'

const username = ref('')
const password = ref('')
const loading = ref(false) // 新增：控制加载状态
const router = useRouter()

const handleLogin = async () => {
  // 简单的表单校验
  if (!username.value || !password.value) {
    alert('请输入完整的账号信息')
    return
  }

  loading.value = true // 开启加载动画
  
  try {
    const res = await request.post('/admin/login', {
      username: username.value,
      password: password.value
    })

    if (res.code === 0) {
      // 存储 Token
      localStorage.setItem('token', res.token)

      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify({
        username: username.value,
        role: res.role
      }))

      // 成功提示并跳转
      console.log('登录成功')
      router.push('/dashboard')
    } else {
      alert(res.msg || '登录失败，请检查账号密码')
    }
  } catch (err) {
    console.error(err)
    alert('网络异常，请稍后再试')
  } finally {
    loading.value = false // 关闭加载动画
  }
}
</script>

<style scoped>
/* 核心容器：全屏居中且拥有动感渐变 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 装饰背景圆圈 */
.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}
.shape1 {
  width: 400px;
  height: 400px;
  background: rgba(64, 158, 255, 0.2);
  top: -100px;
  right: -100px;
}
.shape2 {
  width: 300px;
  height: 300px;
  background: rgba(103, 194, 58, 0.15);
  bottom: -50px;
  left: -50px;
}

/* 登录卡片：毛玻璃效果 */
.login-card {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  z-index: 1;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}
.logo {
  color: #409eff;
  margin-bottom: 10px;
}
.login-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}
.login-header p {
  color: #909399;
  font-size: 14px;
  margin-top: 8px;
}

/* 表单样式 */
.input-group {
  margin-bottom: 25px;
  text-align: left;
}
.input-group label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  padding-left: 4px;
}
.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.3s;
  background-color: #fcfcfc;
}
.input-group input:focus {
  border-color: #409eff;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

/* 登录按钮 */
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #409eff, #66b1ff);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}
button:hover {
  opacity: 0.9;
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.4);
}
button:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

/* 加载动画 */
.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #FFF;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #c0c4cc;
}
.login-footer a{
  color: #409eff;
  text-decoration: none;
}
</style>