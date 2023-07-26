import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
	state: () => ({
		task: {},
		selectVoice: null,
		selectReply: null,
	}),
	actions: {
		setTask(data){
			this.task = data
		},
		setVoice(data){
			this.selectVoice = data
		},
		setReply(data){
			this.selectReply = data
		}
	}
})