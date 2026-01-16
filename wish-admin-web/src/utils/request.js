import axios from 'axios'

// 创建axios实例
const request = axios.create({
    baseURL:'http://localhost:3001', //后台接口地址
    timeout: 5000 // 请求超时时间
})

module.exports = request