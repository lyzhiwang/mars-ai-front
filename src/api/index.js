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
// 七牛云token
export function qiniuToken(params){
	return request({
		url: '/v1/common/qiniu/token',
		method: 'get',
		params
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
export function changePwd(id, data) {
	return request({
		loading: true,
		url: `/v1/admin/${id}`,
		method: 'patch',
		data
	})
}

// userinfo
export function getUserInfo(params) {
	return request({
		url: '/v1/common/info',
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
// 回复添加语音
export function addVoiceAtReply(id, data){
	return request({
		loading: true,
		url: `v1/add/media/${id}`,
		method: 'post',
		data
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

// 删除回复内得语音
export function deleReplyVoice(id){
	return request({
		url: `/v1/del/media/${id}`,
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
		url: '/v1/voice/'+ params.id,
		method: 'delete'
	})
}

// 编辑Ai语音库
export function voiceUpdate(data) {
	return request({
		url: '/v1/voice/'+data.id,
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

// 话术库
export function scriptIndex() {
	return request({
		url: '/v1/script/library',
		method: 'get'
	})
}

// 语音库内语音-排序
export function voiceRelationSort(data) {
	return request({
		url: '/v1/voice/relation/sort',
		method: 'post',
		data
	})
}

// 获取直播间标题
export function getLiveTit(data){
	return request({
		loading: true,
		url: '/v1/get/live/title',
		method: 'post',
		data
	})
}

// 开启直播间
export function createLiveRoom(data){
	return request({
		loading: true,
		url: '/v1/store/live',
		method: 'post',
		data
	})
}

// 获取直播间信息
export function getLiveRoom(){
	return request({
		loading: true,
		url: '/v1/get/live',
		method: 'get',
	})
}

// 获取最新APP版本
export function getAppVersion(){
	return request({
		url: '/version',
		method: 'get',
	})
}

// 反馈
export function sendFeedBack(data){
	return request({
		loading: true,
		url: '/v1/feedback',
		method: 'post',
		data
	})
}
