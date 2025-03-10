<template>
	<view class="page">
		<view class="content">
			<view class="title-b">
				<view class="tit">上传音频素材</view>
				<view>上传一段音频，轻松打造专属个人特有的声音模型</view>
			</view>
			
			<view class="s-box">
				<view class="h_box">
					<view class="left">
						<view class="block"></view>
						<view class="name">选择方式</view>
					</view>
					<view class="right" @click="toPath('/pagesub/mine/index')">我的声音&nbsp; ></view>
				</view>
				
				<view class="menu">
					<view class="voice-box" @click="handleItem">
						<view class="m-btn">
							<image :src="`/static/images/mine/${playDataId? 'pause': 'play'}.png`" class="play"></image>
						</view>
						<view class="info">
							<view>{{useClone.upload_info.name}}</view>
							<view class="time">{{useClone.upload_info.created_at}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="tips_t">注: 每次克隆声音需消耗1000字符数.</view>
			<view class="btn2" @click="clone">添加声音克隆</view>
			
			<view class="tips">
				<p class="tit">语音克隆要求:</p>
				<p>1.上传的音频要求15~30秒，大小10M以内</p>
				<p>2.录制的过程确保环境安静没有明显噪音</p>
				<p>3.录制的过程不要长时间不说话，保证语速平稳</p>
				<p>4.录制的过程语调不要时高时低，保持音量均衡</p>
				<p>5.录制的过程避免出现其他人声</p>
				<p>6.要保证为原音录制不得对音频进行剪辑，更不可带背景音乐和音效</p>
				<p>7.我声明功能由账号本人使用，所上传视频数据为本人声音</p>
				<p>8.我同意将我上传视频样本用于算法模型训练</p>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad,onShow, onHide, onUnload } from '@dcloudio/uni-app'
	import { useCloneStore } from '@/stores'
	import { beginCloneIndex } from '@/api'
	
	const data = ref(
		{ id: 1,type: 1, num: 9, name: '音频-小刘', time: '2025-01-14 10:30:27',
		 upload: {
			full_path: 'https://ws-mars.oss-cn-beijing.aliyuncs.com/voice/2024-09-10/8dec7e19-cf2a-4043-8c8f-6adc7febbfee.MP3' 
		 },
		path: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20230227/eomj/1677483215080.wav', remark: '备注：克隆音色训练失败（预检失败，无声音频）' }
	)
	const useClone = useCloneStore()
	// 播放中数据
	const playDataId = ref(null) 
	let innerAudioContext = null
	
	const handleItem = () =>{
		if(!innerAudioContext){
			innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.onEnded(()=>{
				playDataId.value = null
			})
		}
		if(playDataId.value === null){
			playDataId.value = useClone.upload_info.upload_id
			// 播放
			innerAudioContext.src = useClone.upload_info.path;
			innerAudioContext.play();
		}else{
			if(playDataId.value === useClone.upload_info.upload_id){
				// 当前播放暂停
				innerAudioContext.stop();
				playDataId.value = null	
				
			}else{
				innerAudioContext.stop();
				playDataId.value = useClone.upload_info.upload_id
				innerAudioContext.src = useClone.upload_info.path;
				// 播放
				innerAudioContext.play();
			}
		}
	}
	
	const clone = ()=>{
		beginCloneIndex({upload_id: useClone.upload_info.upload_id, name: useClone.upload_info.name}).then(res =>{
			uni.showToast({title: '操作成功!', icon: 'success', duration: 1500});
			setTimeout(uni.redirectTo({url: '/pagesub/mine/index'}), 1500)
		})
	}
	
	const toPath = url =>{
		uni.navigateTo({
			url
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
	
</script>

<style lang="scss" scoped>
	.page{
		background: #f5f5f5;
		min-height: 100vh;
		.content{
			padding: 0 30rpx;
			box-sizing: border-box;
			.title-b{
				font-size: 24rpx;
				font-weight: bold;
				color: #999999;
				padding: 30rpx 0;
				.tit{
					font-size: 30rpx;
					font-weight: 700;
					color: #282828;
					margin-bottom: 26rpx;
				}
			}
			.s-box{
				width: 100%;
				min-height: 100rpx;
				background: #ffffff;
				border-radius: 20rpx;
				padding: 31rpx 28rpx;
				box-sizing: border-box;
				.h_box{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.left{
						display: flex;
						align-items: center;
						font-size: 30rpx;
						font-weight: 700;
						color: #282828;
						.block{
							width: 6rpx;
							height: 25rpx;
							background: #2281fe;
							border-radius: 3rpx;
							margin-right: 14rpx;
						}
					}
					.right{
						font-size: 28rpx;
						font-weight: 400;
						color: #ff9b39;
					}
				}
				
				.menu{
					width: 100%;
					// height: 300rpx;
					background: #f7f9ff;
					border: 2rpx dashed #6185fb;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 22rpx;
					font-weight: 400;
					padding: 25rpx 20rpx;
					box-sizing: border-box;
					color: #666666;
					margin-top: 25rpx;
					.voice-box{
						width: 100%;
						height: 100rpx;
						background: #e9eeff;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
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
			
			.tips{
				padding: 42rpx 32rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				font-weight: 400;
				color: #9e9e9e;
				line-height: 49rpx;
				.tit{
					font-size: 30rpx;
				}
			}
			.tips_t{
				text-align: center;
				font-size: 28rpx;
				padding-top: 30rpx;
				color: red;
			}
		}
	}
</style>