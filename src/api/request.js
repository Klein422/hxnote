import store from "../store";
import axios from "axios";

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// request 拦截器,统一添加accesstoken和refreshtoken
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'
  let token = store.state.user.token
  if(token && token!==''){
    config.headers.token = token
  }
  return config
}, error => {
  return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  response => {
    let res = response.data;
    let code = Number(res.code);
    let message = res.message
    let success = res.success

    switch (code) {
      case 200:
        break;
      default:
        break;
    }

    // 如果是返回的文件
    if (response.config.responseType === 'blob') {
      return res
    }
    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    return res;
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)


export default request

