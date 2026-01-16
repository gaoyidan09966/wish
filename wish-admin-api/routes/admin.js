const express = require('express')
const router = express.Router()

// 导入控制器
const AdminController = require('../controllers/admin')
const WishController = require('../controllers/wish')

// 导入中间件
const auth = require('../middleware/auth')

// ==========================================
// 1. 公共接口（不需要 token）
// ==========================================

// 管理员登录 (实际访问: POST /admin/login)
router.post('/login', AdminController.login)


// ==========================================
// 2. 许愿管理接口（需要 token）
// ==========================================

// 获取许愿列表 (实际访问: GET /admin/wish)
router.get('/wish', auth, WishController.getList)

// 删除许愿 (实际访问: DELETE /admin/wish/:id)
router.delete('/wish/:id', auth, WishController.delete)


// ==========================================
// 3. 管理员用户管理接口 (需要 token)
// ==========================================

// 获取所有管理员列表 (实际访问: GET /admin/list)
router.get('/list', auth, AdminController.getAdminList)

// 新增/注册管理员 (实际访问: POST /admin/register)
router.post('/register', auth, AdminController.register)

// 删除管理员账号 (实际访问: DELETE /admin/user/:id)
router.delete('/user/:id', auth, AdminController.deleteAdmin)


// ==========================================
// 4. 系统日志管理接口 
// ==========================================

router.get('/logs', auth, AdminController.getLogs)


module.exports = router