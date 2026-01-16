const express = require('express')
const router = express.Router()
const WishController = require('../controllers/wish')
const auth = require('../middleware/auth')

// 因为 app.js 已经挂载了 /admin/wish
// 这里的 '/' 实际指向的就是 /admin/wish

// 获取列表 (GET /admin/wish)
router.get('/', auth, WishController.getList)

// 新增愿望 (POST /admin/wish)
router.post('/', auth, WishController.create)

// 修改愿望 (PUT /admin/wish/:id)
router.put('/:id', auth, WishController.update)

// 删除愿望 (DELETE /admin/wish/:id)
router.delete('/:id', auth, WishController.delete)

module.exports = router