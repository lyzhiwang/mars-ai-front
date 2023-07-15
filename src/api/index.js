import request from '@/utils/request'

// login
export function login(data) {
	return request({
		loading: true,
		url: '/user/login',
		method: 'post',
		data
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