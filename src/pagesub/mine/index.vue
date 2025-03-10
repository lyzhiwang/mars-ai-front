<template>
	<view class="page">
		<!-- <u-sticky bgColor="#f5f5f5">
			<u-tabs :list="list1" :lineWidth="35" :lineHeight="5" :activeStyle="{ color: '#2281FE' }" @click="toggle"></u-tabs>
		</u-sticky> -->
		
		<view class="list">
			
			<template v-if="list.length">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="status-box">
						<view class="s-box">
							<image :src="`/static/images/mine/bg${item.status===1? 1: item.status===2? 2:3}.png`"></image>
							<view class="status-tit">{{item.status===1? '正在克隆': item.status===2?'克隆成功': '制作失败'}}</view>
						</view>
						<!-- <view class="num" v-if="item.num">剩余次数：{{item.num}}</view> -->
						<view class="clone" v-if="item.status===1">克隆中…</view>
						<view class="clone" v-else></view>
					</view>
					<view class="voice-box" style="margin-top: 10rpx;" @click="handleItem(item)">
						<view class="m-btn">
							<image :src="`/static/images/mine/${item.id === playDataId? 'pause': 'play'}.png`" class="play"></image>
						</view>
						<view class="info">
							<view>{{item.name}}</view>
							<view class="time">{{item.created_at}}</view>
						</view>
					</view>
					<!-- <view class="remark">{{item.remark}}</view> -->
					<view class="btns-box">
						<view class="btn" v-if="item.status===1" @click="refresh(item)"><image src="/static/images/mine/ref.png" class="icon"></image>刷新</view>
						<view class="btn" style="margin-right: 20rpx;" @click="handleDel(item)"><image src="/static/images/mine/del.png" class="icon"></image>删除</view>
					</view>
				</view>
				
				<u-loadmore :status="status" fontSize="28" style="padding-bottom: 20rpx;"/>
			</template>
			<u-empty v-else mode="data" text="暂无克隆记录!" :marginTop="160" iconSize="160" textSize="28" style="width: 100%;"></u-empty>
			
			<view class="btn2" @click="goTo('/pagesub/mine/clone')">添加声音克隆</view>
			
			<!-- <template v-else>
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="voice-box" style="margin-top: 10rpx;" @click="handleItem(item)">
						<view class="m-btn">
							<image :src="`/static/images/mine/${item.id === playDataId? 'pause': 'play'}.png`" class="play"></image>
						</view>
						<view class="info">
							<view>{{item.name}}</view>
							<view class="time">{{item.time}}</view>
						</view>
					</view>
					<view class="btns-box">
						<view class="btn" style="margin-right: 20rpx;" @click="handleDel(item)"><image src="/static/images/mine/del.png" class="icon" ></image>删除</view>
					</view>
				</view>
			</template> -->
			
		</view>
		
		<u-modal :show="show" title="提示" :content='content' showCancelButton @confirm="ok" @cancel="show=false"></u-modal>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onHide, onUnload, onReachBottom } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import { voiceCloneIndex, delVoiceClone } from '@/api'
	
	// const list1 = ref([{name: '声音克隆',value: 1}, {name: '我的素材',value: 2}])
	const type = ref(1)
	const show = ref(false)
	const content = ref('请确认删除该音频?')
	const list = ref([])
	let innerAudioContext = null
	const status = ref('loadmore')
	const params = ref({page: 1, size: 10})
	const total = ref(0)
	
	onShow(()=>{
		list.value =  []
		getList()
	})
	
	const getList = ()=>{
		voiceCloneIndex(params.value).then(res =>{
			list.value = list.value.concat(res.data.list) 
			total.value = res.data.total
			if(list.value.length>=res.data.total) status.value = 'nomore'
		})
	}
	
	const init = ()=>{
		params.value.page = 1
		total.value = 0
		list.value =  []
		getList()
	}
	
	const toggle = data =>{
		playDataId.value = null
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		} 	
		type.value = data.value
	}
	
	
	// 刷新
	const refresh = item =>{
		uni.showLoading({
			title: '刷新中...'
		})
		init()
		// voiceDestory({id: currentId.value}).then(res=>{
		// 	uni.showToast({title: '删除成功!',icon: 'success',duration: 2000});
		// 	uni.hideLoading()
		// })
		setTimeout(()=>{
			uni.hideLoading()
		},2000)
	}
	
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const handleItem = item =>{
		console.log('item', item)
		// if(!item.voice_url) return uni.showToast({title: 'AI语音正在生成中,请稍后!',icon: 'none',duration: 2000});
		if(!innerAudioContext){
			innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.onEnded(()=>{
				playDataId.value = null
			})
		}
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
			innerAudioContext.src = item.voice_url;
			innerAudioContext.play();
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				innerAudioContext.stop();
				playDataId.value = null	
				
			}else{
				innerAudioContext.stop();
				playDataId.value = item.id
				innerAudioContext.src = item.voice_url;
				// 播放
				innerAudioContext.play();
			}
		}
	}
	
	const currentId = ref(null)
	const handleDel = item =>{
		currentId.value = item.id
		show.value = true
	}
	const ok = ()=>{
		delVoiceClone({id: currentId.value}).then(res=>{
			uni.showToast({title: '删除成功!', icon: 'success',duration: 2000});
			show.value = false
			const index = list.value.findIndex(v=> {return v.id === currentId.value})
			if(index>-1) list.value.splice(index, 1)
		})
	}
	
	
	onHide(()=>{
		playDataId.value = null
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		}
	})
	
	onUnload(()=>{
		playDataId.value = null
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		} 	
	})
	
	// 页面触底加载下一页
	onReachBottom(()=>{
		if(list.value.length<total.value){
			params.value.page++
			getList()
		}
	})
</script>

<style lang="scss" scoped>
	.page{
		background: #f5f5f5;
		min-height: 100vh;
		.list{
			width: 100%;
			box-sizing: border-box;
			padding: 21rpx 30rpx 30rpx 30rpx;
			.item{
				width: 100%;
				min-height: 170rpx;
				background: #ffffff;
				border-radius: 20rpx;
				margin-bottom: 30rpx;
				padding: 23rpx 17rpx;
				box-sizing: border-box;
				position: relative;
				.status-box{
					width: 100%;
					.s-box{
						width: 161rpx;
						height: 68rpx;
						position: absolute;
						top: 0;
						left: 0;
						image{
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
						}
						.status-tit{
							width: 161rpx;
							height: 68rpx;
							position: absolute;
							top: 0;
							left: 0;
							font-size: 26rpx;
							color: #fdfaf6;
							font-weight: 700;
							text-align: center;
							padding-top: 10rpx;
							z-index: 1;
						}
					}
					.num{
						width: 100%;
						display: flex;
						flex-direction: row-reverse;
						font-size: 26rpx;
						font-weight: 400;
						color: #416cfa;
					}
					.clone{
						width: 100%;
						height: 30rpx;
						display: flex;
						flex-direction: row-reverse;
						font-size: 26rpx;
						font-weight: 400;
						color: #ffa53b;
					}
				}
				.voice-box{
					width: 100%;
					height: 100rpx;
					background: #e9eeff;
					display: flex;
					align-items: center;
					border-radius: 20rpx;
					padding: 15rpx;
					box-sizing: border-box;
					.m-btn{
						width: 70rpx;
						height: 70rpx;
						background: #6185fb;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						margin-right: 16rpx;
						.play{
							margin-left: 3rpx;
							width: 23rpx;
							height: 27rpx;
						}
					}
					.info{
						font-size: 24rpx;
						font-weight: 400;
						color: #333333;
						.time{
							font-size: 22rpx;
							font-weight: 400;
							color: #666666;
							line-height: 35rpx;
						}
					}
				}
				.remark{
					width: 100%;
					height: 60rpx;
					background: #f6f6f6;
					border-radius: 10rpx;
					padding-left: 20rpx;
					margin-top: 15rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					font-size: 22rpx;
					color: #666666;
				}
				.btns-box{
					width: 100%;
					display: flex;
					margin-top: 20rpx;
					flex-direction: row-reverse;
					.btn{
						width: 130rpx;
						height: 52rpx;
						border: 2rpx solid #6185fb;
						border-radius: 28rpx;
						font-size: 26rpx;
						font-weight: 400;
						color: #6185fb;
						display: flex;
						align-items: center;
						justify-content: center;
						.icon{
							width: 24rpx;
							height: 26rpx;
							margin-right: 10rpx;
						}
					}
				}
			}
		}
		
		.btn2{
			width: 100%;
			height: 100rpx;
			background: #2281fe;
			border-radius: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			font-weight: 700;
			color: #ffffff;
			margin-top: 50rpx;
		}
	}
</style>