const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  // 执行操作的管理员ID（关联 Admin 模型）
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  // 管理员姓名（冗余存储，方便直接查询显示）
  adminName: { type: String, required: true },
  // 操作类型：新增/修改/删除
  action: { type: String, required: true },
  // 具体描述：例如 "删除了愿望：祝大家新年快乐"
  details: { type: String },
  // 操作时间
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Log', logSchema)   