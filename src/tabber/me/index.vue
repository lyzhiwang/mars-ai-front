<template>
<view class="page">
	<u-image width="100%" :height="410" src="/static/images/me/bg.jpg"></u-image>
	<view class="infoBox" v-if="user.isLogin">
		<u-avatar class="avatar" :text="user.info.name.slice(0,1)" fontSize="44rpx" size="120rpx" randomBgColor></u-avatar>
		<view class="username">
			<view class="account">{{user.info.name}}</view>
			<view class="id">ID:{{user.info.userId}}</view>
		</view>
		<u-button plain type="primary" shape="circle" class="exit" @click="user.logOut">退出登录</u-button>
	</view>
	<view class="infoBox" v-else @click="goToLogin">
		<u-avatar url="" size="120rpx"></u-avatar>
		<view class="username">
			<view class="account">您还未登录</view>
			<view class="id">请点击登录</view>
		</view>
	</view>
	<div class="function">
		<u-cell-group :border="false">
			<!-- <u-cell title="兑换码" size="large" isLink url="">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/exchange.png"></u-image>
				</template>
			</u-cell> -->
			<u-cell title="关于我们" size="large" isLink url="/pagesub/other/about">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/about.png"></u-image>
				</template>
			</u-cell>
			<u-cell title="反馈" size="large" isLink url="/pagesub/other/feedback">
				<template #icon>
					<u-image :width="35" :height="35" src="/static/images/me/feedback.png"></u-image>
				</template>
			</u-cell>
		</u-cell-group>
	</div>
</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/index'

const user = useUserStore()

function goToLogin(){
	uni.navigateTo({url: '/pagesub/login/index'})
}
onShow(()=>{
	if(user.isLogin) user.getUserInfo()
})
</script>

<style lang="scss" scoped>
.page{
	background: #f8f8f8;
	min-height: 100vh;
	position: relative;
	.infoBox{
		display: flex;
		align-items: center;
		padding: 172rpx 20rpx 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		.avatar{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 2rpx solid #ffffff;
			flex-shrink: 0;
		}
		.username{
			flex: 1;
			margin: 0 20rpx;
			color: #fff;
		}
		.exit{
			width: 160rpx;
			height: 60rpx;
			background-color: #fff;
			font-size: 26rpx;
			color: #1e64fe;
			font-weight: 700;
		}
		.account{
			font-weight: 700;
			font-size: 36rpx;
		}
		.id{
			margin-top: 8rpx;
			font-size: 32rpx;
		}
	}
	.function{
		width: 710rpx;
		margin: -48rpx auto 0;
		background-color: #fff;
		position: relative;
		z-index: 1;
		border-radius: 20rpx;
		overflow: hidden;
		// box-shadow: 0 0 20rpx #ccc;
	}
}
</style>