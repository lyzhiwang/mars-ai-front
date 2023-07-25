import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
	state: () => ({
		task: {},
	}),
	actions: {
		setTask(data){
			this.task = data
		}
	}
})