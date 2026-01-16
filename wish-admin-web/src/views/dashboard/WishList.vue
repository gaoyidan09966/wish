<template>
  <div class="page">
    <div class="header-actions">
      <h3>许愿管理</h3>
      <div class="search-bar">
        <input 
          v-model="keyword" 
          placeholder="输入内容关键词搜索..." 
          @input="handleSearch"
          class="search-input"
        />
        <button class="btn-clear" v-if="keyword" @click="clearSearch">重置</button>
        <button class="btn-primary" @click="openDialog()">+ 新增愿望</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>姓名</th>
          <th>愿望内容</th>
          <th width="150">操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in wishList" :key="item._id">
          <td>
            <strong>{{ item.name }}</strong>
          </td>
          <td>{{ item.content }}</td>
          <td>
            <button class="btn-edit" @click="openDialog(item)">编辑</button>
            <button 
              class="btn-danger" 
              v-if="userRole === 0" 
              @click="handleDelete(item._id)"
            >
              删除
            </button>
            <span v-else class="no-auth">无权限删除</span>
          </td>
        </tr>

        <tr v-if="wishList.length === 0">
          <td colspan="3" class="empty">暂无相关数据</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showDialog" class="modal-mask">
      <div class="modal-box">
        <h4>{{ dialogType === 'add' ? '新增愿望' : '修改愿望' }}</h4>
        <div class="form-item">
          <label>姓名：</label>
          <input v-model="form.name" placeholder="请输入姓名" class="form-input" />
        </div>
        <div class="form-item">
          <label>愿望内容：</label>
          <textarea v-model="form.content" placeholder="请输入内容" class="form-textarea" rows="4"></textarea>
        </div>
        <div class="modal-footer">
          <button @click="showDialog = false">取消</button>
          <button class="btn-confirm" @click="handleSubmit">保存</button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <div class="page-size">
        每页
        <select v-model.number="pageSize" @change="handlePageSizeChange">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        条
      </div> 
      <button :disabled="page === 1" @click="page--; getWishList()">上一页</button>
      <button 
        v-for="p in pageList" :key="p"
        class="page-btn" :class="{ active: p === page }"
        @click="page = p; getWishList()"
      >
        {{ p }}
      </button>
      <button :disabled="page === totalPage" @click="page++; getWishList()">下一页</button>
      <span class="total-info">总计 {{ total }} 条记录</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import request from '@/api/request'

// --- 响应式数据 ---
const wishList = ref([]) 
const page = ref(1)      
const pageSize = ref(5)  
const total = ref(0)     
const keyword = ref('') 
let searchTimer = null  

// --- 💡 弹窗相关数据 ---
const showDialog = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const editId = ref(null)
const form = ref({ name: '', content: '' })

// --- 权限获取 ---
const localUser = JSON.parse(localStorage.getItem('userInfo') || '{}')
const userRole = ref(localUser.role ?? 1)

// --- 计算属性 ---
const totalPage = computed(() => Math.ceil(total.value / pageSize.value) || 1)
const pageList = computed(() => {
  const list = []
  for (let i = 1; i <= totalPage.value; i++) list.push(i)
  return list
})

// --- 核心异步逻辑 ---

// 1. 获取列表 (Read)
const getWishList = async () => {
  try {
    const res = await request.get('/admin/wish', {
      params: { page: page.value, pageSize: pageSize.value, keyword: keyword.value }
    })
    if (res.code === 0) {
      wishList.value = res.data.list 
      total.value = res.data.total   
    }
  } catch (err) {
    console.error('获取列表请求失败:', err)
  }
}

// 2. 💡 打开弹窗逻辑 (Create/Update Init)
const openDialog = (item = null) => {
  if (item) {
    dialogType.value = 'edit'
    editId.value = item._id
    form.value = { name: item.name, content: item.content }
  } else {
    dialogType.value = 'add'
    form.value = { name: '', content: '' }
  }
  showDialog.value = true
}

// 3. 💡 异步提交表单 (Create/Update Submit)
const handleSubmit = async () => {
  if (!form.value.name || !form.value.content) return alert('请填全信息')
  
  try {
    // 🧠 异步等待开始：根据类型选择不同的请求方式
    let res
    if (dialogType.value === 'add') {
      res = await request.post('/admin/wish', form.value)
    } else {
      res = await request.put(`/admin/wish/${editId.value}`, form.value)
    }

    if (res.code === 0) {
      alert('操作成功')
      showDialog.value = false
      // 🧠 异步等待串行：保存成功后，重新获取列表以更新 UI 数据
      await getWishList()
    } else {
      alert(res.msg)
    }
  } catch (err) {
    console.error('提交失败:', err)
  }
}

// 4. 删除愿望 (Delete)
const handleDelete = async (id) => {
  if (!confirm('确定删除这条愿望吗？')) return
  try {
    const res = await request.delete(`/admin/wish/${id}`)
    if (res.code === 0) {
      alert('删除成功')
      await getWishList() 
    }
  } catch (err) {
    console.error('删除异常:', err)
  }
}

// 搜索与分页逻辑
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    getWishList()
  }, 500)
}

const clearSearch = () => {
  keyword.value = ''; page.value = 1; getWishList()
}

const handlePageSizeChange = () => {
  page.value = 1; getWishList()
}

onMounted(() => { getWishList() })
</script>

<style scoped>

  
/* 保持原有样式并增加对话框样式 */
.page { background: #fff; padding: 20px; }
.header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.search-bar { display: flex; align-items: center; gap: 10px; }
.search-input { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; width: 220px; }
.btn-primary { background: #409eff; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.btn-edit { color: #409eff; background: transparent; border: none; cursor: pointer; margin-right: 10px; }
.btn-danger { background-color: #e74c3c; color: #fff; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border: 1px solid #e5e5e5; padding: 12px; text-align: left; }
.table th { background-color: #f7f7f7; }

/* 💡 对话框样式 */
.modal-mask { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-box { background: #fff; padding: 25px; border-radius: 8px; width: 400px; box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
.form-item { margin-bottom: 15px; }
.form-item label { display: block; margin-bottom: 5px; font-weight: bold; }
.form-input, .form-textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-confirm { background: #409eff; color: #fff; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }

.pagination { margin-top: 20px; display: flex; align-items: center; gap: 5px; }
.page-btn.active { background: #409eff; color: #fff; border-color: #409eff; }
</style>