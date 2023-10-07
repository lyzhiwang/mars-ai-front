<template>
<view class="livePage">
	<view class="bg"></view>
	<view class="contBox">
		<view class="panel">
			<button class="create" @click="goTo('/pagesub/live/create')">
				<image src="/static/images/live/crt.png" class="ion-crt"></image>
				<text>创建新直播间</text>
			</button>
			<view class="h1">
				<text>直播间</text>
				<image src="/static/images/live/living.png" class="status" v-if="live.liveInfo"></image>
			</view>
			<text class="name">直播间名称：{{live.title}}</text>
			<view class="bottom">
				<block v-if="live.liveInfo">
					<text class="mc" >直播中</text>
					<image src="/static/images/live/icon-playing.gif" class="playing"></image>
					<u-icon name="play-circle-fill" size="50rpx" color="#1E64FE"></u-icon>
				</block>
				<block v-else>
					<text class="mc">暂未开播</text>
					<u-icon name="pause-circle-fill" size="50rpx" color="#1E64FE"></u-icon>
				</block>
				<text class="filename">{{partName}}</text>
			</view>
		</view>
		<view class="panel">
			<view class="h1">
				<text>直播间</text>
				<image src="/static/images/live/reply.png" class="status"></image>
			</view>
			<view class="trying">
				<text>正在回复</text>
				<view class="replyBox">
					<u--input
						class="ipt"
						border="none"
						placeholder="暂无回复"
						v-model="live.currentMsg"
						shape="circle"
						readonly
					></u--input>
				</view>
			</view>
			<view class="bottom">
				<text class="mc">语音回复</text>
				<u-icon :name="live.isplay?'pause-circle-fill':'play-circle-fill'" size="50rpx" color="#1E64FE"></u-icon>
				<text class="filename">{{live.replyVoice}}</text>
			</view>
		</view>
		<view class="panel">
			<view class="tit">直播间回复列表</view>
			<view class="li" v-for="(item, i) in live.msgList" :key="i">
				<!-- <view class="state">未回复</view> -->
				<view class="quesion">{{item}}</view>
				<view class="btnGroup">
					<button type="default" class="btn reply" @click="activeReply(item)"><image src="/static/images/live/msg.png" class="lIcon"></image>回复</button>
					<button type="default" class="btn collect" @click="collect(item)"><image src="/static/images/live/collect.png" class="lIcon"></image>收录</button>
				</view>
			</view>
		</view>
	</view>
	<!-- 循环播放音频区 -->
	<!-- :ref="el=>vRef[i]=el" -->
	<template v-if="live.liveInfo">
		<template v-for="(item,i) in live.liveInfo.voice_media">
			<video
				v-if="i<limit"
				:id="`vDom${i}`"
				:src="item.tempFilePath||item.full_path" 
				:key="i"
				:autoplay="live.current===i"
				:muted="live.isplay"
				@ended="partEnd" 
				@error="interrupt"
				class="none"
			></video>
		</template>
	</template>
</view>
</template>

<script setup>
import { onLoad, onShow, onHide, onBackPress } from '@dcloudio/uni-app'
import { useUserStore, useLiveStore } from '@/stores'
import { getLiveRoom, addKeyword, errorStatistics } from '@/api'
import { goTo, randomArr, downLoadAudio } from '@/utils/helper'
import { closeWebsocket } from '@/utils/socket'

const user = useUserStore()
const live = useLiveStore()
const limit = ref(2) // 控制video渲染个数
let round = 1, i = 0, voiceArr = []; // 轮数和当前播放的第几个

const partName= computed(()=>live.liveInfo&&live.liveInfo.voice_media[live.current] ? live.liveInfo.voice_media[live.current].title : '')
const getItem = (media)=> {
	const { title, upload } = media
	return {"full_path": upload.full_path, "title": title||upload.name};
}
function activeReply(msg){
	// 主动点击回复
	live.startReply(msg, ()=>{
		uni.showToast({title: '暂无匹配的关键词', icon: 'none'})
	})
}
function collect(title){
	addKeyword({answer_id: live.liveInfo.answer_id, title}).then(res=>{
		if(res){
			uni.showToast({ title:'收录成功',icon: 'success'})
		}
	})
}
function interrupt(event){ // 播放中断
	try{
		// const { target, detail, type, code } = event
		errorStatistics({...event, media: live.liveInfo.voice_media[live.current]})
	}catch(e){
		//TODO handle the exception
	}
	// live.vRef[live.current].stop()
	// partEnd() // 播放下个音频
}
function nextRound(){ // 播放下一轮
    if(live.liveInfo.sort_type==2 && voiceArr.length>2){
		// 开启了随机播放
		voiceArr = randomArr(voiceArr)
    }
    i = 0
    round++
}
function partEnd(){
	// live.vRef[live.current].autoplay = false
	if(i===(voiceArr.length-1)){ // 下一轮 播放第一个音频
	    nextRound()
	}else{ // 当前轮 播放下一个音频
	    i++
		if(limit.value < voiceArr.length){
			limit.value++
		}
	}
	live.setCurrent(voiceArr[i])
	var vdom = live.vRef[live.current]
	// vdom.volume = live.isplay ? 0.2 : 1 // 回复在播放得时候声音降低
	// vdom.autoplay = true
	vdom.play()
}
function exit(){
	try{
		// 重置数据
		limit.value = 2
		closeWebsocket()
		if(live.vRef[live.current]) live.vRef[live.current].stop()
		if(live.innerAudioContext) live.innerAudioContext.destroy()
		live.$patch({
			current: 0,
			vRef: [], 
			liveInfo: null, 
			replyVoice: '', 
			currentMsg: '', 
			isplay: false, 
			innerAudioContext: null, 
			msgList: [], 
			wsObj: null,
		})
		round = 1
		i = 0
		voiceArr = []
	}catch(e){
		console.log(444, e)
		//TODO handle the exception
	}
}
onLoad(()=>{
})
onShow(()=>{
	if(live.wsObj) return
	getLiveRoom({type: 1}).then(res=>{
		if(res&&res.data){
			const { voice, answer_keyword, is_kill, is_open, live_url, answer_id, useself, ws_url } = res.data
			const { sort_type, get_media } = voice
			const vRef = []
			const voice_media = get_media.map((media, i)=>{
				const vdom = uni.createVideoContext(`vDom${i}`)
				vRef.push(vdom)
				return getItem(media)
			})
			// 开始下载音频资源
			downLoadAudio(voice_media, (arr)=>{
				live.setLiveDom(vRef)
				voiceArr = voice_media.map((item, index)=>index)
				const info = {
					sort_type,
					voice_media: arr,
					answer_id,
					reply: answer_keyword.map((item)=>{
						return {
							keywords: item.keywords,
							media: item.get_midia.map(getItem)
						}
					})
				}
				live.setLiveInfo(info)
				live.setCurrent(0)
				// 先预加载第一段直播音频
				nextTick(()=>{
					if(vRef[0]) vRef[0].play()
				})
				// 打开获取评论的长连接
				if(is_open===1){
					live.openLonglink(live_url, useself, ws_url)
				}
			})
		}
	})
})
onBackPress(exit)
onHide(exit)
</script>

<style lang="scss" scoped>
.livePage{
	width: 100%;
	min-height: 100vh;
	position: relative;
	.none{
		position: absolute;
		top: 0;
		z-index: 0;
		width: 1px;
		height: 1px;
		opacity: 0;
	}
	.bg{
		height: 100vh;
		background: linear-gradient(180deg,#1e64fe 0%, #f1f4ff 100%);
		position: relative;
		z-index: 1;
	}
	.contBox{
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		padding: 0 20rpx;
		width: 100%;
		overflow: hidden;
	}
	.panel{
		width: 710rpx;
		min-height: 250rpx;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 30rpx 0;
		position: relative;
		.create{
			position: absolute;
			right: 22rpx;
			top: 20rpx;
			width: 236rpx;
			height: 60rpx;
			background: #1e64fe;
			border-radius: 30rpx;
			color: #fff;
			font-size: 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 10rpx;
			.ion-crt{
				width: 30rpx;
				height: 26rpx;
				margin-right: 6rpx;
			}
		}
		.h1{
			font-size: 36rpx;
			display: flex;
			align-items: center;
			font-weight: 700;
			color: #1e64fe;
		}
		.status{
			width: 166rpx;
			height: 31rpx;
			margin-left: 30rpx;
		}
		.trying{
			display: flex;
			align-items: center;
			.replyBox{
				width: 400rpx;
				height: 60rpx;
				margin-left: 13rpx;
				border: 2rpx solid #2281FE;
				border-radius: 30rpx;
				padding: 0 20rpx 0 30rpx;
			}
			.ipt{
				width: 100%;
				height: 60rpx;
			}
		}
		.bottom{
			display: flex;
			align-items: center;
			font-size: 30rpx;
			.mc{
				margin-right: 20rpx;
			}
			.filename{
				color: #666;
				margin-left: 20rpx;
			}
			.playing{
				width: 48rpx;
				height: 48rpx;
				margin-right: 10rpx;
			}
		}
		.tit{
			font-size: 36rpx;
			color: #333333;
			margin-bottom: 10rpx;
		}
		.li{
			width: 650rpx;
			// min-height: 150rpx;
			background: #e8f2ff;
			border-radius: 20rpx;
			margin: 10rpx 0;
			padding: 42rpx 20rpx 16rpx;
			position: relative;
			.state{
				width: 124rpx;
				height: 40rpx;
				line-height: 40rpx;
				background: #1e64fe;
				border-radius: 0px 20rpx 0px 20rpx;
				color: #ffffff;
				font-size: 26rpx;
				text-align: center;
				position: absolute;
				right: 0;
				top: 0;
				&.already{
					background: rgba(30,100,254,0.60);
				}
			}
			.quesion{
				font-size: 30rpx;
				color: #333333;
			}
			.btnGroup{
				display: flex;
				margin-top: 12px;
				justify-content: flex-end;
			}
			.btn{
				height: 55rpx;
				margin: 0 10rpx;
				font-size: 24rpx;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				border-radius: 30rpx;
			}
			.lIcon{
				width: 30rpx;
				height: 30rpx;
			}
			.reply{
				border: 2rpx solid #1e64fe;
				color: #1e64fe;
				min-width: 136rpx;
			}
			.collect{
				background: #1e64fe;
				color: #fff;
				min-width: 132rpx;
			}
		}
	}
}
</style>
