import axios from 'axios';
import { useUserStore } from '@/stores';

// 设置全局的请求次数，请求的间隙
axios.defaults.retry = 2
axios.defaults.retryDelay = 1000
axios.defaults.adapter = function (config) { //自己定义个适配器，用来适配uniapp的语法
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		var buildFullPath = require('axios/lib/core/buildFullPath');
		let fullurl = buildFullPath(config.baseURL,config.url)
		uni.request({
			method: config.method.toUpperCase(),
			// url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
			url: buildURL(fullurl, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				settle(resolve, reject, response);
			}
		})
	})
}
const baseURL = (process.env.NODE_ENV === "development") ? "http://klt.zwstk.cn" : "https://api.klt.mudanma.com";
// 创建axios实例
const service = axios.create({
	baseURL,
	timeout: 30000, // 请求超时时间-
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'oemid': 5
	}
})

// request拦截器
service.interceptors.request.use(
  config => {
	if(config.headers.loading){
	    uni.showLoading({title: '加载中'})     
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
    Promise.reject(error)
  }
)
// response 拦截器
service.interceptors.response.use(
  response => {
	if(response.config.headers.loading){
		uni.hideLoading()
	}
    const res = response.data
    if (res) {
		if (res.code === 0) { // code 为0请求正常
		    return res
		} else {
			// 先提示错误信息
			if (res.message){
				uni.showToast({ title: res.message, icon: 'error', duration: 3000});
			}
			const userStore = useUserStore()
			switch (res.code) { 
				case 700003: case 700004: // 没有登录
					uni.showModal({
						title: '提示',
						content: '您还未登录，请先登录',
						success: function (res) {
							if (res.confirm) {
								uni.redirectTo({ url: '/pages/login/index' })
							}
						}
					})
					break;
				case 700010: // 重新获取微信授权登录
					userStore.logOut()
					// navigateTo
					uni.redirectTo({url: '/pages/login/index'})
					break;
			}
		}
    } else {
	  uni.showToast({ title: '请求成功，返回值错误', icon: 'error', duration: 3000});
      return Promise.reject('error', response)
    }
  },
  error => {
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