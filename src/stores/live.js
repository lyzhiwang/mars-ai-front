import { defineStore } from 'pinia'
import { dropRight, sample } from 'lodash-es'
import { connectWebsocket, sendDateByChannel } from '../utils/socket'
import { useUserStore } from '@/stores'
import { aliJob, checkJob } from '@/api/index'

export const useLiveStore = defineStore('live', {
	persist: {
	    enabled: true,
		detached: true, // 设置订阅与组件分离
		strategies: [
		  { paths: ['title'] }
		],
	},
	state: () => ({
		title: '',
		wsObj: null, // websocket对象
		innerAudioContext: null, // 音频对象
		isplay: false, // 回复音频是否在播放
		current: 0, // 当前播放的第几个直播音频
		vRef: [],
		msgList: [],
		currentMsg: '', // 当前正在回复的评论消息
		replyVoice: '', // 当前正在回复的音频的名称
		liveInfo: null,
		liveRoomStick: null, // 直播间贴图地址对象
		liveRoomVideo: null, // 直播间视频贴图对象
		// live_url: '',
		// autoplay: false, // 当前的片段是否自动播放
		isManualClose: false, // 是否手动关闭WS
		synthesizing: false, // 欢迎语合成状态
		wlcPlaying: false, // 欢迎语是否再播报中
	}),
	actions: {
		// setPartAutoPlay(bool){
		// 	this.autoplay = bool
		// },
		// setLiveUrl(url){
		// 	this.live_url = url
		// },
		setSynthesiStatus(bool){
			this.synthesizing = bool
		},
		setIsManualClose(data){
			this.isManualClose = data
		},
		setLiveRoomStick(obj){
			this.liveRoomStick = obj
		},
		setLiveRoomVideo(obj){
			this.liveRoomVideo = obj
		},
		setTitle(tit){
			// 开播前设置title,清除wsObj
			this.title = tit
			this.wsObj = null
		},
		setCurrent(i){
			this.current = i
		},
		setLiveDom(vRef){
			this.vRef = vRef
		},
		setLiveInfo(info){
			this.liveInfo = info
		},
		addMsg(data){
			const len = this.msgList.length
			if(len<20){
				this.msgList.unshift(data)
			}else{
				const list = dropRight(this.msgList, 1)
				list.unshift(data)
				this.msgList = list
			}
		},
		setCurrentReply(file, msg){
			this.replyVoice = file
			this.currentMsg = msg
		},
		openLonglink(live_url, useself, ws_url) {
			// 打开长连接
			if(this.wsObj) return
			const user = useUserStore()
			if (!user.isLogin) return
			if(useself){
				// 使用自己的抓包地址
				connectWebsocket(ws_url||'wss://mars.lytklw.cn/socket.io', {live_url}, this.globelMessage, () => {})
			}else{
				// 使用第三方
				connectWebsocket(ws_url||'ws://42.193.254.253:3000/dy', {url: live_url}, this.globelMessage2, () => {})
			}
		},
		replyEnd(){
			this.innerAudioContext.destroy()
			this.innerAudioContext = null
			this.vRef[this.current].play()
			this.isplay = false
			this.setCurrentReply('', '')
		},
		startReply(msg, cb){
			if(!this.isplay&&!this.wlcPlaying){
				// 匹配关键词，播放答案语音
				// replyList 回复列表, msg 评论的内容
				const { reply: replyList } = this.liveInfo
				const findObj = replyList.find(opt=>opt.keywords&&msg.match(new RegExp(opt.keywords.join('|'), 'g')))
				if(findObj){
					// 从匹配结果的录音中随机选取一个播放
					const randomItem = sample(findObj.media)
					if(randomItem&&!this.wlcPlaying){
						if(!this.innerAudioContext){
							// 初次创建音频对象
							this.innerAudioContext = uni.createInnerAudioContext();
							this.innerAudioContext.onEnded(this.replyEnd);
							this.innerAudioContext.onError(this.replyEnd)
							this.innerAudioContext.autoplay = true;
						}
						// 先降低直播音频声音
						this.innerAudioContext.onCanplay(()=>{
							this.isplay = true
							this.vRef[this.current].pause()
							this.innerAudioContext.play();
						})
						this.innerAudioContext.src = randomItem.full_path;
						// 显示当前正在回复的内容
						this.setCurrentReply(randomItem.title, msg)
					}
				}else{
					if(cb) cb()
				}
			}
		},
		globelMessage({ type, info }) {
			switch (type) {
				case 'live': // 评论
					if(this.liveInfo){
						this.addMsg(info); // 添加用户评论信息到列表
						this.startReply(info); // 自动回复
					}
					break;
				case 'enter': // 进入直播间
					if(this.liveInfo){
						const { is_welcome, id } = this.liveInfo
						if(is_welcome==1 && !this.synthesizing){
							this.setSynthesiStatus(true)
							// 先发起请求告诉服务器开始合成音频
							aliJob({room_id: id, content: info}).then((res)=>{
								if(res){
									// 轮询接口查看音频合成状态
									this.checkTaskJob(id)
								}else{
									this.setSynthesiStatus(false)
								}
							}).catch((err)=>{
								// console.log(111, err)
								this.setSynthesiStatus(false)
							})
						}
					}
					break;
			}
		},
		welcomeEnd(welcome){
			this.wlcPlaying = false
			const interval = this.liveInfo.welcome_interval*1000||30000
			// if(this.innerAudioContext.currentTime>0 && this.innerAudioContext.currentTime<this.innerAudioContext.duration) {
			if(this.innerAudioContext && this.innerAudioContext.paused && this.isplay) {
				// 被暂停的回复继续播放
				this.innerAudioContext.play()
			}else{
				this.vRef[this.current].play()
			}
			setTimeout(()=>this.setSynthesiStatus(false), interval)
			welcome.destroy()
		},
		playWelcomeWord(url){
			const welcome = uni.createInnerAudioContext();
			// 然后再播放欢迎语
			welcome.src = url
			welcome.autoplay = true
			welcome.volume = 1
			welcome.onCanplay(()=>{
				this.wlcPlaying = true
				// 先暂停当前其他正在播放的声音
				if(this.innerAudioContext && !this.innerAudioContext.paused){
					this.innerAudioContext.pause()
				}else{
					this.vRef[this.current].pause()
				}
				welcome.play();
			})
			welcome.onEnded(()=>this.welcomeEnd(welcome))
			welcome.onError(()=>this.welcomeEnd(welcome))
		},
		checkTaskJob(room_id){
			if(!this.liveInfo) return
			checkJob({room_id}).then(res=>{
				if(res&&res.data&&res.data.length>0){
					// 播放欢迎语
					const url = res.data[0]
					this.playWelcomeWord(url)
					return
				}else{
					this.checkTaskJob(room_id)
				}
			}).catch((err)=>{
				// console.log(4444, err)
				// this.checkTaskJob(room_id)
				this.setSynthesiStatus(false)
			})
		},
		globelMessage2(data){
			const { content } = data
			if(content){
				this.addMsg(content); // 添加用户评论信息到列表
				this.startReply(content); // 自动回复
			}
		},
		cancelSub(channel) {
			// 取消通道的订阅
			if(!this.wsObj) return
			const user = useUserStore()
			sendDateByChannel({ uid: user.info.userId, channel, sub: false })
		},
		subscribe(channel, data) {
			// 订阅某个通道的数据
			const user = useUserStore()
			sendDateByChannel({
				uid: user.info.userId,
				channel,
				sub: true,
				data
			})
		},
	}
})