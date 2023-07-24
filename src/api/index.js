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

// 创建回复分类
export function crtReplyClass(data) {
	return request({
		loading: true,
		url: '/v1/answer',
		method: 'post',
		data
	})
}

// 添加关键字
export function addKeyword(data){
	return request({
		loading: true,
		url: '/v1/ans/add/title',
		method: 'post',
		data
	})
}
// 编辑关键字
export function editKeyword(id, data){
	return request({
		loading: true,
		url: `/v1/ans/edit/keyword/${id}`,
		method: 'put',
		data
	})
}
// 回复分类列表
export function replyClassList(params){
	return request({
		url: '/v1/answer',
		method: 'get',
		params
	})
}

// 回复列表
export function replyList(id, params){
	return request({
		url: `/v1/answer/keywords/${id}`,
		method: 'get',
		params
	})
}

// 删除回复分类
export function deleReplyClass(id){
	return request({
		url: `/v1/answer/${id}`,
		method: 'delete',
	})
}

// 删除回复列表
export function deleReply(id){
	return request({
		url: `/v1/destory/keywords/${id}`,
		method: 'delete',
	})
}

// 语音库列表
export function voiceIndex(params) {
	return request({
		url: '/v1/voice',
		method: 'get',
		params
	})
}

// 创建Ai语音库
export function voiceStore(data) {
	return request({
		url: '/v1/voice',
		method: 'post',
		data
	})
}

// 删除Ai语音库
export function voiceDestory(params) {
	return request({
		url: '/v1/voice'+ params.id,
		method: 'delete'
	})
}

// 编辑Ai语音库
export function voiceUpdate(data) {
	return request({
		url: '/v1/voice',
		method: 'put',
		data
	})
}

// 语音库内语音列表
export function voiceReaIndex(params) {
	return request({
		url: '/v1/voice/rea',
		method: 'get',
		params
	})
}

// 语音库内语音创建
export function voiceReaCreate(params) {
	return request({
		url: '/v1/voice/rea',
		method: 'post',
		params
	})
}

// 语音库内语音列表
export function voiceReaDestory(params) {
	return request({
		url: '/v1/voice/rea/'+params.id,
		method: 'delete',
	})
}