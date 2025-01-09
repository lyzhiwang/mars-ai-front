import { useLiveStore } from '@/stores'
class MediaQueue{
	constructor(){
		this.list = [];
		this.processing = false;  // 标记是否正在处理任务
		this.mediaObj = null;
		this.live = useLiveStore();	
	}
	
	addList(media) {
	  this.list.push(media);
	  console.log(`任务 "${media}" 已加入队列`);
	  
	  // 如果队列当前没有在处理中，开始处理任务
	  if (!this.processing) {
		this.processQueue();
	  }
	}
	
	// 处理队列中的任务，每次处理 2 个任务
	async processQueue() {
	  this.processing = true; // 设置正在处理状态
	  
	  while (this.list.length > 0) {
		// 取出最多两个任务
		const mediaUrl = this.list.shift();
		console.log(`正在处理任务：${mediaUrl}`);
	  
		// 使用 Promise.all() 同时处理这 2 个任务
		// await Promise.all(tasksToProcess.map(task => this.processTask(task)));
		await this.playMedia(mediaUrl)
		// console.log(`任务 "${tasksToProcess.join(', ')}" 处理完毕`);
	  }
	  
	  // 队列处理完成
	  console.log("队列已处理完毕");
	  this.processing = false; // 标记为处理完
	}
	
	
	playMedia(url){
		return new Promise((resolve) => {
			this.mediaObj = uni.createInnerAudioContext();
			console.log('this.mediaObj', this.mediaObj)
			// 然后再播放欢迎语
			this.mediaObj.src = url
			this.mediaObj.autoplay = true
			this.mediaObj.volume = 1
			// 先暂停当前其他正在播放的声音
			console.log('进入可播放',this.live.innerAudioContext)
			if(this.live.innerAudioContext && !this.live.innerAudioContext.paused){
				this.live.innerAudioContext.pause()
			}else{
				this.live.vRef[this.live.current].pause()
			}
			this.mediaObj.play();
			// 处理音频播放结束
			  this.mediaObj.onEnded(this.welcomeEnd(resolve));
		
			  // 错误处理
			  if (plus.os.name !== 'iOS') {
				this.mediaObj.onError(() => {
				  this.welcomeEnd(resolve);
				});
			  }
		})
	}
	
	welcomeEnd(resolve){
		console.log('进入关闭')
		// if(this.innerAudioContext.currentTime>0 && this.innerAudioContext.currentTime<this.innerAudioContext.duration) {
		if(this.live.innerAudioContext && this.live.innerAudioContext.paused && this.live.isplay) {
			// 被暂停的回复继续播放
			this.live.innerAudioContext.play()
		}else if(this.live.vRef.length>0){
			this.live.vRef[this.live.current].play()
		}
		this.mediaObj.destroy()
		this.mediaObj = null
		console.log('mediaObj', this.mediaObj)
		 resolve();
	}
}

// 导出类
export default MediaQueue;