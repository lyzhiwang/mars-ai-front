import { defineStore } from 'pinia'

export const useLiveStore = defineStore('live', {
	state: () => ({
		wsObj: null, // websocket对象
		innerAudioContext: null, // 音频对象
		isplay: false, // 回复音频是否在播放
		current: 0, // 当前播放的第几个直播音频
		vRef: null,
	}),
	actions: {
		setCurrent(i){
			this.current = i
		},
		setLiveDom(vRef){
			this.vRef = vRef
			this.current = 0
		},
		openLonglink(data) {
			// 打开长连接
			if(this.wsObj) return
			const user = useUserStore()
			if (!user.isLogin) return
			const ws = process.env.NODE_ENV === 'development' ? 'ws://water1.zwstk.cn' : `wss://${window.productApi}/socket.io`
			connectWebsocket(ws, { uid: user.info.userId, ...data }, this.globelMessage, () => {
				// 连接错误
			})
		},
		globelMessage({ channel, data }) {
			switch (channel) {
				case 'WebcastChatMessage': // 评论
					if(!this.innerAudioContext){
						// 初次创建音频对象
						this.innerAudioContext = uni.createInnerAudioContext();
						this.innerAudioContext.onEnded(()=>this.isplay = false);
						this.innerAudioContext.autoplay = true;
					}
					if(!this.isplay){
						// 先降低直播音频声音
						this.isplay = true
						var vdom = this.vRef[this.current]
						vdom.volume = 0.2
						// 再播放回复音频声音
						this.innerAudioContext.src = data.full_path;
						this.innerAudioContext.play();
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