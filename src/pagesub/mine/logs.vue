<template>
	<view class="page">
		<view class="header-b">
			<u-image width="100%" :height="421" src="/static/images/me/log_bg.png"></u-image>
			<view class="info">
				<view :style="{marginTop: `${config.statusBar}px`}"></view>
				<view class="title"><u-icon name="arrow-left" color="#212121" size="36" class="icon" @click="back"></u-icon>用量管理</view>
				<view class="i-d">
					<view class="c-b">
						<image src="/static/images/me/d_1.png"></image>
						<view class="m-b">
							<view>总字符</view>
							<view class="data">{{user.info.f_byte}}字符</view>
						</view>
					</view>
					
					<view class="c-b">
						<image src="/static/images/me/d_2.png"></image>
						<view class="m-b">
							<view>已使用字符</view>
							<view class="data">{{user.info.f_byte_used}}字符</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="list">
			<view class="list-c">
				<view class="title">
					<image src="/static/images/me/log_bg2.png"></image>
					<view class="tit-tip">使用<text>明细</text></view>
				</view>
				
				<template v-if="data.length">
					<view class="item" v-for="(item,index) in data" :key="index">
						<view class="l-c">
							<view class="tit">{{item.remark}}</view>
							<view>{{item.created_at}}</view>
						</view>
						<view class="r-c" :style="{color: item.type===1? '#F56C6C': '#67C23A'}">{{item.type===1? '-': '+'}}{{item.byte_count}}字符</view>
					</view>
					<u-loadmore :status="status" fontSize="28" style="padding-bottom: 20rpx;"/>
				</template>
				<u-empty v-else mode="data" text="暂无记录!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onShow, onReachBottom } from '@dcloudio/uni-app'
	import { useConfigStore, useUserStore } from '@/stores/index'
	import { userCharLog } from '@/api'
	
	onShow(()=>{
		init()
		getList(true)
	})
	
	const config = useConfigStore()
	const user = useUserStore()
	
	const data = ref([
		// {type: '声音克隆', time: '2024.10.31 12:31:6', num: '375'},
		])
	const status = ref('loadmore')
	const params = ref({
		page: 1,
		size: 10
	})
	const total = ref(0)
	
	
	const getList =(init)=>{
		userCharLog(params.value).then(res=>{
			data.value = init ? res.data.list : data.value.concat(res.data.list) 
			total.value = res.data.total
			if(data.value.length>=res.data.total) status.value = 'nomore'
		})
	}
	
	const init = () =>{
		params.value = {
			page: 1,
			size: 10 
		}
		total.value = 0
		// data.value = []
	}
	
	const back = ()=>{
		uni.navigateBack()
	}
	
	// 页面触底加载下一页
	onReachBottom(()=>{
		if(data.value.length<total.value){
			params.value.page++
			getList()
		}
	})
	
</script>

<style lang="scss" scoped>
	.page{
		background: #f5f5f5;
		min-height: 100vh;
		.header-b{
			width: 100%;
			height: 421rpx;
			position: relative;
			.info{
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				.title{
					font-size: 34rpx;
					font-weight: bold;
					text-align: center;
					color: #212121;
					margin-top: 60rpx;
					position: relative;
					.icon{
						position: absolute;
						left: 35rpx;
						top: 10rpx;
					}
				}
			}
			
			.i-d{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 74rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				.c-b{
					width: 332rpx;
					height: 181rpx;
					position: relative;
					image{
						width: 100%;
						height: 100%;
					}
					.m-b{
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						font-size: 24rpx;
						font-weight: 400;
						color: #666666;
						padding: 39rpx 0 0 41rpx;
						.data{
							font-size: 32rpx;
							font-weight: 700;
							color: #282828;
							margin-top: 21rpx;
						}
					}
				}
			}
		}
		.list{
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			.list-c{
				width: 100%;
				min-height: 765rpx;
				background: #ffffff;
				border-radius: 20rpx;
				.title{
					width: 100%;
					height: 116rpx;
					position: relative;
					image{
						width: 100%;
						height: 100%;
					}
					.tit-tip{
						width: 100%;
						height: 100%;
						font-size: 30rpx;
						font-weight: 700;
						color: #282828;
						display: flex;
						align-items: center;
						padding-left: 40rpx;
						position: absolute;
						top: 0;
						left: 0;
						text{
							color: #f06a44;
						}
					}
				}
				.item{
					margin: 0 45rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1rpx solid #e9e9e9;
					padding: 20rpx 0;
					
					.l-c{
						font-size: 22rpx;
						font-weight: 400;
						color: #9e9e9e;
						.tit{
							font-size: 26rpx;
							font-weight: 700;
							color: #282828;
							margin-bottom: 15rpx;
						}
					}
					.r-c{
						font-size: 26rpx;
						font-weight: 700;
						color: #282828;
					}
				}
			}
		}
	}
</style>