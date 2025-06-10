<template>
<view class="page">
	<view class="h1">请先选择直播方式</view>
	<view class="panel">
		<view class="li" @click="goTo('/tabber/live/index')">
			<image src="/static/images/live/bg_1.png" class="bg"></image>
			<view class="c-box">
				<view class="name">AI专业直播</view>
				<view class="create">
					<view class="block">
						<u-icon name="plus" color="#2979ff" size="15"></u-icon>
					</view>
					创建直播
				</view>
				<view class="desc">{{desc.pt}}</view>
			</view>
			
		</view>
		<view class="li" @click="selectHigh">
			<image src="/static/images/live/bg_2.png" class="bg"></image>
			<view class="c-box">
				<view class="name">AI高级直播</view>
				<view class="create">
					<view class="block">
						<u-icon name="plus" color="#2979ff" size="15"></u-icon>
					</view>
					创建直播
				</view>
				<view class="desc">{{desc.vip}}</view>
			</view>
		</view>
		
		<view class="li" @click="toLiving">
			<image src="/static/images/live/bg_3.png" class="bg"></image>
			<view class="c-box">
				<view class="name">AI实时直播</view>
				<view class="create">
					<view class="block">
						<u-icon name="plus" color="#2979ff" size="15"></u-icon>
					</view>
					创建直播
				</view>
				<view class="desc">{{desc.strong}}</view>
			</view>
		</view>
	</view>
</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { getLiveRoom, getLiveDesc } from '@/api'
import { goTo } from '@/utils/helper.js'

let flag = false
const desc = reactive({
	pt: 'AI语音库  |  智能回复  |  公屏互动',
	vip: 'AI语音库  |  智能回复  |  直播间搭建  |  公屏互动  |  自动弹商品卡片',
	strong: '实时播报  |  AI话术  |  智能控场  |  氛围引导  |  真人级音色'
})
function selectHigh(){
	if(flag) return
	flag = true
	getLiveRoom({type: 2}).then(res=>{
		if(res && res.data){
			if(res.data.platform===3) return goTo('/pagesub/live/create2')
			console.log('res.data', res.data)
			// const { get_top, get_left, get_right, get_bottom } = res.data
			// live.setLiveRoomStick({
			// 	top: get_top ? [{status: 'success', message: '', url: get_top.full_path, id: get_top.id}] : [],
			// 	left: get_left ? [{status: 'success', message: '', url: get_left.full_path, id: get_left.id}] : [],
			// 	right: get_right ? [{status: 'success', message: '', url: get_right.full_path, id: get_right.id}] : [],
			// 	bottom: get_bottom ? [{status: 'success', message: '', url: get_bottom.full_path, id: get_bottom.id}] : []
			// })
			uni.showModal({
				title: '提示',
				content: '检测到您最近有创建过AI高级直播间, 是否使用最近一次的配置直接开始直播？',
				confirmText: '确定',
				showCancel: true,
				success: res => {
					const path = res.confirm ? 'sticker' : 'create2'
					goTo('/pagesub/live/'+path, ()=>{
						flag = false
					})
					
				}
			})
		}else{
			goTo('/pagesub/live/create2', ()=>{
				flag = false
			})
		}
	}).catch(()=>{
		goTo('/pagesub/live/create2', ()=>{
			flag = false
		})
	})
}

const toLiving = ()=>{
	goTo('/pagesub/living/menu', ()=>{
		flag = false
	})
}

onLoad(()=>{
	// getLiveDesc().then(res=>{
	// 	if(res && res.data){
	// 		desc.pt = res.data.pt
	// 		desc.vip = res.data.vip
	// 	}
	// })
})
</script>

<style lang="scss" scoped>
.page{
	width: 750rpx;
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #f8f8f8;
	overflow-x: hidden;
	.h1{
		width: 100%;
		height: 148rpx;
		line-height: 148rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		color: #333333;
	}
	.panel{
		width: 100%;
		padding: 0 28rpx;
		box-sizing: border-box;
		min-height: 854rpx;
		.li{
			width: 100%;
			height: 271rpx;
			position: relative;
			margin-bottom: 40rpx;
			.bg{
				width: 100%;
				height: 100%;
			}
			.c-box{
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: 1;
				top: 0;
				left: 0;
				.name{
					font-size: 42rpx;
					font-weight: bold;
					color: #333333;
					letter-spacing: 6.3rpx;
					margin: 52rpx 0 0 40rpx;
				}
				.create{
					width: 100%;
					display: flex;
					align-items: center;
					font-size: 26rpx;
					font-weight: 400;
					color: #ffffff;
					margin: 26rpx 0 0 75rpx;
					.block{
						width: 25rpx;
						height: 25rpx;
						background: linear-gradient(0deg,#f5f5f5 0%, #ffffff 100%);
						border-radius: 4rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 10rpx;
					}
				}
				.desc{
					margin-left: 26rpx;
					margin-top: 32rpx;
					font-size: 22rpx;
					font-weight: 400;
					color: #666666;
					line-height: 50rpx;
				}
			}
		}
	}
}
</style>