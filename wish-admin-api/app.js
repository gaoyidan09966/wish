const cors = require('cors')
var express = require('express');
//引入数据库连接文件
const connectDB = require('./config/db')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//  引入路由模块
const indexRouter = require('./routes/index'); 
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const wishRouter = require('./routes/wish');


var app = express();

//允许跨域
app.use(cors());

//连接数据库
connectDB()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin',adminRouter);
app.use('/admin/wish',wishRouter);

module.exports = app;
