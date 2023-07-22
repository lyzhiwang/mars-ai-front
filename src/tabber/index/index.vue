<template>
	<view class="content">
		<view class="header" :style="{paddingTop: `${config.statusBar}px`}">
			<image src="/static/logo.png" class="logo"></image>
			<text>火星AI无人直播1111</text>
		</view>
		<view class="swiperBox">
			<u-swiper
				:list="swiperList"
				autoplay
				circular
				width="100%"
				height="100%"
			></u-swiper>
		</view>
		
		<view class="menus flex" >
			<view class="voiceBox">
				<image src="/static/images/voice.png"></image>
				<view class="name">
					<view>AI语音库</view>
					<view class="line"></view>
				</view>
			</view>
			<view class="flex-cc fcc-sb">
				<view class="r-box" @click="goTo('/pagesub/reply/list')">
					<image src="/static/images/reply.png"></image>
					<view class="name name1">
						<view>智能回复</view>
						<view class="line blue"></view>
					</view>
				</view>
				<view class="r-box">
					<image src="/static/images/tasks.png"></image>
					<view class="name name1">
						<view>话术库</view>
						<view class="line yellow"></view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { onLoad, onReady } from '@dcloudio/uni-app'
import { useConfigStore } from '@/stores'
import { goTo } from '@/utils/helper.js'

const config = useConfigStore()
// const title = ref('')
const swiperList = ref(['/static/images/banner.png','/static/images/banner.png','/static/images/banner.png'])

onLoad(()=>{

})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.swiperBox{
	width: 100%;
	height: 410rpx;
	box-sizing: border-box;
}
.header{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 136rpx;
	font-weight: bold;
	font-size: 36rpx;
	color: #060606;
	.logo{
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		margin: 0 20rpx;
	}
}

.menus{
	margin-top: 40rpx;
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
	justify-content: space-between;
	.line{
		width: 57rpx;
		height: 8rpx;
		background: #72d75b;
		border-radius: 4rpx;
		margin-top: 14rpx;
	}
	image{
		width: 100%;
		height: 100%;
	}
	.voiceBox{
		width: 345rpx;
		height: 304rpx;
		position: relative;
	}
	.name{
		top: 40rpx;
		left: 40rpx;
		position: absolute;
		font-size: 36rpx;
		color: #333333;
	}
	.name1{
		top: 35rpx;
		left: 30rpx;
	}
	.r-box{
		width: 344rpx;
		height: 145rpx;
		position: relative;
	}
	.blue{
		background-color: #5CD3BF;
	}
	.yellow{
		background-color: #F4AE34;
	}
}
</style>
