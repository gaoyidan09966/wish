//引入数据库模型
const Wish = require('../models/Wish')

const IndexController = {
    //获取首页数据
    async getList(req,res){
        try{
            const wishes = await Wish.find().sort({createdAt:-1})
            res.render('index',{wishes})
        }catch(err){
            console.log(err)
            res.status(500).render('result',{
                result:'获取数据失败',
                msg:'查询失败,请稍后再试'
            })
        }
    },
    async addWish(req,res){
        try{
            const {name,content} = req.body
            //添加必要校验
            if(!name || !content){
                return res.status(400).render('result',{
                    result:'添加失败',
                    msg:'姓名和愿望不能为空'
                })
            }

            const trimmedName = name.trim()
            const trimmedContent = content.trim()

            if(!trimmedName || !trimmedContent){
                return res.status(400).render('result',{
                    result:'添加失败',
                    msg:'姓名和愿望不能为空'
                })
            }
            //写入数据库
            await Wish.create({
                name:trimmedName,
                content:trimmedContent
            })
            //成功后跳转页面
            res.render('result',{
                result:'添加成功',
                msg:'添加成功,返回查看吧'
            })
        }catch(err){
            console.log(err)
            res.status(500).render('result',{
                result:'添加失败',
                msg:'服务器错误,添加失败'
            })
        }
    }
}

module.exports = IndexController
