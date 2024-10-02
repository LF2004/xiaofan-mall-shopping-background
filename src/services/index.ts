import axios from "axios";
import {ElMessage} from "element-plus";
import router from "@/router";
// 创建axios实例
const service = axios.create({
    baseURL:'http://localhost:8000',
    timeout:5000,
    headers:{
        "Content-Type":"application/json;charset=utf-8"
    }
})
// 设置请求拦截
service.interceptors.request.use(config => {
    config.headers = config.headers || {}
    if(localStorage.getItem('token')){
        config.headers.Authorization = localStorage.getItem('token') || ''
    }
    return config
})
// 设置响应拦截器
service.interceptors.response.use(res =>{
    const code:number = res.data.code;
    if(code !== 200) {
        ElMessage({ type: 'warning', message: res.data.msg })
    }else {
        ElMessage({ type: 'success', message: res.data.msg })
    }
    return res.data
},(err) =>{
    const code:number = err.response.data.code;
    if(code !== 200) {
        ElMessage({ type: 'warning', message: err.response.data.msg });
        router.push('/login')
    }
    console.log(err)
})

export default service
