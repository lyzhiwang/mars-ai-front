import request from '@/utils/request'

// login
export function login(data) {
	return request({
		loading: true,
		url: '/v1/user/login',
		method: 'post',
		data
	})
}
// 卡密激活
export function activateCode(params){
	return request({
		loading: true,
		url: '/v1/admin/activate/code',
		method: 'get',
		params
	})
}
// change password
export function changePwd(data) {
	return request({
		loading: true,
		url: '/reset/password',
		method: 'patch',
		data
	})
}

// userinfo
export function getUserInfo(params) {
	return request({
		url: '/user/info',
		method: 'get',
		params
	})
}

export function crtReplyClass(data) {
	return request({
		url: '/v1/answer',
		method: 'post',
		data
	})
}