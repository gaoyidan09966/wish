const Wish = require("../models/Wish");
const { recordLog } = require('../utils/logger'); 

const WishController = {
  // 1. 获取列表
  async getList(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 5;
      const { keyword } = req.query;
      let queryCondition = {};
      if (keyword) {
        queryCondition = { content: { $regex: new RegExp(keyword, 'i') } };
      }
      const skip = (page - 1) * pageSize;

      // 🧠 异步等待 A: 列表数据
      const list = await Wish.find(queryCondition).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
      // 🧠 异步等待 B: 总数
      const total = await Wish.countDocuments(queryCondition);

      res.json({ code: 0, data: { list, total } });
    } catch (err) {
      res.json({ code: 1, msg: "获取失败" });
    }
  },

  // 2. 新增
  async create(req, res) {
    try {
      const { name, content } = req.body;
      const newWish = new Wish({ name, content });
      
      // 🧠 异步等待：确保愿望保存成功
      await newWish.save(); 

      // 🚀 异步触发：记录日志（不使用 await，让它异步排队，不耽误返回给前端）
      recordLog(req, '新增', `为 [${name}] 创建了愿望: ${content}`);

      res.json({ code: 0, msg: "添加成功" });
    } catch (err) {
      res.json({ code: 1, msg: "添加失败" });
    }
  },

  // 3. 修改
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, content } = req.body;
      
      // 🧠 异步等待：查找并更新
      const result = await Wish.findByIdAndUpdate(id, { name, content });
      if (result) {
        recordLog(req, '修改', `修改了 [${name}] 的愿望内容`);
        res.json({ code: 0, msg: "修改成功" });
      } else {
        res.json({ code: 1, msg: "记录未找到" });
      }
    } catch (err) {
      res.json({ code: 1, msg: "修改失败" });
    }
  },

  // 4. 删除
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (req.admin.role !== 0) return res.json({ code: 403, msg: '无权限' });

      // 🧠 异步串行：先查后删，保证日志能拿到被删数据的内容
      const wish = await Wish.findById(id);
      if (!wish) return res.json({ code: 1, msg: "记录不存在" });

      await Wish.findByIdAndDelete(id);
      
      recordLog(req, '删除', `删除了 [${wish.name}] 的愿望: ${wish.content}`);
      res.json({ code: 0, msg: "删除成功" });
    } catch (err) {
      res.json({ code: 1, msg: "删除失败" });
    }
  }
};

module.exports = WishController;