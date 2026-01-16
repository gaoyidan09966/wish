import axios from 'axios'
import router from '../router'

//创建axios实例
const service = axios.create({
    baseURL:'http://localhost:3001',
    timeout:5000
})

//请求拦截器(自动带token)，统一添加token
service.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = 'Bearer ' + token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//响应拦截器（统一处理返回数据）
service.interceptors.response.use(
    (response) => { return response.data},
    (error) => {
        if(error.response && error.response.status === 401){
            //token过期，跳转到登录页
            localStorage.removeItem('token')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default service