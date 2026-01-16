const mongoose = require('mongoose');
mongoose.set('strictQuery',false)

const connectDB = async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/wish')
        console.log('mongoDB connected')
    }catch(err){
        console.log('monoDB error',err)
        process.exit(1)
    }
}

module.exports = connectDB;