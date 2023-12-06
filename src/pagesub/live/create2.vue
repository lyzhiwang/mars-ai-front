<template>
<view class="createPage">
	<image src="/static/images/live/bg2.png" class="bg2"></image>
	<view class="contBox">
		<u-navbar 
			title="创建贴图直播" 
			bgColor="transparent" 
			:titleStyle="{'color':'#fff','font-size':'36rpx'}" 
			placeholder
		>
			<template #left><text></text></template>
		</u-navbar>
		<!-- 平台选择 -->
		<view class="fcc-sb platformArea">
			<view 
				:class="['platform',{'act': selectPlatform === item.id}]" 
				v-for="item in platformList"
				@click="changePla(item.id)"
			>
				<image class="icon" :src="item.icon"></image>
				<text class="name">{{item.name}}</text>
			</view>
		</view>
		<!-- 上传区域 -->
		<view class="uploadArea">
			<view class="title">
				<text>直播间贴图</text>
				<text class="tip">*最多可上传4张贴图（非必传项）</text>
			</view>
			<view class="goToBtn" @click="goTo('/pagesub/live/uploadimg')" v-if="live.liveRoomStick">
				<template v-for="(item, key) in live.liveRoomStick">
					<u-image class="pic" :src="live.liveRoomStick[key][0].url" width="140rpx" height="140rpx" v-if="live.liveRoomStick[key][0]"></u-image>
					<view class="upBox bor" v-else>
						<u-icon name="plus" color="#999999" size="36rpx"></u-icon>
						<view class="text">上传贴图</view>
					</view>
				</template>
				<!-- <u-image class="pic" :src="live.liveRoomStick.left_img.url" width="140rpx" height="140rpx"></u-image>
				<u-image class="pic" :src="live.liveRoomStick.right_img.url" width="140rpx" height="140rpx"></u-image>
				<u-image class="pic" :src="live.liveRoomStick.bottom_img.url" width="140rpx" height="140rpx"></u-image> -->
			</view>
			<view class="goToBtn" @click="goTo('/pagesub/live/uploadimg')" v-else>
				<view class="upBox">
					<u-icon name="plus" color="#999999" size="36rpx"></u-icon>
					<view class="text">上传贴图</view>
				</view>
			</view>
		</view>
		<view class="uploadArea" @click="goTo('/pagesub/live/uploadvideo')">
			<view class="title mar10">直播视频</view>
			<view class="tip">*悬浮在屏幕上部的视频贴图（非必传项）</view>
			<view class="status mg" v-if="live.liveRoomVideo">已上传</view>
			<view class="status mb" v-else>未上传</view>
		</view>
		<u--form
			class="panel shadow"
			:model="form"
			:rules="rules"
			ref="urlForm"
			errorType="toast"
		>
			<image src="/static/images/live/title.png" class="title"></image>
			<!-- 抖音直播 -->
			<u-form-item prop="live_id" v-if="selectPlatform===1">
				<view class="iptBox">
					<u--input 
						v-model.trim="form.live_id" 
						border="none" 
						class="ipt"
						prefixIcon="search"
						prefixIconStyle="font-size: 36rpx;color: #909399"
						placeholder="输入直播账号的抖音号"
					></u--input>
				</view>
				<text class="searchText mc" @click="searchLive">搜索</text>
			</u-form-item>
			<!-- 其他平台直播 -->
			<view class="iptBox" v-else>
				<u--input 
					v-model.trim="form.live_url" 
					border="none" 
					class="ipt"
					prefixIcon="search"
					prefixIconStyle="font-size: 36rpx;color: #909399"
					placeholder="请输入快手直播间地址 "
					:formatter="formatter"
				></u--input>
			</view>
			<view class="liveName" v-if="selectPlatform===1">直播间：<text>{{title}}</text></view>
		</u--form>
		<view class="panel shadow">
			<view class="flex between">
				<view class="lebel">选择语音库</view>
				<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add" @click="goTo('/pagesub/voices/taskStore?type=2')"></u-button>
			</view>
			<view class="selectItem" v-if="task.selectVoice">
				<image src="/static/images/live/ico-voice.png" class="voice"/>
				<text>{{task.selectVoice.title}}</text>
			</view>
		</view>
		<view class="panel shadow">
			<view class="flex between">
				<view class="lebel">选择智能回复</view>
				<u-button plain type="primary" text="添加" icon="plus" shape="circle" class="add" @click="goTo('/pagesub/voices/taskStore?type=3')"></u-button>
			</view>
			<view class="selectItem" v-if="task.selectReply">
				<image src="/static/images/live/ico-reply.png" class="voice"/>
				<text>{{task.selectReply.title}}</text>
			</view>
		</view>
		<view class="panel shadow">
			<view class="flex between mar20">
				<text class="h1">欢迎语</text>
				<view>
					<u-switch v-model="welcome" size="40"></u-switch>
				</view>
			</view>
			<view class="flex between">
				<view class="lebel">间隔时间</view>
				<view class="flex">
					<u-number-box
						v-model="welcome_interval" 
						:min="30" 
						:step="5" 
						:disabled="!welcome" 
						inputWidth="80" 
						buttonSize="50"
						integer
					></u-number-box>&nbsp;秒
				</view>
			</view>
		</view>
		<view class="placeholder"></view>
		<view class="fixedArea">
			<u-button type="primary" text="确定" shape="circle" class="submit" @click="startLive"></u-button>
		</view>
	</view>
</view>
</template>

<script setup>
import { useConfigStore, useTaskStore, useLiveStore } from '@/stores'
import { getLiveTit, createLiveRoom, getLiveRoom } from '@/api'
import { goTo } from '@/utils/helper'

const config = useConfigStore()
const task = useTaskStore()
const live = useLiveStore()
const urlForm = ref()
const form = reactive({
	live_id: null,
	live_url: '',
})
const title = ref('')
const welcome = ref(false) // 是否开启欢迎语
const welcome_interval = ref(30) // 欢迎的间隔时间
const selectPlatform = ref(1) // 当前选择的直播平台
const rules = reactive({
	live_id: [
		{
			required: true,
			message: '请输入直播账号的抖音号',
			trigger: ['blur', 'change'],
		}
	]
})
const platformList = [
	{id: 1, name: '抖音直播', icon: '/static/images/live/dy.png'},
	{id: 2, name: '快手直播', icon: '/static/images/live/ks.png'}
]

const formatter = (value) => {
	// 过滤输入的汉字
    if(value.includes('http')){
		// 使用正则表达式匹配字符串中的 URL
		const matches = value.match(/(https?:\/\/[^\s]+)/g);
		return (matches && matches.length > 0) ? matches[0] : '';
    }else{
      return value
    }
}
function changePla(id){
	selectPlatform.value = id
	form.live_id = null
	form.live_url = ''
}
function searchLive(){
	urlForm.value.validate().then(res => {
		getLiveTit({live_id: form.live_id}).then(res=>{
			if(res&&res.data){
				title.value = res.data.title
				form.live_url = res.data.live_url
			}
		})
	}).catch(errors => {
		uni.$u.toast(errors[0].message)
	})
}
function startLive(){
	if(selectPlatform.value==1 && (!form.live_id || !form.live_url)) return uni.$u.toast('未填写抖音号或不正确')
	else if(!form.live_url) return uni.$u.toast('未填写直播间地址')
	if(!task.selectVoice) return uni.$u.toast('请选择语音库')
	if(!task.selectReply) return uni.$u.toast('请选择回复')
	let form2 = {}
	if(live.liveRoomStick){
		const arr = Object.keys(live.liveRoomStick)
		for(let key of arr){
			form2[`${key}_img`] = live.liveRoomStick[key][0] ? live.liveRoomStick[key][0].id : null
		}
	}
	const parame = {...form2, voice_id: task.selectVoice.id, answer_id: task.selectReply.id, is_welcome: welcome.value, live_url: form.live_url, type: 2, platform: selectPlatform.value}
	if(welcome.value){
		parame.welcome_interval = welcome_interval.value
	}
	if(live.liveRoomVideo){
		parame.video = live.liveRoomVideo.id
		parame.video_model = live.liveRoomVideo.video_model
	}
	createLiveRoom(parame).then(res=>{
		if(res){
			// 开始直播
			// live.setTitle(title.value)
			uni.redirectTo({url: '/pagesub/live/sticker'})
		}
	})
}
onBeforeUnmount(()=>{
	if(task.selectVoice) task.setVoice(null)
	if(task.selectReply) task.setReply(null)
	if(live.liveRoomVideo) live.setLiveRoomVideo(null)
})
</script>

<style lang="scss" scoped>
.mar20{
	margin-bottom: 20rpx;
}
.mar10{
	margin-bottom: 10rpx;
}
.createPage{
	width: 100%;
	min-height: 100vh;
	.bg2{
		width: 750rpx;
		height: 1127rpx;
	}
	.platformArea{
		padding-top: 20rpx;
	}
	.platform{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 328rpx;
		height: 96rpx;
		background: #ffffff;
		border-radius: 15rpx;
		transition: all 500ms;
		.icon{
			width: 42rpx;
			height: 42rpx;
		}
		.name{
			font-size: 36rpx;
			color: #333333;
			margin-left: 6rpx;
		}
		&.act{
			border: 2rpx solid #1e64fe;
			box-shadow: -1rpx 2rpx 6rpx 0 rgba(0,0,0,0.22); 
			.name{
				color: #207efe;
				font-weight: bold;
			}
		}
	}
	.uploadArea{
		width: 710rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 30rpx 0 0;
		padding: 30rpx;
		position: relative;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #333333;
			font-size: 30rpx;
		}
		.tip{
			font-size: 22rpx;
			color: #999999;
		}
		.goToBtn{
			width: 100%;
			height: 160rpx;
			background: #ffffff;
			border: 2rpx dashed #2281fe;
			border-radius: 10rpx;
			margin-top: 22rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #999999;
			.pic{
				margin: 0 7rpx;
			}
			.upBox{
				width: 140rpx;
				height: 140rpx;
				margin: 0 7rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
			.bor{
				border: 2rpx dashed #999999;
			}
		}
		.status{
			font-size: 24rpx;
			position: absolute;
			right: 30rpx;
			top: 50%;
			transform: translateY(-50%);
			&.mg{
				color: #42b983;
			}
			&.mb{
				color: #2281fe;
			}
		}
	}
}
.contBox{
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	padding: 0 20rpx;
	.panel{
		width: 710rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 30rpx 0;
		position: relative;
		overflow: hidden;
		&.shadow{
			box-shadow: 0 0 8rpx 0 #e0e0e0;
		}
		.title{
			width: 125rpx;
			height: 31rpx;
		}
		.iptBox{
			width: 566rpx;
			height: 60rpx;
			border: 2rpx solid #2281FE;
			border-radius: 30rpx;
			padding: 0 20rpx 0 30rpx;
			position: relative;
			z-index: 2;
			margin: 30rpx 0 26rpx;
		}
		.ipt{
			width: 100%;
			height: 60rpx;
		}
		.searchText{
			font-size: 30rpx;
			padding-left: 14rpx;
			font-weight: 700;
			position: relative;
			z-index: 1;
		}
		.liveName{
			font-size: 30rpx;
			color: #333;
		}
		.icon-msg{
			position: absolute;
			bottom: -4rpx;
			right: -10rpx;
			width: 182rpx;
			height: 216rpx;
			z-index: 0;
		}
		.add{
			width: 134rpx;
			height: 44rpx;
			margin: 0;
		}
		.lebel{
			font-size: 32rpx;
		}
	}
	.h1{
		font-size: 36rpx;
		display: flex;
		align-items: center;
		font-weight: 700;
		color: #1e64fe;
	}
	.between{
		flex-direction: row!important;
		align-items: center;
		justify-content: space-between;
	}
	.fixedArea{
		box-sizing: content-box;
		height: 128rpx;
		width: 710rpx;
		padding-top: 40rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.placeholder{
		box-sizing: content-box;
		width: 710rpx;
		height: 168rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.submit{
		height: 88rpx;
		background: #2281fe;
		font-size: 36rpx;
	}
	.selectItem{
		min-height: 40px;
		background: #ffffff;
		border: 2rpx solid #2281fe;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #333;
		padding: 20rpx;
		.voice{
			width: 36rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}
	}
}
</style>