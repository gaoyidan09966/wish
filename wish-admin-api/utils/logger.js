const Log = require('../models/Log')

/**
 * 记录系统操作日志工具函数
 * @param {Object} req Express 请求对象（需包含 admin 信息）
 * @param {String} action 操作类型（如：新增、修改、删除）
 * @param {String} details 具体描述
 */
const recordLog = async (req, action, details) => {
  try {
    // 1. 防御性检查：确保 req.admin 存在（由 auth 中间件提供）
    if (!req || !req.admin) {
      console.warn('⚠️ [Log Warn]: 未获取到管理员信息，跳过日志记录。请检查该路由是否挂载了 auth 中间件。');
      return;
    }

    // 2. 核心修复：兼容 JWT 中存储的 id 或数据库原生的 _id
    const adminId = req.admin.id || req.admin._id;
    const username = req.admin.username;

    // 3. 校验关键字段，防止模型校验失败
    if (!adminId) {
      console.error('❌ [Log Error]: 写入失败，req.admin 中缺少 id 或 _id 字段。当前内容:', req.admin);
      return;
    }

    // 4. 构造日志实例
    const log = new Log({
      adminId: adminId,
      adminName: username || '未知管理员',
      action: action,
      details: details
    })
    
    // 5. 执行异步保存
    await log.save()
    console.log(`[Log Success]: 管理员 ${username} 执行了 [${action}] 操作`);

  } catch (err) {
    // 6. 异常捕获：即使日志记录失败，也不应阻断主业务逻辑
    console.error('❌ [Log Database Error]: 日志写入数据库失败！');
    console.error('错误详情:', err.message); 
    // 如果是因为模型校验失败，这里会打印出具体的字段错误
  }
}

module.exports = { recordLog }