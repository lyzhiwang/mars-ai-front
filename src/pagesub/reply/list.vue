<template>
<view class="page2">
	<button class="create" @click="goTo('/pagesub/reply/crt')">
		<image src="/static/images/reply/icon-create.png" class="icon-crt"></image>
		<text>创建新项目</text>
	</button>
	<view class="panel">
		<view class="dele" @click="deleteItem"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view>
		<view class="fir">
			<view class="index">1</view>
			<u--text text="超级泰麻辣烫" :lines="1" size="30rpx" bold color="#333"></u--text>
		</view>
		<view class="con">
			<view class="status" @click="goTo('/pagesub/reply/add')">
				<text class="r">未创建回复</text>
				<u-icon name="arrow-right" size="34rpx" color="#999"></u-icon>
			</view>
		</view>
	</view>
	<view class="panel">
		<view class="dele" @click="deleteItem"><u-icon name="trash" size="34rpx" color="#fff"></u-icon></view>
		<view class="fir">
			<view class="index">1</view>
			<u--text text="超级泰麻辣烫" :lines="1" size="30rpx" bold color="#333"></u--text>
		</view>
		<view class="con">
			<view class="status" @click="goTo('/pagesub/reply/detail')">
				<text class="b">已创建回复</text>
				<u-icon name="arrow-right" size="34rpx" color="#999"></u-icon>
			</view>
		</view>
	</view>
</view>
</template>

<script setup>
const feedback = ref('')
function deleteItem(){
	
}
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
	.panel{
		width: 710rpx;
		min-height: 184rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		position: relative;
		margin: 15rpx 0;
		.fir{
			display: flex;
			align-items: center;
		}
		.con{
			margin-top: 20rpx;
			min-height: 80rpx;
			background: rgba(34,129,254,0.10);
			border-radius: 10rpx;
			padding: 24rpx 20rpx;
			font-size: 28rpx;
		}
		.index{
			width: 40rpx;
			height: 40rpx;
			background: #f2faff;
			border-radius: 50%;
			color: #2281fe;
			font-size: 32rpx;
			font-weight: 700;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 14rpx;
		}
		.dele{
			position: absolute;
			right: 0;
			top: 0;
			width: 53rpx;
			height: 53rpx;
			background: #2281fe;
			border-radius: 0 20rpx 0 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.status{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.b{
			font-size: 28rpx;
			color: #333;
		}
	}
}
</style>