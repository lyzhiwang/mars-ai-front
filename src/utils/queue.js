import { useLiveStore } from '@/stores'
import axios from 'axios'
import { aliJob, checkJob } from '@/api/index'
import { uniAdapter } from 'fant-axios-adapter'
import MediaQueue from '@/utils/media_queue';


class TaskQueue {
	constructor() {
		this.queue = [];  // 存储任务
		this.processing = false;  // 标记是否正在处理任务
		this.live = useLiveStore();	
	  }
	  // 添加任务到队列
	addTask(task) {
	  this.queue.push(task);
	  console.log('this.live', this.live.bot_info)
	  console.log(`任务 "${task}" 已加入队列`);
	  
	  // 如果队列当前没有在处理中，开始处理任务
	  if (!this.processing) {
		this.processQueue();
	  }
	}
  
	// 处理队列中的任务，每次处理 2 个任务
	async processQueue() {
	  this.processing = true; // 设置正在处理状态
	  
	  while (this.queue.length > 0) {
		// 取出最多两个任务
		const tasksToProcess = this.queue.splice(0, 2);
		console.log(`正在处理任务：${tasksToProcess.join(', ')}`);
  
		// 使用 Promise.all() 同时处理这 2 个任务
		await Promise.all(tasksToProcess.map(task => this.processTask(task)));
  
		console.log(`任务 "${tasksToProcess.join(', ')}" 处理完毕`);
	  }
  
	  // 队列处理完成
	  console.log("队列已处理完毕");
	  this.processing = false; // 标记为处理完
	}
  
	// 处理任务
	async processTask(task) {
	  return new Promise(async(resolve) => {
		const service = axios.create({
			baseURL: 'https://api.coze.cn',
			headers: {
				Authorization: `Bearer ${this.live.bot_info.token}`, // 替换为你的个人令牌
				'Content-Type': 'application/json'
			},
			adapter: uniAdapter // 配置适配器
		})
		
		const requestData = {
		  bot_id: this.live.bot_info.bot_id,
		  user_id: '123',
		  // 填充具体的请求参数
		  additional_messages: [
			{ role: 'user', content_type: 'text', content: task }
		  ],
		  stream: false // 是否启用流式响应
		}
		
		try{
			// 发起初始请求
			const initialResponse = await service.post('/v3/chat', requestData);
		
			if (initialResponse.data.code !== 0) {
			  console.error('Initial request failed:', initialResponse.data.message);
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
				console.log('chat回复内容:', sanitizedText);
		
				try {
				  // 合成音频
				  const aliJobResult = await aliJob({ room_id: this.live.liveInfo.id, content: sanitizedText, type: 1 });
				  if (aliJobResult) {
					this.checkTaskJob(this.live.liveInfo.id);
				  }
				} catch (audioError) {
				  console.error('Audio synthesis error:', audioError);
				}
			  }
			}, 1000);
			
			this.checkTaskJob =(room_id)=>{
				if(!this.live.liveInfo) return
				checkJob({room_id}).then(res=>{
					if(res&&res.data&&res.data.length>0){
						// 播放欢迎语
						const url = res.data[0]
						console.log('url', url)
						const mediaQueue = new MediaQueue();
						mediaQueue.addList(url)
						resolve(url)
						return
					}else{
						this.checkTaskJob(room_id)
					}
				}).catch((err)=>{
					console.log(4444, err)
				})
			}
			
			
		} catch (error){
			console.error('Error:', error.response?.data || error.message); // 错误处理
		}
	  });
	}
	
}

// 导出类
export default TaskQueue;