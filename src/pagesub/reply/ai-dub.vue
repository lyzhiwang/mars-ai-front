<template>
	<view class="container content">
		<view class="txtBox">
			<u--textarea v-model="form.content" placeholder="这里输入或粘贴需要配音的文字" count height="616" maxlength="5000"></u--textarea>
		</view>
		
		<view class="box">
			<view class="title">语音名称</view>
			<u--input
			    placeholder="请输入语音名称"
				v-model="form.title"
			    border="bottom"
			    clearable
			  ></u--input>
			  
		</view>
		
		<view class="menu">
			<u-tabs :list="list1" :activeStyle="{ color: '#2281FE' }" @click="toggle"></u-tabs>
			<!-- <template v-if="type===1">
				<view class="item" @click="goTo(`/pagesub/voices/select`)">
					<view class="tit">声音选择</view>
					<view class="r-b">
						<view class="txt">{{task.default_voice.type}}</view>
						<u-icon name="arrow-right" size="22" color="#999999"></u-icon>
					</view>
				</view>
				
				<view class="item" @click="show=true">
					<view class="tit">语速设置</view>
					<view class="r-b">
						<view class="txt">{{value1}}</view>
						<u-icon name="arrow-right" size="22" color="#999999"></u-icon>
					</view>
				</view>
			</template> -->
			<!-- <template v-else> -->
				<view class="voice-list">
					<template v-if="list.length">
						<view class="voice-box" style="margin-top: 10rpx;" v-for="(item,index) in list" :key="index" :class="{ blueBox: item.id===current}" @click="current=item.id">
							<view class="m-btn" @click.stop="handleItem(item)">
								<image :src="`/static/images/mine/${item.id === playDataId? 'pause': 'play'}.png`" class="play"></image>
							</view>
							<view class="info">
								<view>{{item.name}}</view>
								<view class="time">{{item.created_at}}</view>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="tips">暂无克隆的声音,<text style="color: blue" @click="goTo('/pagesub/mine/clone')">去添加</text></view>
					</template>
				</view>
			<!-- </template> -->
			
		</view>
		
		<view class="btn-box">
			<u-button type="primary" shape="circle" color="#2281FE" size="large" text="合成配置" @click="save"></u-button>
		</view>
		
		<!-- <u-picker :show="show" :columns="columns" keyName="key" @cancel="show=false" @confirm="confirm"></u-picker> -->
	</view>
</template>

<script setup>
	import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
	import { goTo } from '@/utils/helper.js'
	import { useTaskStore } from '@/stores'
	import { voiceAliJob, voiceCloneIndex, cloneTextVoice } from '@/api'
	
	onLoad((option)=>{
		form.value.answer_id = option.answer_id
		form.value.answer_keyword_id = option.id
	})
	onShow(()=>{
		// getOemInfo()
		getList()
	})
	const task = useTaskStore()
	const voice_id = ref(null)
	const value1 = ref('正常')
	const show = ref(false)
	const list1 = ref([{name: '我的音色',value: 2}])
	const type = ref(1)
	const is_aiaudio = ref(0)
	const num = ref(0)
	const columns = reactive([[{key: '0.5倍', value: -500},{key: '正常', value: 0}, {key: '1.25倍',value: 125}, {key: '1.5倍', value: 250}, {key: '2倍', value: 500}]])
	let innerAudioContext = null
	const current = ref(null)
	const form = ref({
		// room_id: '',
		content: '',
		answer_id: '',
		title: '',
		answer_keyword_id: '',
	})
	
	const list = ref([])
	const getList = ()=>{
		voiceCloneIndex({ page:1, size: 1000 }).then(res =>{
			list.value = res.data.list.filter(v=> {return v.status===2})
			if(list.value.length===1) current.value = list.value[0].id
		})
	}
	
	function confirm(data){
		form.value.speech_rate = data.value[0].value
		value1.value = data.value[0].key
		show.value = false
	}
	
	function save(){
		// 克隆文字转语音
		if(!form.value.content) return uni.showToast({title: '请输入要转换语音的内容!',icon: 'none',duration: 2000});
		if(!form.value.title) return uni.showToast({title: '语音名称不能为空!',icon: 'none',duration: 2000});
		if(!current.value) return uni.showToast({title: '请点击选择音色!',icon: 'none',duration: 2000});
		const obj = {
			type: 2,
			title: form.value.title,
			answer_id: form.value.answer_id,
			answer_keyword_id: form.value.answer_keyword_id,
			content: form.value.content,
			voice_clone_id: current.value
		}
		const byte_num = obj.content.length * 3
		uni.showModal({
			title: '提示',
			content: `本次生成需消耗${byte_num}字符数,是否继续?`,
			confirmText: '确定',
			showCancel: true,
			success: res => {
				if(res.confirm){
					cloneTextVoice(obj).then(res =>{
						uni.showToast({title: '提交成功!',icon: 'success',duration: 1500})
						uni.navigateBack()
					})
				}
			}
		})
	}
	
	
	const toggle = data =>{
		playDataId.value = null
		if(innerAudioContext){
			innerAudioContext.destroy()
			innerAudioContext = null
		} 	
		type.value = data.value
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
	.content {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding: 36rpx 20rpx;
	  box-sizing: border-box;
	  position: relative;
	  min-height: 100vh;
	  
	  .box{
	  	width: 100%;
	  	padding: 34rpx 40rpx;
	  	box-sizing: border-box;
	  	background: #ffffff;
		margin-top: 24rpx;
	  	// margin-bottom: 122rpx;
	  	.title{
	  		font-size: 28rpx;
	  		font-weight: bold;
	  		color: #333333;
	  	}
	  }
	  
	  .txtBox{
		  width: 100%;
		  min-height: 616rpx;
		  background: #ffffff;
		  border-radius: 20rpx;
		  .u-textarea{
		  		  padding-bottom: 50rpx !important;
		  }
		}
		.menu{
			width: 100%;
			min-height: 200rpx;
			background: #ffffff;
			border-radius: 20rpx;
			margin-top: 24rpx;
			padding-bottom: 36rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			color: #666666;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.item{
				width: 100%;
				padding: 0 20rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 60rpx;
				.r-b{
					display: flex;
					align-items: center;
					.txt{
						font-size: 28rpx;
						color: #000;
						margin-right: 10rpx;
					}
				}
			}
			.voice-list{
				padding: 0 30rpx;
				box-sizing: border-box;
				.tips{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 20rpx;
					box-sizing: border-box;
					font-size: 30rpx;
				}
			}
			.blueBox{
				border: 2rpx solid #2281fe;
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
		}
		
		.btn-box{
			width: 100%;
			height: 150rpx;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			flex-shrink: 0;
			position: fixed;
			bottom: 34rpx;
		}
	}
</style>