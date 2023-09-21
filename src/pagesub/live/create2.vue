<template>
<view class="createPage">
	<image src="/static/images/live/bg2.png" class="bg2"></image>
	<view class="contBox">
		<u-navbar 
			title="创建贴图直播" 
			bgColor="transparent" 
			:titleStyle="{'color':'#fff','font-size':'36rpx'}" 
			placeholder
		></u-navbar>
		<!-- 上传区域 -->
		<view class="uploadArea">
			<view class="title">
				<text>直播间贴图</text>
				<text class="tip">*最多可上传4张贴图</text>
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
		<u--form
			class="panel"
			:model="form"
			:rules="rules"
			ref="urlForm"
			errorType="toast"
		>
			<image src="/static/images/live/title.png" class="title"></image>
			<u-form-item prop="live_id">
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
			<view class="liveName">直播间：<text>{{title}}</text></view>
		</u--form>
		<view class="panel">
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
})
const title = ref('')
const rules = reactive({
	live_id: [
		{
			required: true,
			message: '请输入直播账号的抖音号',
			trigger: ['blur', 'change'],
		}
	]
})
let url_validate = false, live_url = '';

const formatter = (value) => {
	// 过滤输入的汉字
    if(value.includes('http')){
      const url = value.split('http')[1]
      return `http${url}`
    }else{
      return value
    }
}
function searchLive(){
	urlForm.value.validate().then(res => {
		url_validate = true
		getLiveTit({live_id: form.live_id}).then(res=>{
			if(res&&res.data){
				title.value = res.data.title
				live_url = res.data.live_url
			}
		})
	}).catch(errors => {
		uni.$u.toast(errors[0].message)
	})
}
function startLive(){
	if(!form.live_id || !url_validate) return uni.$u.toast('未填写抖音号或不正确')
	if(!task.selectVoice) return uni.$u.toast('请选择语音库')
	if(!task.selectReply) return uni.$u.toast('请选择回复')
	const arr = Object.keys(live.liveRoomStick)
	const form2 = {}
	for(let key of arr){
		form2[`${key}_img`] = live.liveRoomStick[key][0] ? live.liveRoomStick[key][0].id : null
	}
	const parame = {...form2, voice_id: task.selectVoice.id, answer_id: task.selectReply.id, live_url, type: 2}
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
})
</script>

<style lang="scss" scoped>
.createPage{
	width: 100%;
	min-height: 100vh;
	.bg2{
		width: 750rpx;
		height: 1127rpx;
	}
	.uploadArea{
		width: 710rpx;
		min-height: 270rpx;
		background: #ffffff;
		border-radius: 20rpx;
		margin: 30rpx 0 0;
		padding: 30rpx;
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