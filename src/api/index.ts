import useUserStore from '@/store/modules/user'
import axios from 'axios'
// import qs from 'qs'
import { toast } from 'vue-sonner'

const api = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
})

api.interceptors.request.use(
  (request) => {
    // 全局拦截请求发送前提交的参数
    // const userStore = useUserStore()
    // 设置请求头
    // if (request.headers) {
    //   if (userStore.isLogin) {
    //     request.headers.Token = userStore.token
    //   }
    // }
    // 是否将 POST 请求参数进行字符串化处理
    if (request.method === 'post') {
      // request.data = qs.stringify(request.data, {
      //   arrayFormat: 'brackets',
      // })
    }
    return request
  },
)

api.interceptors.response.use(
  (response) => {
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 假设返回数据格式为：{ status: 1, error: '', data: {} }
     * 规则是当 status 为 1 时表示请求成功，为 0 时表示接口需要登录或者登录状态失效，需要重新登录
     * 请求出错时 error 会返回错误信息
     */
    if (response.data.status === 1) {
      if (response.data.error !== '') {
        toast.warning('Warning', {
          description: response.data.error,
        })
        return Promise.reject(response.data)
      }
    }
    else {
      // 登出
    }
    return Promise.resolve(response.data)
  },
  (error) => {
    console.log(error)
    if (error.status === 401) {
      // 登出
      throw error
    }
    let message = error.message
    if (message === 'Network Error') {
      message = '后端网络故障'
    }
    else if (message.includes('timeout')) {
      message = '接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `状态码：${message.substr(message.length - 3)} 提示：${error.response.data.message}`
    }
    toast.error('错误', {
      description: message,
    })
    return Promise.reject(error)
  },
)

export default api
