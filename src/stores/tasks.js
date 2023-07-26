import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
	state: () => ({
		task: {},
		selectVoice: null,
		selectReply: null,
	}),
	actions: {
		setTask(data){
			console.log('data111',data)
			this.task = data
		},
		setVoice(data){
			this.selectVoice = data
		},
		setReply(data){
			console.log(888, data)
			this.selectReply = data
		}
	}
})