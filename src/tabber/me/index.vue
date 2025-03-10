<template>
<view class="page">
	<u-image width="100%" :height="517" src="/static/images/me/bg.png"></u-image>
	<view class="user_box">
		<view :style="{marginTop: `${config.statusBar}px`}"></view>
		<view class="title">个人中心</view>
		<view class="info-box" v-if="user.isLogin">
			<image src="/static/images/me/avatar.png" class="avatar"></image>
			<view class="user_b user_b1">
				<view>
					<view class="username">{{user.info.name}}</view>
					<view class="id">ID：{{user.info.userId}}</view>
					<view class="time">有效期：{{dayjs(user.info.start_time).format('YYYY-MM-DD')}}~{{dayjs(user.info.end_time).format('YYYY-MM-DD')}}</view>
				</view>
				<view class="exitBtn" @click="user.logOut">
					退出登录
					<!-- <u-button plain type="primary" shape="circle" class="exit" @click="user.logOut">退出登录</u-button> -->
				</view>
			</view>
		</view>
		<view class="info-box" v-else @click="goToLogin">
			<u-avatar class="avatar" :text="user.info.name.slice(0,1)" fontSize="44rpx" size="120rpx" randomBgColor></u-avatar>
			<view class="user_b">
				<view class="username">您还未登录</view>
				<view class="id">请点击登录</view>
			</view>
		</view>
		
		<view class="user_data">
			<view class="d_box">
				<view class="value">{{user.info.f_byte_used || 0}}</view>
				<view>已用字符</view>
			</view>
			<view class="d_box">
				<view class="value">{{user.info.f_byte || 0}}</view>
				<view>总字符</view>
			</view>
			<view class="d_box">
				<view class="value">{{user.info.voiceNum || 0}}</view>
				<view>我的音色</view>
			</view>
		</view>
	</view>
	
	<view class="menus_box">
		<view class="s_box">
			<view class="tit">
				<view class="block"></view>我的设置
			</view>
			<view class="s_m_b">
				<view class="menu_item" @click="goTo('/pagesub/mine/index')">
					<image src="/static/images/me/s_1.png" class="icon"></image>
					<view>声音管理</view>
				</view>
				<view class="menu_item" @click="goTo('/pagesub/mine/logs')">
					<image src="/static/images/me/s_2.png" class="icon"></image>
					<view>用量管理</view>
				</view>
				<view class="menu_item" @click="showPwdPop = true" v-if="user.isLogin">
					<image src="/static/images/me/s_3.png" class="icon"></image>
					<view>修改密码</view>
				</view>
				<view class="menu_item" @click="toPath('/pagesub/other/feedback')">
					<image src="/static/images/me/s_4.png" class="icon"></image>
					<view>用户反馈</view>
				</view>
				<view class="menu_item" v-if="!user.isLogin">
				</view>
			</view>
		</view>
		
		<view class="s_box">
			<view class="tit">
				<view class="block"></view>其他
			</view>
			<view class="s_m_b">
				<view class="menu_item" @click="toPath('/pagesub/other/policy')">
					<image src="/static/images/me/o_1.png" class="icon"></image>
					<view>服务协议</view>
				</view>
				<view class="menu_item" @click="toPath('/pagesub/other/about')">
					<image src="/static/images/me/o_2.png" class="icon"></image>
					<view>关于我们</view>
				</view>
				<view class="menu_item" @click="toVersion">
					<image src="/static/images/me/o_3.png" class="icon"></image>
					<view>版本号</view>
				</view>
				<view class="menu_item" @click="deleteUser" v-if="user.isLogin&&is_ios">
					<image src="/static/images/me/o_4.png" class="icon"></image>
					<view>注销用户</view>
				</view>
				<view class="menu_item" v-else>
				</view>
			</view>
		</view>
	</view>
	<!-- 修改密码弹窗 -->
	<u-modal :show="showPwdPop" title="修改密码" showCancelButton @confirm="changePwdConfirm" @cancel="showPwdPop = false">
		<u--input
		    placeholder="请输入您的新密码"
		    border="surround"
		    v-model="password"
			type="password"
		></u--input>
	</u-modal>
</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useUserStore, useLiveStore, useConfigStore } from '@/stores/index'
import { closeWebsocket } from '@/utils/socket'
import { goTo } from '@/utils/helper.js'
import { changePwd } from '@/api'
import dayjs from 'dayjs';

const user = useUserStore()
const config = useConfigStore()
const live = useLiveStore()
const showPwdPop = ref(false)
const password = ref('')
const is_ios = (plus.os.name === 'iOS');

function goToLogin(){
	uni.navigateTo({url: '/pagesub/login/index'})
}
function changePwdConfirm(){
	if(!password.value) return uni.showToast({title: '密码不能为空', icon: 'none'})
	changePwd(user.info.userId, {password: password.value}).then(res=>{
		if(res){
			showPwdPop.value = false
			uni.showToast({title: '修改密码成功', icon: 'success', duration: 1500})
			setTimeout(()=>{
				user.logOut()
				goToLogin()
			}, 1500)
		}
	})
}
function deleteUser(){
	uni.showModal({
		title: '警告',
		content: '注销用户操作，将删除当前登录账号的所有相关数据和资料，请谨慎操作是否继续？',
		confirmText: '确定',
		showCancel: true,
		success: res => {
			if(res.confirm){
				user.logOut();
				uni.showToast({title: '注销成功', icon: 'success', duration: 2000});
			}
		}
	})
}
onShow(()=>{
	// closeWebsocket()
	if(user.isLogin) user.getUserInfo()
})

function toPath(url){
	uni.navigateTo({
		url
	})
}

function toVersion(){
	console.log('config.app_version', config.app_version)
	uni.showToast({title: `v: ${config.app_version}`, icon: 'none', duration: 2000});
	// uni.showModal({
	// 	title: '版本号',
	// 	content: config.app_version,
	// 	confirmText: '确定',
	// 	showCancel: true,
	// 	// success: res => {
	// 	// 	if(res.confirm){
	// 	// 		user.logOut();
	// 	// 		uni.showToast({title: '注销成功', icon: 'success', duration: 2000});
	// 	// 	}
	// 	// }
	// })
	
}
</script>

<style lang="scss" scoped>
.page{
	background: #f5f5f5;
	min-height: 100vh;
	position: relative;
	.user_box{
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		.title{
			margin-top: 58rpx;
			font-size: 34rpx;
			font-weight: bold;
			text-align: center;
			color: #212121;
		}
		.info-box{
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 69rpx 31rpx 46rpx 31rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #282828;
			.user_b1{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.avatar{
				width: 117rpx;
				height: 117rpx;
				margin-right: 32rpx;
				flex-shrink: 0;
			}
			.username{
				font-size: 36rpx;
				font-weight: 700;
				color: #282828;
			}
			.id{
				padding: 6rpx 0;
			}
			.exitBtn{
				width: 140rpx;
				height: 50rpx;
				border-radius: 25rpx;
				border: 1rpx solid blue;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	
	.user_data{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin-bottom: 48rpx;
		.d_box{
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			.value{
				font-size: 32rpx;
				font-weight: 700;
				color: #282828;
				margin-bottom: 23rpx;
			}
		}
	}
	
	.menus_box{
		width: 100%;
		padding: 0 29rpx;
		.s_box{
			width: 100%;
			min-height: 270rpx;
			background: #ffffff;
			border-radius: 20rpx;
			margin-bottom: 30rpx;
			.tit{
				display: flex;
				align-items: center;
				padding-top: 38rpx;
				padding-left: 31rpx;
				font-size: 30rpx;
				font-weight: 700;
				color: #282828;
				.block{
					width: 6rpx;
					height: 25rpx;
					background: #2153fb;
					border-radius: 3rpx;
					margin-right: 14rpx;
				}
			}
			.s_m_b{
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin-top: 36rpx;
				.menu_item{
					width: 24%;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 24rpx;
					font-weight: 400;
					color: #333333;
				}
				.icon{
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 15rpx;
				}
			}
		}
	}
}
</style>