<template>
  <div class="page">
    <div class="header-actions">
      <h3>系统操作日志</h3>
      <button class="btn-refresh" @click="getLogs">刷新日志</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>操作时间</th>
          <th>管理员</th>
          <th width="100">动作</th>
          <th>详细描述</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="log in logs" :key="log._id">
          <td class="time">{{ formatTime(log.createdAt) }}</td>
          <td>
            <strong>{{ log.adminName }}</strong>
          </td>
          <td>
            <span :class="['tag', getActionClass(log.action)]">
              {{ log.action }}
            </span>
          </td>
          <td class="desc">{{ log.details }}</td>
        </tr>

        <tr v-if="logs.length === 0">
          <td colspan="4" class="empty">暂无操作记录</td>
        </tr>
      </tbody>
    </table>
    
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/api/request'

// --- 响应式数据 ---
const logs = ref([])

// --- 获取数据（Read） ---
const getLogs = async () => {
  try {
    // 🧠 异步等待：从后端拉取日志列表
    const res = await request.get('/admin/logs')
    if (res.code === 0) {
      logs.value = res.data
    }
  } catch (err) {
    console.error('获取日志失败:', err)
  }
}

// --- 辅助函数 ---
const formatTime = (time) => {
  const d = new Date(time)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

const getActionClass = (action) => {
  const map = { '新增': 'tag-add', '修改': 'tag-edit', '删除': 'tag-danger' }
  return map[action] || ''
}

onMounted(() => {
  getLogs()
})
</script>

<style scoped>

/* ===== 1. 页面根容器：不制造任何留白 ===== */
.page {
  margin: 0;
  padding: 0;              /* 🔥 去掉原来的 30px */
  min-height: 100%;
  background: transparent; /* 不再自己铺背景色 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 2. 顶部操作栏（仅内部结构需要的内边距） ===== */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;        /* 只给内容留可读空间 */
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.header-actions h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 去掉装饰条，保持干净 */
.header-actions h3::before {
  display: none;
}

/* 刷新按钮 */
.btn-refresh {
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn-refresh:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* ===== 3. 表格容器：直接贴满 ===== */
.table {
  width: 100%;
  border-collapse: collapse; /* 去掉圆角和分隔 */
  background: #ffffff;
}

/* 表头 */
.table th {
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  padding: 12px 16px;
  font-size: 13px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

/* 表格内容 */
.table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f1f5f9;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

/* 时间列 */
.time {
  font-size: 12px;
  color: #9ca3af;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* 描述 */
.desc {
  color: #6b7280;
  line-height: 1.6;
}

/* ===== 4. 标签（保持，但不制造空间） ===== */
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tag-add {
  background: #ecfeff;
  color: #0891b2;
}

.tag-edit {
  background: #eff6ff;
  color: #2563eb;
}

.tag-danger {
  background: #fef2f2;
  color: #dc2626;
}

/* ===== 5. 空状态 ===== */
.empty {
  text-align: center;
  color: #9ca3af;
  padding: 40px 0;
  font-size: 14px;
}

</style>