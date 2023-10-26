import axios from 'axios';
import { useUserStore } from '@/stores';
import { uniAdapter } from 'fant-axios-adapter'

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000
const baseURL = (process.env.NODE_ENV === "development") ? "http://gdytest.zwstk.cn/api" : "https://mars.lytklw.cn/api";
// const baseURL = (process.env.NODE_ENV === "development") ? "https://mars.lytklw.cn/api" : "https://mars.lytklw.cn/api";
// 创建axios实例
const oemid = Number(import.meta.env.VITE_OEM_ID)
// 错误白名单
const errorWhiteList = ['/v1/oem/config','/v1/ali/job','/v1/check/job']
const service = axios.create({
	baseURL,
	timeout: 60000, // 请求超时时间-
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'oemid': oemid
	},
	adapter: uniAdapter // 配置适配器
})

// request拦截器
service.interceptors.request.use(
  config => {
	if(config.loading){
	    uni.showLoading({title: '加载中', mask: true})     
	}
	const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = 'Bearer ' + userStore.token // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    uni.hideLoading()
	// console.log(error)
    // Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
	if(response.config.loading){
		uni.hideLoading()
	}
    const res = response.data
    if (res) {
		if (res.code === 0) { // code 为0请求正常
		    return res
		} else if(errorWhiteList.indexOf(response.config.url)==-1) {
			// console.log(999, res)
			// 先提示错误信息
			if (res.message){
				uni.showToast({ title: res.message, icon: 'none', duration: 3000});
			}
			const userStore = useUserStore()
			switch (res.code) { 
				case 700003: case 700004: // 没有登录
					userStore.logOut()
					uni.showModal({
						title: '提示',
						content: '您还未登录或登录超时，请登录!',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({ url: '/pagesub/login/index' })
							}
						}
					})
					break;
				case 700010: // 重新获取微信授权登录
					userStore.logOut()
					// navigateTo
					uni.redirectTo({url: '/pagesub/login/index'})
					break;
			}
		}
    } else {
	  uni.showToast({ title: '请求成功，返回值错误', icon: 'none', duration: 3000});
      return Promise.reject('error', response)
    }
  },
  error => {
	// console.log(error)
    uni.hideLoading()
	// http响应状态码
	const resposeCode = {
		'301': '请求需要重定向',
		'400': '网络错误，请重新尝试',
		'403': '请求被拒绝',
		'404': '请求资源不存在',
		'500': '服务器错误',
	}
    const response = error.response || { status: 404 }
    const status = response.status
    uni.showToast({ title: resposeCode[status], icon: 'none', duration: 2000});
    return Promise.reject(error)
  }
)

export default service
