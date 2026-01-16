//JWT 鉴权中间件
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'wish_admin_secret'

module.exports = (req,res,next)=>{
    //获取请求头中的token
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({
            code:401,
            msg:'请先登录'
        })
    }

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        //把解析后的管理员信息挂到req对象上,方便后续中间件使用
        req.admin = decoded
        next()
    }catch(err){
        return res.status(401).json({
            code:401,
            msg:'登录已经过期或无效'
        })
    }
    
}