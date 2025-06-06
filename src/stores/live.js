import { defineStore } from 'pinia'
import { dropRight, sample } from 'lodash-es'
import { connectWebsocket, sendDateByChannel } from '../utils/socket'
import { useUserStore } from '@/stores'
import { aliJob, checkJob } from '@/api/index'
import axios from 'axios'
import { uniAdapter } from 'fant-axios-adapter'
import dayjs from 'dayjs';
import WebSocketService from '@/utils/xhs_ws.js'

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
		wlcObj: null, // 欢迎的音频对象
		request_type: 1, //区分抖音抓取方式
		timer: null, //3分钟定时自动回复
		timeKeeping: null, // 自动报时定时器
		chatStatus: false, // chat回复状态
		mediaPollingStatus: false, // 是否轮询查语音合成状态
		bot_info: {is_publish:0, token: ''}, // 智能体相关信息
		pollTimer: null,
		thankYouForWelcome: [
			'能不能给主播点个关注啊，支持下主播，谢谢宝子们',
			'能不能给主播点点赞，支持下扣1有福利',
			'你想了解咱们家的优惠活动吗？私信主播，或者直播间扣1哦',
			'想了解我们家的福利吗？给主播扣个1，主播详细解释哦',
			'你还在吗？在的话，点个关注支持下吧',
			'你还在吗？扣个1，主播给您详细解说下咱们的活动',
			'扣个1互动下吧，咱们做做数据，感谢支持',
			'进直播间咱们动动发财小手，点赞支持下吧，扣1有惊喜哦',
			'新号开播，点赞支持下吧，扣1，有福利哦，试试吧',
			'感谢家人的支持，扣个1 专属活动给你哦',
			'扣1有惊喜福利，宝子赶快试试'
		],
		thankYouForLike: [
		  "谢谢宝子们的点赞支持，扣个1，福利给你，试试吧！",
		  "开心一整天，您的支持就是主播的动力",
		  "感谢支持，感谢点赞，扣个1，主播给你专属福利！",
		  "这个点赞的真是帅，真是美，人美心善，谢谢宝子们的支持！",
		  "感谢我家人们的支持，有你们太好了，给主播扣1，我给你们发福利！",
		  "咱们福利多多，扣1，立享专属福利，赶快试试！",
		  "真是亲人啊，新号开播，人少活动好，扣1立享福利！",
		  "在现场主播都想抱一个，给你准备了专属福利，扣1领取！",
		  "一看就是敞亮人，想了解咱们的福利吗？扣个1吧！",
		  "主播给咱们准备了超多福利哦，扣1了解一下吧！"
		],
		thankYouForFollow: [
		  "咱们关注走一走，爱你到永久，扣1有福利等着你！",
		  "给主播点个赞，扣1，专享福利留给你哦！",
		  "您的支持，是我们最大的鼓励，扣1，专属福利留给你！",
		  "宝子真是人美心善啊，大家都要模仿，咱们扣1放福利！",
		  "您的关注是我们最好的礼物，咱们不小气，扣1领福利！"
		],
		thankYouForGift:[
		  "这个送礼的真是人美心善，咱们扣个1，专属福利送给你！",
		  "咱们直播间的福利已经准备好啦，赶紧来看！",
		  "宝子你想要什么，想了解什么，扣个1，咱们VIP讲解！",
		  "宝子真是爱你哦，咱们是福利直播间，要不直播给你跳一个吧！",
		  "宝子真是太热情了，你扣个1，我给你个专属福利！",
		  "礼物暖人心啊，再次感谢，右下角的活动可以支持下！"
		]
	}),
	actions: {
		// setPartAutoPlay(bool){
		// 	this.autoplay = bool
		// },
		// setLiveUrl(url){
		// 	this.live_url = url
		// },
		getRandomItem(arr) {
		  const randomIndex = Math.floor(Math.random() * arr.length); // 生成随机索引
		  return arr[randomIndex]; // 返回对应索引的元素
		},
		setRequestType(value){
			this.request_type = Number(value)
		},
		setSynthesiStatus(bool){
			this.synthesizing = bool
		},
		setChatStatus(bool){
			this.chatStatus = bool
		},
		setMediaPollingStatus(bool){
			this.mediaPollingStatus = bool
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
		setBotInfo(data){
			this.bot_info = data
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
		openLonglink(live_url, useself, ws_url, type) {
			// 打开长连接
			if(this.wsObj) return
			const user = useUserStore()
			if (!user.isLogin) return
			if(useself){
				// 使用自己的抓包地址
				// console.log('ws_url', ws_url)
				console.log('live_url', live_url)
				switch(type){
					case 1:
						// 抖音
						this.request_type === 1? connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {live_url}, this.globelMessage, () => {}) : connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 0}, this.globelMessage, () => {})
						break;
					case 2:
						// 快手直播
						connectWebsocket(2,'ws://39.103.62.231:8866', {ShareCode:live_url}, this.globelMessage3, () => {})
						break;
					case 3:
						// 视频号直播
						connectWebsocket(3,ws_url||'wss://mars.lytklw.cn/socket.io', {session:live_url,type: 5}, this.globelMessage4, () => {})
						break;
					case 4:
						// 美团直播
						connectWebsocket(4,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 2}, this.globelMessage5, () => {})
						break;
					case 5:
						// 小红书
						this.globelMessage6
						break;
				}
				// if(type===2){
				// 	// 快手直播
				// 	connectWebsocket(2,ws_url||'wss://mars.lytklw.cn/socket.io', {path:live_url,type: 1}, this.globelMessage3, () => {})
				// }else{
				// 	// 抖音
				// 	connectWebsocket(1,ws_url||'wss://mars.lytklw.cn/socket.io', {live_url}, this.globelMessage, () => {})
				// }
			}else{
				// 使用第三方
				connectWebsocket(1,ws_url||'ws://42.193.254.253:3000/dy', {url: live_url}, this.globelMessage2, () => {})
			}
		},
		replyEnd(){
			this.innerAudioContext.destroy()
			this.innerAudioContext = null
			if(this.vRef.length>0){
				this.vRef[this.current].play()
			}
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
							this.innerAudioContext.autoplay = true;
							this.innerAudioContext.volume = 1;
							this.innerAudioContext.onCanplay(()=>{
								// 先降低直播音频声音
								this.isplay = true
								this.vRef[this.current].pause()
								this.innerAudioContext.play();
							})
							this.innerAudioContext.onEnded(this.replyEnd);
							if(plus.os.name!=='iOS'){
								this.innerAudioContext.onError(this.replyEnd);
							}
						}
						this.innerAudioContext.src = randomItem.full_path;
						// 显示当前正在回复的内容
						this.setCurrentReply(randomItem.title, msg)
					}
				}else{
					if(cb) cb()
				}
			}
		},
		
		// 自动报时
		AutoTimeKeeping(){
			if(this.liveInfo){
				const { id, open_time} = this.liveInfo
				const seconds = open_time * 1000 || 180000
				console.log('进入自动报时', seconds)
				const arr = [
					'家人们呐，现在北京时间##咯！谢谢大伙一直守着直播间，就跟在家唠嗑似的。你们每一分钟陪伴，都是给我撑腰，接下来优惠管够',
					'嘿哟喂！北京时间##闪亮登场！直播间家人们都是“钉子户”呀，谢谢捧场。每一分钟都像给我打鸡血，优惠这就来“轰炸”啦',
					'此刻，北京时间停在##。直播间家人们如诗如画般陪伴，每一分钟都是美好馈赠。我会带着这份暖意，送更多优惠给你们',
					'家人们！北京时间##，冲锋号吹响！感谢你们每一分钟的坚守，这是对我最大的信任。接下来，优惠狂潮即将席卷直播间',
					'哇咔咔！北京时间##到啦！直播间家人们像小天使一样陪着我，每一分钟都超甜。我要把优惠变成糖果，分给大家吃',
					'各位，此刻北京时间为##。感谢直播间家人们始终如一的坚守，每一分钟的支持都是我前行的基石。后续，优惠必不负所望',
					'家人们，瞅瞅现在北京时间##咯！感谢你们没被我“无厘头”的直播风格吓跑，每一分钟陪伴都是对我“高抬贵手”，优惠这就安排',
					'北京时间##，这个时刻因为你们而温暖。直播间家人们的每一分钟陪伴，都像冬日暖阳，我会带着这份温暖，送上更多优惠',
					'哎呦喂！北京时间##啦！直播间家人们活力满满地守着，每一分钟都是能量注入。接下来，优惠风暴即将开启，一起嗨购',
					'诸位看官，此刻京时已至##。蒙诸君不离不弃，每一分钟相伴皆为厚爱。吾必当倾尽全力，奉上诸多优惠，以报诸君'
				]
				this.timeKeeping = setInterval(() => {
					console.log(this.isplay,this.wlcPlaying,this.mediaPollingStatus, this.synthesizing ,this.chatStatus )
					if(!this.isplay&&!this.wlcPlaying&&!this.mediaPollingStatus&& !this.synthesizing && !this.chatStatus){
						this.setSynthesiStatus(true);
						const now_time = dayjs().format('HH点mm分ss秒')
						const randomInt = Math.floor(Math.random() * arr.length);
						const text = arr[randomInt].replace(/##/g, now_time);
						console.log(now_time, randomInt, text)
						aliJob({ room_id: id, content: text, type: 1 })
						    .then(res => {
						        if (res && !this.mediaPollingStatus) {
						            this.checkTaskJob(id);
						        } else {
						            this.setSynthesiStatus(false);
						        }
						    })
						    .catch(() => {
						        this.setSynthesiStatus(false);
						    });
					}
				},seconds)
			}
		},
		
		// 关闭自动报时任务
		closeTimeKeeping(){
			console.log('关闭自动报时任务')
			if(this.timeKeeping) clearInterval(this.timeKeeping)
			
		},
		
		// 三分钟自动随机回复
		AutoRecover(){
			const threeMinutes = 3 * 60 * 1000; // 三分钟的毫秒数
			this.timer = setInterval(() => {
				if(!this.isplay&&!this.wlcPlaying&&this.liveInfo){
					const { reply: replyList } = this.liveInfo
					if(!replyList.length) return;
					const randomInt = Math.floor(Math.random() * replyList.length);
					console.log('randomInt', randomInt)
					// 从匹配结果的录音中随机选取一个播放
					const msg = replyList[randomInt].keywords[0]
					const randomItem = sample(replyList[randomInt].media)
					if(randomItem&&!this.wlcPlaying){
						if(!this.innerAudioContext){
							// 初次创建音频对象
							this.innerAudioContext = uni.createInnerAudioContext();
							this.innerAudioContext.autoplay = true;
							this.innerAudioContext.volume = 1;
							this.innerAudioContext.onCanplay(()=>{
								// 先降低直播音频声音
								this.isplay = true
								this.vRef[this.current].pause()
								this.innerAudioContext.play();
							})
							this.innerAudioContext.onEnded(this.replyEnd);
							if(plus.os.name!=='iOS'){
								this.innerAudioContext.onError(this.replyEnd);
							}
						}
						this.innerAudioContext.src = randomItem.full_path;
						// 显示当前正在回复的内容
						this.setCurrentReply(randomItem.title, msg)
					}
				}	
			  console.log('执行任务！', new Date().toLocaleTimeString());
			}, threeMinutes);
		},
		// 关闭定时任务
		closeAutoRecover(){
			console.log('关闭定时任务')
			if(this.timer) clearInterval(this.timer)
			
		},
		
		// chat自动回复
		async botMsg(content){
			const service = axios.create({
				baseURL: 'https://api.coze.cn',
				headers: {
					Authorization: `Bearer ${this.bot_info.token}`, // 替换为你的个人令牌
					'Content-Type': 'application/json'
				},
				adapter: uniAdapter // 配置适配器
			})
			// 配置请求数据
			const requestData = {
			  bot_id: this.bot_info.bot_id,
			  user_id: '123',
			  // 填充具体的请求参数
			  additional_messages: [
			    { role: 'user', content_type: 'text', content: content }
			  ],
			  stream: false // 是否启用流式响应
			};	
			
			try{
				// 发起初始请求
				const initialResponse = await service.post('/v3/chat', requestData);
			
				if (initialResponse.data.code !== 0) {
				  console.error('Initial request failed:', initialResponse.data.message);
				  this.setChatStatus(false)
				  return;
				}
				
				const { conversation_id, id } = initialResponse.data.data;
				console.log('conversation_id', conversation_id);
				
				// 轮询获取聊天状态
				const pollChatStatus = async () => {
				  try {
					const statusResponse = await service.get('/v3/chat/retrieve', {
					  params: { conversation_id, chat_id: id },
					});
			
					if (statusResponse.data.data.status === 'completed') {
					  clearInterval(this.pollTimer); // 停止轮询
					  return true;
					}
					return false;
				  } catch (error) {
					this.setChatStatus(false)
					console.error('Polling error:', error.response?.data || error.message);
					return false;
				  }
				};
				
				this.pollTimer = setInterval(async () => {
				  const isCompleted = await pollChatStatus();
				  if (isCompleted) {
					// 获取完整消息列表
					const listResponse = await service.get('/v3/chat/message/list', {
					  params: { conversation_id, chat_id: id },
					});
			
					const { data } = listResponse.data;
					const answerContent = data.find(item => item.type === 'answer')?.content || '';
					const sanitizedText = answerContent.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '');
					console.log('Sanitized text:', sanitizedText);
					this.setChatStatus(false)
			
					this.setSynthesiStatus(true);
			
					try {
					  // 合成音频
					  const aliJobResult = await aliJob({ room_id: this.liveInfo.id, content: sanitizedText, type: 1 });
					  if (aliJobResult) {
						  // 判断没有正在轮询的任务才进行轮询查询
						  if(!this.mediaPollingStatus) this.checkTaskJob(this.liveInfo.id);
					  } else {
						this.setSynthesiStatus(false);
					  }
					} catch (audioError) {
					  console.error('Audio synthesis error:', audioError);
					  this.setSynthesiStatus(false);
					}
				  }
				}, 1000);
				
			} catch (error){
				console.error('Error:', error.response?.data || error.message); // 错误处理
			}
		},
		
		globelMessage(data) {
			// 公共处理语音合成的函数
			const processAudioMessage = (userName, message, roomId) => {
				const text = message.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '');
				// const text = `${message} ${sanitizedUserName}`;
				console.log('生成语音文本:', text);
				this.setSynthesiStatus(true);
		
				aliJob({ room_id: roomId, content: text, type: 1 })
					.then(res => {
						if (res && !this.mediaPollingStatus) {
							this.checkTaskJob(this.liveInfo.id);
						} else {
							this.setSynthesiStatus(false);
						}
					})
					.catch(() => {
						this.setSynthesiStatus(false);
					});
			};
		    // 处理评论
		    if (data.content) {
		        if (this.liveInfo) {
		            console.log('处理评论:', this.liveInfo.is_coze, data.content, this.synthesizing, this.chatStatus);
		            if (this.liveInfo.is_coze && !this.chatStatus && !this.synthesizing) {
		                this.addMsg(data.content); // 添加用户评论
		                this.botMsg(data.content); // 自动回复
		                this.setChatStatus(true);
		            } else {
		                this.addMsg(data.content); // 添加用户评论
		                this.startReply(data.content); // 自动回复
		            }
		        }
		    }
		
		    // 处理用户进入直播间
		    if (data.common?.method === 'WebcastMemberMessage') {
		        if (this.liveInfo && this.liveInfo.is_welcome == 1 && !this.synthesizing && !this.chatStatus) {
		            const { id, name_before, name_after } = this.liveInfo;
		            const welcomeText = `${name_before}${data.user.nickname}${name_after},${this.getRandomItem(this.thankYouForWelcome)}`;
		            processAudioMessage(data.user.nickname, welcomeText, id);
		        }
		    }
		
		    // 处理礼物
		    if (data.giftId && !['like', 'social'].includes(data.giftId) && data.user.nickname) {
		        if (this.liveInfo && this.liveInfo.is_gift == 1 && !this.synthesizing && !this.chatStatus) {
		            const { id } = this.liveInfo;
		            const giftText = `感谢${data.user.nickname}送来的礼物,${this.getRandomItem(this.thankYouForGift)}`;
		            processAudioMessage(data.user.nickname, giftText, id);
		        }
		    }
		
		    // 处理点赞
		    if (data.giftId === 'like' && data.user.nickname) {
		        if (this.liveInfo && this.liveInfo.is_like == 1 && !this.synthesizing && !this.chatStatus) {
		            const { id } = this.liveInfo;
		            const likeText = `感谢${data.user.nickname}的点赞,${this.getRandomItem(this.thankYouForLike)}`;
		            processAudioMessage(data.user.nickname, likeText, id);
		        }
		    }
		
		    // 处理关注
		    if (data.giftId === 'social' && data.user.nickname) {
		        if (this.liveInfo && this.liveInfo.is_social == 1 && !this.synthesizing && !this.chatStatus) {
		            const { id } = this.liveInfo;
		            const followText = `感谢${data.user.nickname}的关注,${this.getRandomItem(this.thankYouForFollow)}`;
		            processAudioMessage(data.user.nickname, followText, id);
		        }
		    }
		},

		
		
		globelMessage3(data){
			console.log('快手data', data)
			// 公共处理语音合成的函数
			const processAudioMessage = (userName, message, roomId) => {
				const text = message.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '');
				// const text = `${message} ${sanitizedUserName}`;
				console.log('生成语音文本:', text);
				this.setSynthesiStatus(true);
					
				aliJob({ room_id: roomId, content: text, type: 1 })
					.then(res => {
						if (res && !this.mediaPollingStatus) {
							this.checkTaskJob(this.liveInfo.id);
						} else {
							this.setSynthesiStatus(false);
						}
					})
					.catch(() => {
						this.setSynthesiStatus(false);
					});
			};
			
			// 处理评论
			if (data.MessageType==="互动") {
			    if (this.liveInfo) {
			        console.log('处理评论:', this.liveInfo.is_coze, data.Content, this.synthesizing, this.chatStatus);
			        if (this.liveInfo.is_coze && !this.chatStatus && !this.synthesizing) {
			            this.addMsg(data.Content); // 添加用户评论
			            this.botMsg(data.Content); // 自动回复
			            this.setChatStatus(true);
			        } else {
			            this.addMsg(data.Content); // 添加用户评论
			            this.startReply(data.Content); // 自动回复
			        }
			    }
			}
			
			// 处理礼物
			if (data.MessageType==="礼物" && data.NickName) {
			    if (this.liveInfo && this.liveInfo.is_gift == 1 && !this.synthesizing && !this.chatStatus) {
			        const { id } = this.liveInfo;
			        const giftText = `感谢${data.NickName}送来的礼物,${this.getRandomItem(this.thankYouForGift)}`;
			        processAudioMessage(data.NickName, giftText, id);
			    }
			}
					
			// 处理点赞
			if (data.MessageType==="点赞" && data.NickName) {
			    if (this.liveInfo && this.liveInfo.is_like == 1 && !this.synthesizing && !this.chatStatus) {
			        const { id } = this.liveInfo;
			        const likeText = `感谢${data.NickName}的点赞,${this.getRandomItem(this.thankYouForLike)}`;
			        processAudioMessage(data.NickName, likeText, id);
			    }
			}
			
			// 处理关注
			if (data.MessageType==="关注" && data.NickName) {
			    if (this.liveInfo && this.liveInfo.is_social == 1 && !this.synthesizing && !this.chatStatus) {
			        const { id } = this.liveInfo;
			        const followText = `感谢${data.NickName}的关注,${this.getRandomItem(this.thankYouForFollow)}`;
			        processAudioMessage(data.NickName, followText, id);
			    }
			}
			
		},
		globelMessage4(data){
			console.log('视频号',data)
			// 公共处理语音合成的函数
			const processAudioMessage = (userName, message, roomId) => {
				const text = message.replace(/[^\u4E00-\u9FA5\w\s\d]/g, '').replace(/\s/g, '');
				// const text = `${message} ${sanitizedUserName}`;
				console.log('生成语音文本:', text);
				this.setSynthesiStatus(true);
					
				aliJob({ room_id: roomId, content: text, type: 1 })
					.then(res => {
						if (res && !this.mediaPollingStatus) {
							this.checkTaskJob(this.liveInfo.id);
						} else {
							this.setSynthesiStatus(false);
						}
					})
					.catch(() => {
						this.setSynthesiStatus(false);
					});
			};
			// 处理评论
			if (data.msgType===1) {
			    if (this.liveInfo) {
			        console.log('处理评论:', this.liveInfo.is_coze, data.content, this.synthesizing, this.chatStatus);
			        if (this.liveInfo.is_coze && !this.chatStatus && !this.synthesizing) {
			            this.addMsg(data.content); // 添加用户评论
			            this.botMsg(data.content); // 自动回复
			            this.setChatStatus(true);
			        } else {
			            this.addMsg(data.content); // 添加用户评论
			            this.startReply(data.content); // 自动回复
			        }
			    }
			}
			
			// 处理用户进入直播间
			if (data.msgType === 10005) {
				console.log('进入直播间')
			    if (this.liveInfo && this.liveInfo.is_welcome == 1 && !this.synthesizing && !this.chatStatus) {
			        const { id, name_before, name_after } = this.liveInfo;
			        const welcomeText = `${name_before}${data.nickname}${name_after},${this.getRandomItem(this.thankYouForWelcome)}`;
					console.log('欢迎语', welcomeText)
			        processAudioMessage(data.nickname, welcomeText, id);
			    }
			}
			
			// 处理礼物
			if (data.msgType === "gift") {
			    if (this.liveInfo && this.liveInfo.is_gift == 1 && !this.synthesizing && !this.chatStatus) {
			        const { id } = this.liveInfo;
			        const giftText = `感谢${data.nickname}送来的礼物,${this.getRandomItem(this.thankYouForGift)}`;
			        processAudioMessage(data.nickname, giftText, id);
			    }
			}
		},
		// 美团
		globelMessage5(data){
			if(data.ms.length>3){
				const msg = JSON.parse(data.ms[3].c) //.c
				switch(msg.msgType){
					case 2:
						// 评论
						if(msg.imMsgDTO){
							this.addMsg(msg.imMsgDTO.content); // 添加用户评论信息到列表
							this.startReply(msg.imMsgDTO.content); // 自动回复
							console.log('回复:', msg.imMsgDTO.content)
						}
						break;
					case 101:
						// 进入直播间
						if(this.liveInfo){
							const { is_welcome, id, name_before, name_after } = this.liveInfo
							if(is_welcome==1 && !this.synthesizing){
								let text = ""
								if(msg.imUserDTO){
									text = name_before + msg.imUserDTO.userName + name_after
									console.log('text', text)
								}else{
									return;
								}
								
								this.setSynthesiStatus(true)
								// 先发起请求告诉服务器开始合成音频
								aliJob({room_id: id, content: text, type:1}).then((res)=>{
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
			}
		},
		// 小红书
		globelMessage6(callback){
			WebSocketService.initSocket((res) => {
			    console.log('接收到服务器消息：', res)
				// ✅ 调用页面传入的回调
				callback && callback(res)
				if(res.MessageType==="二维码" && res.Content){
					// sph_data.value.url = res.Content
					// isSphShow.value = true
				}
				if(res.MessageType === "二维码登录成功"){
					live.setTitle(title.value)
					uni.navigateBack()
				}
			  })
			// 发送消息
			  WebSocketService.sendMessage({
				Action: 'AddWebcast',
				Data: JSON.stringify({ IsNew: true }) // 注意是字符串
			  })
		},
		welcomeEnd(){
			this.wlcPlaying = false
			const interval = 1000 //this.liveInfo.welcome_interval*1000||30000
			// if(this.innerAudioContext.currentTime>0 && this.innerAudioContext.currentTime<this.innerAudioContext.duration) {
			if(this.innerAudioContext && this.innerAudioContext.paused && this.isplay) {
				// 被暂停的回复继续播放
				this.innerAudioContext.play()
			}else if(this.vRef.length>0){
				this.vRef[this.current].play()
			}
			setTimeout(()=>this.setSynthesiStatus(false), interval)
			this.wlcObj.destroy()
			this.wlcObj = null
		},
		playWelcomeWord(url){
			this.wlcObj = uni.createInnerAudioContext();
			// 然后再播放欢迎语
			this.wlcObj.src = url
			this.wlcObj.autoplay = true
			this.wlcObj.volume = 1
			this.wlcObj.onCanplay(()=>{
				this.wlcPlaying = true
				// 先暂停当前其他正在播放的声音
				if(this.innerAudioContext && !this.innerAudioContext.paused){
					this.innerAudioContext.pause()
				}else{
					this.vRef[this.current].pause()
				}
				this.wlcObj.play();
			})
			this.wlcObj.onEnded(this.welcomeEnd)
			if(plus.os.name!=='iOS'){
				this.wlcObj.onError(this.welcomeEnd)
			}
		},
		checkTaskJob(room_id){
			if(!this.liveInfo) return
			this.setMediaPollingStatus(true)
			checkJob({room_id}).then(res=>{
				if(res&&res.data&&res.data.length>0){
					// 播放欢迎语
					const url = res.data[0]
					this.playWelcomeWord(url)
					this.setMediaPollingStatus(false)
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