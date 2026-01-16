<template>
  <div class="page">
    <div class="header-actions">
      <h3>管理员管理</h3>
      <button class="btn-primary" @click="showAddDialog = true">+ 新增管理员</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>用户名</th>
          <th>角色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in adminList" :key="admin._id">
          <td>{{ admin.username }}</td>
          <td>
            <span :class="admin.role === 0 ? 'tag-super' : 'tag-admin'">
              {{ admin.role === 0 ? '超级管理员' : '普通管理员' }}
            </span>
          </td>
          <td>
            <button 
              v-if="admin.username !== currentUser?.username"
              class="btn-text-danger" 
              @click="handleDelete(admin._id)"
            >
              删除
            </button>
            <span v-else style="color: #999;">当前登录</span>
          </td>
        </tr>
        <tr v-if="adminList.length === 0">
          <td colspan="3" style="text-align: center; color: #999; padding: 20px;">暂无管理员数据</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showAddDialog" class="modal">
      <div class="modal-content">
        <h4>新增管理员</h4>
        <input v-model="form.username" placeholder="用户名" class="input-item" />
        <input v-model="form.password" type="password" placeholder="密码" class="input-item" />
        <select v-model.number="form.role" class="input-item">
          <option :value="1">普通管理员</option>
          <option :value="0">超级管理员</option>
        </select>
        <div class="modal-btns">
          <button class="confirm-btn" @click="handleAdd">确定</button>
          <button @click="showAddDialog = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/api/request'
import { getUserInfo } from '@/utils/auth'

const adminList = ref([])
const showAddDialog = ref(false)
const currentUser = getUserInfo()
const form = ref({ username: '', password: '', role: 1 })

// 1. 异步获取管理员列表
const getAdminList = async () => {
  try {
    // 💡 重点：这里的路径必须与后端 app.use('/admin') + router.get('/list') 对齐
    const res = await request.get('/admin/list')
    if (res.code === 0) {
      adminList.value = res.data
    }
  } catch (err) {
    console.error('获取管理员列表异步失败:', err)
  }
}

// 2. 异步新增管理员
const handleAdd = async () => {
  if (!form.value.username || !form.value.password) return alert('请填写完整信息')
  try {
    const res = await request.post('/admin/register', form.value)
    if (res.code === 0) {
      alert('添加成功')
      showAddDialog.value = false
      form.value = { username: '', password: '', role: 1 }
      await getAdminList() // 异步刷新：等待新增成功后再拉取最新列表
    }
  } catch (err) {
    alert('添加失败，请检查网络')
  }
}

// 3. 异步删除管理员
const handleDelete = async (id) => {
  if (!confirm('确定删除该管理员吗？')) return
  try {
    const res = await request.delete(`/admin/user/${id}`)
    if (res.code === 0) {
      await getAdminList() // 异步刷新：等待删除完成后再更新 UI
    }
  } catch (err) {
    alert('删除失败')
  }
}

onMounted(() => {
  getAdminList()
})
</script>

<style scoped>
/* ===== 1. 页面根容器（保持 0 边距） ===== */
.page {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #1f2937;
}

/* ===== 2. 顶部操作栏（轻阴影 + 分隔感） ===== */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.header-actions h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  letter-spacing: 0.2px;
}

/* ===== 3. 主按钮（现代但克制） ===== */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: none;
}

/* ===== 4. 表格（企业后台标准风格） ===== */
.table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

/* 表头 */
.table th {
  background: #f8fafc;
  color: #6b7280;
  font-weight: 600;
  padding: 14px 20px;
  font-size: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* 单元格 */
.table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
}

/* 行 hover */
.table tbody tr {
  transition: background-color 0.15s ease;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tr:last-child td {
  border-bottom: none;
}

/* ===== 5. 角色标签（胶囊 + 柔和色） ===== */
.tag-super,
.tag-admin {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.tag-super {
  color: #dc2626;
  background: #fef2f2;
}

.tag-admin {
  color: #2563eb;
  background: #eff6ff;
}

/* ===== 6. 操作按钮（文字按钮规范） ===== */
.btn-text-danger {
  color: #ef4444;
  background: transparent;
  border: none;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 13px;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.btn-text-danger:hover {
  background: #fef2f2;
  text-decoration: none;
}

/* ===== 7. 弹窗遮罩（柔和暗化） ===== */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗主体 */
.modal-content {
  background: #ffffff;
  width: 340px;
  padding: 22px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: modalFade 0.2s ease-out;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content h4 {
  margin: 0 0 6px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* ===== 8. 输入控件（统一交互） ===== */
.input-item {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.15s ease;
}

.input-item:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ===== 9. 弹窗按钮 ===== */
.modal-btns {
  display: flex;
  gap: 12px;
  margin-top: 6px;
}

.modal-btns button {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-btns button:hover {
  background: #f9fafb;
}

.modal-btns .confirm-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
}

.modal-btns .confirm-btn:hover {
  background: #1d4ed8;
}


</style>