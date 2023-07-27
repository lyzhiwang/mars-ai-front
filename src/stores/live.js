import { defineStore } from 'pinia'
import { dropRight, sample } from 'lodash-es'

export const useLiveStore = defineStore('live', {
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
	}),
	actions: {
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
			// this.current = 0
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
				this.msgList = [data, ...list]
			}
		},
		setCurrentReply(file, msg){
			this.replyVoice = file
			this.currentMsg = msg
		},
		openLonglink(data) {
			// 打开长连接
			if(this.wsObj) return
			const user = useUserStore()
			if (!user.isLogin) return
			const ws = 'wss://mars.lytklw.cn/api/socket.io'
			connectWebsocket(ws, { uid: user.info.userId, ...data }, this.globelMessage, () => {
				// 连接错误
			})
		},
		globelMessage({ channel, data }) {
			switch (channel) {
				case 'WebcastChatMessage': // 评论
					const { comment } = data
					this.addMsg(comment); // 添加用户评论信息到列表
					if(!this.innerAudioContext){
						// 初次创建音频对象
						this.innerAudioContext = uni.createInnerAudioContext();
						this.innerAudioContext.onEnded(()=>{
							this.vRef[this.current].volume = 1
							this.isplay = false
							this.setCurrentReply('', '')
						});
						this.innerAudioContext.autoplay = true;
					}
					if(!this.isplay){
						// 匹配关键字，播放答案语音
						// replyList 回复列表, comment 评论的内容
						const { reply: replyList } = this.liveInfo
						const findObj = replyList.find(opt=>comment.match(new RegExp(opt.keywords.join('|'), 'g')))
						if(findObj){
							// 先降低直播音频声音
							this.isplay = true
							var vdom = this.vRef[this.current]
							vdom.volume = 0.2
							// 从匹配结果的录音中随机选取一个播放
							const randomItem = sample(findObj.media)
							this.innerAudioContext.src = randomItem.full_path;
							this.innerAudioContext.play();
							// 显示当前正在回复的内容
							this.setCurrentReply(randomItem.title, comment)
						}
					}
					break;
				case 'WebcastMemberMessage': // 进入直播间
					break;
				default:
					break;
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