<template>
<view class="page2">
	<button class="create" @click="goTo('/pagesub/reply/crt')">
		<image src="/static/images/reply/icon-msg.png" class="icon-crt"></image>
		<text>添加新回复</text>
	</button>
	<ReplyItem v-for="i in 6"></ReplyItem>
</view>
</template>

<script setup>
import ReplyItem from '@/components/ReplyItem'

const goTo = url => uni.navigateTo({url})
</script>

<style lang="scss" scoped>
.page2{
	padding: 2rpx 20rpx;
	min-height: 100vh;
	background: #f8f8f8;
	.create{
		width: 710rpx;
		height: 82rpx;
		background: #ffffff;
		border-radius: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx 0;
		font-size: 30rpx;
		color: #333;
		&:after{
			border: 0!important;
		}
		.icon-crt{
			width: 40rpx;
			height: 40rpx;
			margin-right: 14rpx;
		}
	}
}
</style>