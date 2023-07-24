<template>
	<view class="container content">
		<view class="txtBox">
			<u--textarea v-model="value1" placeholder="请输入内容" count height="616" maxlength="5000"></u--textarea>
			<view class="export" @click="goTo('/pagesub/voices/taskStore')">导入文档</view>
		</view>
		
		<view class="mediaBox">
			<AudioQuickPlay ref="audioQuickPlay" :url="voicePath" @ended="isPlay=false"></AudioQuickPlay>
			<view class="fcc-sb">
				<view class="btn btn1 flex-rcc" @click="playVoice">
					<image :src="`/static/images/voices/${isPlay? 'pause': 'play'}-w.png`"></image>
					试听
				</view>
				<view class="btn flex-rcc">
					<image src="/static/images/voices/save.png"></image>
					保存音频
				</view>
			</view>
		</view>
		
		<view class="recordBox flex-cc">
			<image src="/static/images/voices/record.png" @click="handleRecord"></image>
			<view class="tips">点击开始录音，再次点击结束录音</view>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import AudioQuickPlay from '@/components/audioQuickPlay/index.vue'
	
	const value1 = ref('开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段')
	const list = ref([
		{
			id: 1,
			type: 1,
			name: '开播第一段开播第一段开播第一段开播第一段开播第一段开播第一段'
		},
		{
			id: 2,
			type: 2,
			name: '开播第二段'
		},
		{
			id: 3,
			type: 2,
			name: '开播第三段'
		}
	])
	
	const voicePath = ref(null)
	
	const show = ref(false)
	const content = ref('请确认删除该语音?')
	
	const delItem = item =>{
		show.value = true
	}
	
	// 播放中数据
	const playDataId = ref(null) 
	
	const handleItem = item =>{
		if(playDataId.value === null){
			playDataId.value = item.id
			// 播放
		}else{
			if(playDataId.value === item.id){
				// 当前播放暂停
				playDataId.value = null
			}else{
				playDataId.value = item.id
				// 播放
			}
		}
		
	}
	const recorderManager = ref(null);
	const innerAudioContext = ref(null);
	
	onLoad(()=>{
		// 初始化录音
		recorderManager.value = uni.getRecorderManager();
		// 初始化播放器
		innerAudioContext.value = uni.createInnerAudioContext();
		innerAudioContext.value.autoplay = true;
		// 获取音频信息
		innerAudioContext.value.onCanplay(res=>{
			console.log('res音频',JSON.stringify(res))
		})
		
		// 音频停止事件
		innerAudioContext.value.onStop(function (res){
			isPlay.value = false
			uni.$u.toast('播放结束!')
		})
		
		recorderManager.value.onStop(function (res) {
			console.log('recorder stop' + JSON.stringify(res));
			voicePath.value = res.tempFilePath;
		});
	}) 
	
	const isRecord = ref(false)
	
	const handleRecord = ()=>{
		isRecord.value = !isRecord.value
		// 震动后开始
		uni.vibrateLong({
			success:()=>{
				if(isRecord.value){
					console.log('recorderManager.value', recorderManager.value)
					uni.showToast({
						title: '录音开始!',
						icon: 'success',
						duration: 1500,
						success() {
							recorderManager.value.start();
						}
					})
					
				}else{
					console.log('recorderManager.value222', recorderManager.value)
					uni.showToast({
						title: '录音完成!',
						icon: 'success',
						duration: 1500,
						success() {
							recorderManager.value.stop();
						}
					})
				}
			}
		})
	}
	
	// 播放录音
	const audioQuickPlay = ref(null)
	const isPlay = ref(false)
	const playVoice = ()=>{
		if(voicePath.value){
			isPlay.value = !isPlay.value
			if(voicePath.value){
				// innerAudioContext.value.src = voicePath.value;
				if(isPlay.value){
					audioQuickPlay.value.play()
					// innerAudioContext.value.play();
				}else{
					audioQuickPlay.value.stop()
					// innerAudioContext.value.pause();
				}
				
			}	
		}else{
			uni.$u.toast('请录音完成后试听!')
		}
	}
	
	const ok = ()=>{
		show.value = false
	}
</script>

<style lang="scss" scoped>
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  
	  .txtBox{
		  width: 100%;
		  height: 616rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  .u-textarea{
		  		  padding-bottom: 50rpx !important;
		  }
		  .export{
			  background-color: #ffffff;
			  position: absolute;
			  font-size: 28rpx;
			  font-weight: bold;
			  color: #2281fe;
			  padding: 5rpx;
			  border-radius: 5rpx;
			  margin-top: -50rpx;
			  margin-left: 10rpx;
			  z-index: 99999;
		  }
	  }
	  .mediaBox{
		  width: 100%;
		  padding-top: 80rpx;
		  .btn{
			  width: 336rpx;
			  height: 98rpx;
			  font-size: 36rpx;
			  background: #e8f2ff;
			  border: 1rpx solid #2281fe;
			  border-radius: 10rpx;
			  color: #333333;
			  image{
				  width: 40rpx;
				  height: 40rpx;
				  margin-right: 13rpx;
			  }
		  }
		  .btn1{
			  background: #2281fe;
			  color: #ffffff;
		  }
	  }
	  .recordBox{
		  width: 100%;
		  padding: 54rpx 0 44rpx 0;
		  image{
			  width: 180rpx;
			  height: 180rpx;
		  }
		  .tips{
			  padding-top: 34rpx;
			  font-size: 24rpx;
			  color: #333333;
			  line-height: 6rpx;
		  }
	  }
	}
</style>