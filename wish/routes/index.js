var express = require('express');
var router = express.Router();
const Wish = require('../models/Wish');
const IndexController = require('../controllers');

/* GET 首页路由. */
router.get('/',IndexController.getList);
/* POST 提交表单路由. */
router.post('/add',IndexController.addWish)

router.get('/test-result', (req, res) => {
  res.render('result', {
    result: '测试成功',
    msg: '这是一个 result 页面测试'
  })
})


module.exports = router;
