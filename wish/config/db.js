const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/wish')
        console.log('MongoDB 连接成功')
    }catch(err){
        console.error('MongoDB 连接失败',err)
        process.exit(1)
    }
}

module.exports = connectDB