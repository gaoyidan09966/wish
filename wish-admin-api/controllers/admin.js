const Admin = require('../models/Admin')
const Log = require('../models/Log') 
const jwt = require('jsonwebtoken')
// 导入你刚才展示的工具函数
const { recordLog } = require('../utils/logger') 

const JWT_SECRET = 'wish_admin_secret'

const AdminController = {
  // 1. 管理员登录
  async login(req, res) {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.json({ code: 1, msg: '用户名或密码不能为空' })
      }

      const admin = await Admin.findOne({ username, password })

      if (!admin) {
        return res.json({ code: 1, msg: '用户名或密码错误' })
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username, role: admin.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      )

      // ✅ 埋点：记录登录日志
      // 注意：此时请求还没经过 auth 中间件，手动模拟一个符合 recordLog 要求的对象
      await recordLog({ admin: { _id: admin._id, username: admin.username } }, '登录', '管理员登录后台系统')

      res.json({
        code: 0,
        msg: '登录成功',
        token,
        role: admin.role
      })

    } catch (err) {
      console.log(err)
      res.json({ code: 1, msg: '登录失败' })
    }
  },

  // 2. 获取所有管理员列表 (仅限超级管理员)
  async getAdminList(req, res) {
    try {
      if (req.admin.role !== 0) {
        return res.json({ code: 1, msg: '权限不足，仅限超级管理员访问' })
      }

      const list = await Admin.find({}, '-password').sort({ _id: -1 })
      
      res.json({ code: 0, data: list })
    } catch (err) {
      res.json({ code: 1, msg: '获取列表失败' })
    }
  },

  // 3. 注册/新增管理员 (仅限超级管理员)
  async register(req, res) {
    try {
      if (req.admin.role !== 0) {
        return res.json({ code: 1, msg: '权限不足' })
      }

      const { username, password, role } = req.body

      const exists = await Admin.findOne({ username })
      if (exists) {
        return res.json({ code: 1, msg: '用户名已存在' })
      }

      const newAdmin = new Admin({ username, password, role })
      await newAdmin.save()

      // ✅ 埋点：记录新增操作
      await recordLog(req, '新增账号', `创建了管理员: ${username}`)

      res.json({ code: 0, msg: '添加管理员成功' })
    } catch (err) {
      res.json({ code: 1, msg: '添加失败' })
    }
  },

  // 4. 删除管理员 (仅限超级管理员)
  async deleteAdmin(req, res) {
    try {
      if (req.admin.role !== 0) {
        return res.json({ code: 1, msg: '权限不足' })
      }

      const { id } = req.params

      if (id === req.admin.id) {
        return res.json({ code: 1, msg: '不能删除自己' })
      }

      const target = await Admin.findById(id)
      await Admin.findByIdAndDelete(id)
      
      // ✅ 埋点：记录删除操作
      if (target) {
        await recordLog(req, '删除账号', `删除了管理员: ${target.username}`)
      }
      
      res.json({ code: 0, msg: '删除管理员成功' })
    } catch (err) {
      res.json({ code: 1, msg: '删除失败' })
    }
  },

  // 5. 获取操作日志
  async getLogs(req, res) {
    try {
      const logs = await Log.find().sort({ _id: -1 })
      
      res.json({
        code: 0,
        data: logs,
        msg: '获取日志成功'
      })
    } catch (err) {
      console.error('获取日志出错:', err)
      res.json({ code: 1, msg: '获取日志失败' })
    }
  }
}

module.exports = AdminController